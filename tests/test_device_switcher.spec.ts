import { test, expect } from '@playwright/test';

test('verify Live Device Viewport Switcher Controls on Admin Dashboard', async ({ page }) => {
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

  // 3. Verify Live Device Switcher Controls exist
  console.log('3. Verifying Live Device Viewport Switcher Controls...');
  await expect(page.locator('button:has-text("Desktop (1440px)")')).toBeVisible();
  await expect(page.locator('button:has-text("Tablet (834px)")')).toBeVisible();
  await expect(page.locator('button:has-text("Mobile View (390px)")')).toBeVisible();

  // 4. Click Mobile View Switcher
  console.log('4. Clicking Mobile View Switcher...');
  await page.click('button:has-text("Mobile View (390px)")');
  await page.waitForTimeout(1000);

  // Verify Mobile View Frame Simulation
  await expect(page.locator('text=Mobile Screen Layout (390px)')).toBeVisible();
  await expect(page.locator('text=ONLY 1 AD AT TOP')).toBeVisible();

  console.log('✅ Live Mobile Viewport Switcher verified on https://genz-live.com/admin/settings/ads!');

  // Capture screenshot proof of Mobile Canvas Simulation
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/admin_mobile_device_canvas_proof.png', fullPage: false });
});
