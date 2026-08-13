import { test, expect } from '@playwright/test';

test('verify image URL persists after saving and returning to edit', async ({ page }) => {
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

  // 3. Fill Article with Custom Image
  const uniqueTitle = `Image Persistence Test ${Date.now()}`;
  const customImgUrl = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80';
  console.log('3. Filling article:', uniqueTitle);
  await page.fill('input[name="title"]', uniqueTitle);
  await page.fill('textarea[name="excerpt"]', 'Testing featured image persistence upon save and re-edit.');
  await page.fill('input[name="featuredImage"]', customImgUrl);
  await page.waitForTimeout(1000);

  // 4. Click Save & Update Article
  console.log('4. Saving article...');
  await page.click('button[type="submit"]:has-text("Save & Update Article")');
  await page.waitForTimeout(3000);

  // 5. Locate the newly created article in table and click Edit
  console.log('5. Searching for article in table to re-edit...');
  const articleRow = page.locator(`tr:has-text("${uniqueTitle}")`).first();
  await expect(articleRow).toBeVisible();
  
  const editBtn = articleRow.locator('a:has-text("Edit")');
  await editBtn.click();
  await page.waitForTimeout(2000);

  // 6. Verify image URL is preserved in input field and live preview
  const savedImgInputVal = await page.locator('input[name="featuredImage"]').inputValue();
  console.log('Saved Image Input Value upon Re-Edit:', savedImgInputVal);
  expect(savedImgInputVal).toBe(customImgUrl);

  const previewImg = page.locator('img[alt*="Featured image preview"]');
  await expect(previewImg).toBeVisible();

  // Take snapshot proof of preserved image upon re-edit
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/saved_image_reedit_persistence_proof.png' });
});
