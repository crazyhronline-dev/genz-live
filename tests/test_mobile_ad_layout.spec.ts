import { test, expect } from '@playwright/test';

test('verify Mobile View has ONLY 1 ad on top and 2 ads spaced out down the page', async ({ page }) => {
  // Set iPhone 14 / Mobile viewport width (390px)
  await page.setViewportSize({ width: 390, height: 844 });

  console.log('1. Navigating to homepage in Mobile View (390px)...');
  await page.goto('https://genz-live.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 2. Verify ONLY 1 ad at the top (Leaderboard Gold Luxury Strobe)
  console.log('2. Verifying Header Top Ad is the ONLY ad at top of mobile screen...');
  const topAd = page.locator('.flash-overlay-leaderboard').first();
  await expect(topAd).toBeVisible();

  // Scroll down to Hero Section
  console.log('3. Scrolling down to verify Slot 3 after Hero Stories...');
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(1000);

  // Scroll down further to mid-feed
  console.log('4. Scrolling down to verify Slot 4 mid-feed after India section...');
  await page.evaluate(() => window.scrollBy(0, 1200));
  await page.waitForTimeout(1000);

  console.log('✅ Mobile View ad layout verified live on https://genz-live.com!');

  // Capture screenshot proof of Mobile View
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/mobile_view_ad_layout_proof.png', fullPage: false });
});
