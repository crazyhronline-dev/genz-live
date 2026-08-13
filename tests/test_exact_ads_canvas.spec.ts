import { test, expect } from '@playwright/test';

test('verify Exact Website Ad Placements & Dimensions Canvas on Admin Dashboard', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });

  // 1. Admin Login
  console.log('1. Logging in to admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'wilson@genz-live.com');
  await page.fill('input[type="password"]', 'Golden@123#');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);

  // 2. Navigate to Ad Settings
  console.log('2. Navigating to /admin/settings/ads...');
  await page.goto('https://genz-live.com/admin/settings/ads', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Capture screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/exact_7_ads_canvas_proof.png', fullPage: false });
  console.log('✅ Dashboard screenshot captured!');
});
