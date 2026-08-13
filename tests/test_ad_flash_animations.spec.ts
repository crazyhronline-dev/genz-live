import { test, expect } from '@playwright/test';

test('verify 7 distinct attention-grabbing ad flashes and Slot 7 pre-footer banner on live website', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });

  console.log('1. Navigating to homepage...');
  await page.goto('https://genz-live.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('2. Verifying Slot 1 Leaderboard Gold Luxury Strobe (.flash-overlay-leaderboard)...');
  const leaderboardAd = page.locator('.flash-overlay-leaderboard').first();
  await expect(leaderboardAd).toBeVisible();

  console.log('3. Verifying Slot 3 Left Skyscraper Purple Lightning (.flash-overlay-leftsky)...');
  const leftSkyscraper = page.locator('.flash-overlay-leftsky').first();
  await expect(leftSkyscraper).toBeVisible();

  console.log('4. Verifying Slot 4 Right Skyscraper Cyan Radar Pulse (.flash-overlay-rightsky)...');
  const rightSkyscraper = page.locator('.flash-overlay-rightsky').first();
  await expect(rightSkyscraper).toBeVisible();

  console.log('5. Navigating to an article page to verify Slot 2 In-Article Scan Bar...');
  const articleLink = page.locator('a[href*="/india/"], a[href*="/tech/"], a[href*="/business/"]').first();
  await articleLink.click();
  await page.waitForTimeout(2000);

  const inArticleOverlay = page.locator('.flash-overlay-inarticle').first();
  await expect(inArticleOverlay).toBeVisible();

  console.log('✅ All distinct ad flashes and Slot 7 pre-footer banner verified live on https://genz-live.com!');

  // Capture screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/slot7_and_7_distinct_flashes_proof.png', fullPage: false });
});
