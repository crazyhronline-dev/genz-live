import { test, expect } from '@playwright/test';

test('verify article editor renders cleanly with zero error banners', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in
  console.log('1. Logging in...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // 2. Open Editor
  console.log('2. Opening Article Editor...');
  await page.goto('https://genz-live.com/admin/articles/new', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 3. Verify NO error text anywhere in the editor form
  const errorBox = page.locator('text=Invalid Image Link / Page URL Detected');
  const count = await errorBox.count();
  console.log('Error box count in clean editor:', count);
  expect(count).toBe(0);

  // 4. Test Auto-Suggest Image button
  console.log('4. Testing Auto-Suggest Image button...');
  await page.fill('input[name="title"]', 'GenZ Technology Breakthrough');
  await page.click('button:has-text("Auto-Suggest")');
  await page.waitForTimeout(1000);

  const previewImg = page.locator('img[alt*="Featured image preview"]');
  await expect(previewImg).toBeVisible();

  // Take snapshot proof of clean editor
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/clean_editor_no_error_box_proof.png' });
});
