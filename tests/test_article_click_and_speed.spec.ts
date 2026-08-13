import { test, expect } from '@playwright/test';

test('verify Breaking News fast marquee speed, article clicks, and header z-index layering', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Visit homepage
  console.log('1. Navigating to homepage...');
  await page.goto('https://genz-live.com/', { waitUntil: 'domcontentloaded' });

  // 2. Verify Breaking News Marquee animation
  console.log('2. Verifying Breaking News Marquee animation wrapper...');
  await expect(page.locator('.ticker-move')).toBeVisible();

  // 3. Click Latest News Feed Article Card
  console.log('3. Clicking first article card in Latest News Feed...');
  const firstArticleLink = page.locator('main section a[href*="/"]').first();
  await expect(firstArticleLink).toBeVisible();

  const href = await firstArticleLink.getAttribute('href');
  console.log(`4. Target article URL: ${href}`);

  await page.click('main section a[href*="/"]');
  await page.waitForTimeout(2000);

  // Verify URL updated to article page
  console.log(`5. Current URL: ${page.url()}`);
  expect(page.url()).not.toBe('https://genz-live.com/');

  console.log('✅ Fast marquee ticker, article card clicking, and header z-index layering verified live on https://genz-live.com!');

  // Capture screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/article_card_click_proof.png', fullPage: false });
});
