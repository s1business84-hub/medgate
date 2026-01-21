const { test, expect } = require('@playwright/test');

test.describe('Pilot smoke flows', () => {
  test('program page loads and Apply button visible', async ({ page }) => {
    // Seed localStorage with demo user and student
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.setItem('electivio_users', JSON.stringify([
        { id: 'sup_demo', name: 'Demo Supervisor', email: 'sup@demo', role: 'hospital' },
        { id: 'stu_demo', name: 'Demo Student', email: 'stu@demo', role: 'student' }
      ]));
      window.localStorage.setItem('electivio_students', JSON.stringify([
        { id: 'stu_demo', name: 'Demo Student', email: 'stu@demo', phone: '', nationality: '', complianceStatus: 'Incomplete', createdAt: new Date().toISOString() }
      ]));
    });

    // Navigate to a known program (seed data uses prog_1)
    await page.goto('/programs/prog_1');
    await expect(page.locator('text=Apply for this Program').first()).toBeVisible();
  });
});
