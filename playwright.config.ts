// @ts-nocheck
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  retries: 0,
  use: {
    // Default to local dev server for fast local runs; override with PLAYWRIGHT_BASE_URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
    headless: true,
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Let Playwright manage the dev server when running tests locally.
  webServer: {
    // Use a small wrapper to start Next and wait for readiness; wrapper logs failures clearly.
    command: 'bash ./scripts/run-dev-for-playwright.sh',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
    reuseExistingServer: true,
    // Give enough time on cold starts (2 minutes)
    timeout: 120 * 1000,
  },
});
