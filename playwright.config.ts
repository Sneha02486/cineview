// Root Playwright configuration – forwards to the config inside the e2e folder.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Look for test files under the e2e/tests directory.
  testDir: './e2e/tests',
  // Re‑use the same settings as the detailed config.
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
  },
  // Start the dev servers the same way as before.
  webServer: [
    {
      command: 'npm run dev',
      cwd: '.',
      port: 5173,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev:backend',
      cwd: '.',
      port: 5000,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});

