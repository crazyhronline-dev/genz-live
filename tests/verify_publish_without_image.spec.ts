import { test, expect } from '@playwright/test';

test('verify publishing an article without an image works cleanly', async ({ page }) => {
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

  // 3. Verify Optional Image UI box
  const optionalBox = page.locator('text=No Featured Image (Optional)');
  await expect(optionalBox).toBeVisible();

  // 4. Fill form WITHOUT an image
  const uniqueTitle = `Text First News Story ${Date.now()}`;
  console.log('4. Creating article without image:', uniqueTitle);
  await page.fill('input[name="title"]', uniqueTitle);
  await page.fill('textarea[name="excerpt"]', 'This is a clean news article published without a featured image.');
  
  // Set Workflow Status to PUBLISHED
  await page.selectOption('select[name="status"]', 'PUBLISHED');

  // Submit form
  await page.click('button[type="submit"]:has-text("Save Article")');
  await page.waitForTimeout(3000);

  // Take snapshot proof of article management table
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/published_without_image_proof.png' });
});
