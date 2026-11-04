import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
if (existsSync('e2e/.dev.vars')) throw new Error('Remove the E2E-directory secret file before running isolated tests.');
const chrome = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (process.platform === 'win32' && existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined);
export default defineConfig({
 testDir:'./e2e', timeout:45_000, fullyParallel:false, workers:1, retries:0,
 reporter:'list', use:{baseURL:'http://127.0.0.1:5199', ...devices['Desktop Chrome'], launchOptions:chrome ? {executablePath:chrome} : {}, trace:'off', screenshot:'off', video:'off'},
 webServer:{command:'npm run dev -- --config vite.e2e.config.ts --host 127.0.0.1 --port 5199 --strictPort',env:{...process.env,CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV:'false',CLOUDFLARE_INCLUDE_PROCESS_ENV:'false',CLOUDFLARE_ENV:''},url:'http://127.0.0.1:5199/api/health',reuseExistingServer:false,timeout:60000},
});
