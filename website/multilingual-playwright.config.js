// multilingual-playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/multilingual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'tests/reports/multilingual-html' }],
    ['json', { outputFile: 'tests/reports/multilingual-results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'multilingual-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'multilingual-firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'multilingual-webkit',
      use: { ...devices['Desktop Safari'] },
    }
  ],

  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});