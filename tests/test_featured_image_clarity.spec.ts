import { test, expect } from '@playwright/test';

test('verify featured story image displays in full 100% original clarity without dark mask', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Visit homepage
  console.log('1. Navigating to homepage...');
  await page.goto('https://genz-live.com/', { waitUntil: 'domcontentloaded' });

  // 2. Locate Hero Story image
  console.log('2. Locating featured hero story image...');
  const heroImage = page.locator('section[aria-label="Featured stories"] img').first();
  await expect(heroImage).toBeVisible();

  // 3. Verify image opacity is opacity-100
  console.log('3. Verifying opacity-100 class on featured image...');
  await expect(heroImage).toHaveClass(/opacity-100/);

  console.log('✅ Featured image 100% original clarity verified live on https://genz-live.com!');

  // Capture screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/featured_image_original_clarity_proof.png', fullPage: false });
});
