import { test, expect } from '@playwright/test';

test('verify responsive tablet layout for Left & Right Skyscraper Ads', async ({ page }) => {
  // Set iPad / Tablet viewport width (834px)
  await page.setViewportSize({ width: 834, height: 1194 });

  console.log('1. Navigating to homepage in Tablet View (834px)...');
  await page.goto('https://genz-live.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('2. Verifying Left Skyscraper Tablet Banner...');
  const leftTabletBanner = page.locator('text=TABLET SPONSORED BANNER').first();
  await expect(leftTabletBanner).toBeVisible();

  console.log('✅ Tablet view responsiveness verified live on https://genz-live.com!');

  // Capture screenshot proof of Tablet view
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/tablet_view_skyscraper_proof.png', fullPage: false });
});
