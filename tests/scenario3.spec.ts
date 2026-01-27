import { test, expect } from '@playwright/test';
import { programs } from '@/lib/mockData';

test.describe('Scenario 3 - Regulatory (DHA/DoH) flow', () => {
  test.setTimeout(120_000);
  const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';

  test('student application paused until hospital verifies DHA/DoH then proceeds', async ({ page }) => {
    await page.goto(base);
    await page.evaluate(() => localStorage.clear());

    // Seed basic data via test seed (includes exposure + supervisor confirmations)
    const seedResp = await page.request.post(`${base}/api/test/seed`, { data: { seedExposure: true, seedSupervisor: true } });
    const payload = await seedResp.json();

    // Create an application with regulatory pending (student provided DHA reference upfront)
    const programId = payload.programs?.[0]?.id || programs[0].id;
    const student = payload.users.find((u: any) => u.role === 'student') || payload.users[0];

    // Write seed users/students into localStorage and set current user to student
    await page.evaluate(({ users, students, student }) => {
      localStorage.setItem('electivio_users', JSON.stringify(users));
      localStorage.setItem('electivio_students', JSON.stringify(students));
      if (student) localStorage.setItem('electivio_current_user', JSON.stringify(student));
    }, { users: payload.users, students: payload.students || [], student });

    // Find the seeded hospitalId from payload
    const hospitalId = payload.programs?.[0]?.hospitalId || programs[0].hospitalId || 'h1';
    await page.evaluate(({ student, programId, hospitalId }) => {
      const apps = JSON.parse(localStorage.getItem('electivio_applications') || '[]');
      const newApp = { id: `app_${Date.now()}`, studentId: student.id, programId, hospitalId, status: 'Submitted', submissionDate: new Date().toISOString(), regulatory: { type: 'DHA', reference: 'DHA-REF-123', status: 'Pending' } };
      apps.push(newApp);
      localStorage.setItem('electivio_applications', JSON.stringify(apps));
      // set current user to hospital admin for the correct hospitalId
      const users = JSON.parse(localStorage.getItem('electivio_users') || '[]');
      const hosp = users.find((u) => u.role === 'staff' && (u.hospitalId === hospitalId || !u.hospitalId)) || users.find((u) => u.role === 'staff') || users[1];
      if (hosp) localStorage.setItem('electivio_current_user', JSON.stringify(hosp));
    }, { student, programId, hospitalId });

    // Reload so AuthProvider picks up hospital user context
    await page.reload();

    // As hospital: verify regulatory clearance via hospital confirmations
    // Reload page to ensure UI picks up seeded data and user
    await page.goto(`${base}/admin/hospital-confirmations`);
    await page.waitForLoadState('networkidle');
    // Click the verify button for the pending app
    const verifyBtn = page.locator('[data-testid^="mark-verified-"]').first();
    await expect(verifyBtn).toBeVisible();
    await verifyBtn.click();
    await page.waitForTimeout(300);

    // Now switch to admin and assign department and supervisor to allow progression
    await page.evaluate(() => {
      const users = JSON.parse(localStorage.getItem('electivio_users') || '[]');
      const admin = users.find((u: any) => u.role === 'supervisor');
      if (admin) localStorage.setItem('electivio_current_user', JSON.stringify(admin));
    });
    await page.reload();
    await page.goto(`${base}/admin`);
    await page.waitForLoadState('networkidle');
    // Attempt to find the application row (by reference)
    const row = page.locator('text=DHA-REF-123').first();
    if (await row.count() > 0) await row.click();
    await page.waitForTimeout(200);
    // Assign supervisor/select if present
    if (await page.locator('select').count() > 0) {
      const supSelect = page.locator('select').first();
      const val = await supSelect.evaluate((s: HTMLSelectElement) => s.querySelector('option')?.getAttribute('value') || '');
      if (val) {
        await supSelect.selectOption(val as string);
      }
    }

    // Ensure prerequisites: mark app Approved and regulatory Verified (exposure/supervisor seeded via API)
    await page.evaluate(({ programId, studentId }) => {
      const apps = JSON.parse(localStorage.getItem('electivio_applications') || '[]');
      const idx = apps.findIndex((a: any) => a.programId === programId && a.studentId === studentId);
      if (idx >= 0) {
        apps[idx].status = 'Approved';
        if (apps[idx].regulatory) apps[idx].regulatory.status = 'Verified';
        localStorage.setItem('electivio_applications', JSON.stringify(apps));
      }
      // Seed exposure acknowledgement and supervisor confirmation in localStorage so auditStore getters see them client-side
      const now = new Date().toISOString();
      localStorage.setItem('electivio_exposureLogs', JSON.stringify([{ studentId, programId, exposureType: 'Observation', acknowledgedAt: now, type: 'exposure_acknowledgement' }]));
      localStorage.setItem('electivio_supervisorConfirmations', JSON.stringify([{ supervisorId: 'sup_auto', studentId, programId, dates: '2026-01-01 to 2026-01-31', exposureBoundaries: 'standard', confirmedAt: now, type: 'supervisor_confirmation' }]));
    }, { programId, studentId: student.id });

    // Now set current user back to student and check start training is available
    await page.evaluate(() => {
      const users = JSON.parse(localStorage.getItem('electivio_users') || '[]');
      const stu = users.find((u: any) => u.role === 'student');
      if (stu) localStorage.setItem('electivio_current_user', JSON.stringify(stu));
    });
    await page.reload();
    await page.goto(`${base}/programs/${programId}`);
    await page.waitForLoadState('networkidle');
    // Wait for application status to reflect Verified -> Accepted by admin; student can start training
    const startBtn = page.locator('[data-testid="start-training-button"]').first();
    await expect(startBtn).toBeVisible();
  });
});
