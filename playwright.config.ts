import { defineConfig } from '@playwright/test';
import { DEFAULT_HEADERS } from '@/constants/headers';

const allureEnvironmentInfo = {
  API_BASE_URL: 'https://restful-booker.herokuapp.com',
  NODE_VERSION: process.version,
  FRAMEWORK: 'Playwright',
  LANGUAGE: 'TypeScript',
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
        environmentInfo: {
          ...allureEnvironmentInfo,
        },
      },
    ],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
    trace: 'retain-on-failure',
    extraHTTPHeaders: {
      ...DEFAULT_HEADERS,
    },
  },
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
});
