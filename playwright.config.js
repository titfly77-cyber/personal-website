import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
export default defineConfig({
  testDir:'./tests',
  fullyParallel:false,
  use:{baseURL:'http://127.0.0.1:4173',headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||(process.platform==='win32'&&existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')?'chrome':undefined)},
  webServer:{command:'npm run dev',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
  reporter:'list',
});
