import { test, expect } from '@playwright/test';
import { programs } from '@/lib/mockData';

test.describe('Role-based gating', () => {
  test.setTimeout(120_000);
  const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';

  test('admin sees admin dashboard; student does not; student sees start training on program page', async ({ page }) => {
    // Seed demo data
    await page.goto(base);
    await page.evaluate(() => localStorage.clear());
    const seedResp = await page.request.post(`${base}/api/test/seed`, { data: { programId: programs[0].id, hospitalId: programs[0].hospitalId || 'h1', seedExposure: true, seedSupervisor: true } });
    const payload = await seedResp.json();

    // Admin user
    const admin = payload.users.find((u: any) => u.role === 'admin');
    expect(admin).toBeTruthy();
    await page.evaluate((u) => localStorage.setItem('medgate_current_user', JSON.stringify(u)), admin);
    await page.goto(`${base}/admin`);
    // Admin dashboard heading should be visible
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();

    // Student user should NOT see admin dashboard
    const student = payload.users.find((u: any) => u.role === 'student');
    expect(student).toBeTruthy();
    await page.evaluate((u) => localStorage.setItem('medgate_current_user', JSON.stringify(u)), student);
    await page.goto(`${base}/admin`);
    // The admin page should redirect or not show the Admin Dashboard heading
    await expect(page.locator('text=Admin Dashboard')).not.toBeVisible();

    // Student should see Start Training on program page
    const programId = payload.programs?.[0]?.id || programs[0].id;
    await page.goto(`${base}/programs/${programId}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="start-training-button"]')).toBeVisible();
  });
});
