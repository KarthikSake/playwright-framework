import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import os from 'node:os';

dotenv.config();

const baseURL = process.env.BASE_URL ?? 'https://automationexercise.com';
const isCI = !!process.env.CI;

/**
 * Parallel workers:
 * - WORKERS env wins (local or CI)
 * - CI default: 2 (be gentle to the public AUT)
 * - Local default: half of logical CPUs, min 2
 */
function resolveWorkers(): number {
  if (process.env.WORKERS) {
    const parsed = Number(process.env.WORKERS);
    if (!Number.isFinite(parsed) || parsed < 1) {
      throw new Error(`Invalid WORKERS="${process.env.WORKERS}" — expected a positive integer`);
    }
    return Math.floor(parsed);
  }
  if (isCI) {
    return 2;
  }
  return Math.max(2, Math.floor(os.cpus().length / 2));
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  workers: resolveWorkers(),
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
