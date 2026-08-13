import { test, expect } from '@playwright/test';

test('verify image url and upload preview render without false error warning', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in
  console.log('1. Logging in...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // 2. Open Article Editor
  console.log('2. Opening Article Editor...');
  await page.goto('https://genz-live.com/admin/articles/new', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 3. Test pasting valid image URL
  console.log('3. Testing valid image URL...');
  const testUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80';
  await page.fill('input[name="featuredImage"]', testUrl);
  await page.waitForTimeout(1500);

  // Verify preview image element is visible
  const previewImg = page.locator('img[alt*="Featured image preview"]');
  await expect(previewImg).toBeVisible();

  // Verify NO error warning is displayed
  const errorBox = page.locator('text=Invalid Image Link / Page URL Detected');
  const isErrorVisible = await errorBox.isVisible();
  console.log('Is false error warning visible for valid image URL?:', isErrorVisible);
  expect(isErrorVisible).toBe(false);

  // Take snapshot proof of clean live image preview without error warning
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/clean_image_preview_no_false_warning.png' });
});
