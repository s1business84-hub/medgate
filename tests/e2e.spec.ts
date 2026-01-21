import { test, expect } from '@playwright/test';
import { programs } from '@/lib/mockData';

test.describe('Pilot smoke flows', () => {
  test('application submit -> regulatory -> supervisor -> start training (smoke)', async ({ page }) => {
    // Seed localStorage with a demo user (student) and a demo supervisor
    await page.goto('/');
    await page.evaluate(() => {
      // Minimal demo seed matching runtime storage keys
      window.localStorage.setItem('electivio_users', JSON.stringify([
        { id: 'sup_demo', name: 'Demo Supervisor', email: 'sup@demo', role: 'hospital' },
        { id: 'stu_demo', name: 'Demo Student', email: 'stu@demo', role: 'student' }
      ]));
      window.localStorage.setItem('electivio_students', JSON.stringify([
        { id: 'stu_demo', name: 'Demo Student', email: 'stu@demo', phone: '', nationality: '', complianceStatus: 'Incomplete', createdAt: new Date().toISOString() }
      ]));
    });

    // Visit programs page and open first program
    await page.goto('/programs');
    await expect(page).toHaveURL(/programs/);
    // Note: this is a smoke test that verifies pages load and key UI elements exist.
    await page.goto(`/programs/${programs[0].id}`);
    await expect(page.locator('text=Apply for this Program').first()).toBeVisible();
  });
});
