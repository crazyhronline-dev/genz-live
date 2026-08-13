import { test, expect } from '@playwright/test';
import path from 'path';

test('verify image file upload and publishing live', async ({ page }) => {
  // 1. Login to admin
  await page.goto('https://genz-live.com/admin/login');
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**');

  // 2. Go to New Article form
  await page.goto('https://genz-live.com/admin/articles/new');
  await page.waitForSelector('form');

  // 3. Fill required title, content, category
  const title = `Upload Image Test ${Date.now()}`;
  await page.fill('input[name="title"]', title);
  await page.fill('textarea[name="content"]', '<p>Testing uploaded image rendering on public page...</p>');

  // 4. Select PUBLISHED status
  await page.selectOption('select[name="status"]', 'PUBLISHED');

  // 5. Upload image file via file input
  const fileInput = page.locator('input[type="file"]');
  // Create sample 1x1 png file path
  const sampleImagePath = path.join(__dirname, 'sample.png');
  await fileInput.setInputFiles({
    name: 'uploaded_test_image.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
  });

  // Wait 1s for upload API / preview to settle
  await page.waitForTimeout(1500);

  // Check that featuredImage input has value (/api/uploads/ or data:image/)
  const imgVal = await page.inputValue('input[name="featuredImage"]');
  console.log('Image input value after file upload:', imgVal);
  expect(imgVal.length).toBeGreaterThan(5);

  // 6. Click Save & Update / Commit Article
  await page.click('button[type="submit"]');

  // Wait for redirect to /admin/articles
  await page.waitForURL('**/admin/articles**', { timeout: 15000 });

  // 7. Verify the newly created article is listed as PUBLISHED
  const row = page.locator('tr', { hasText: title });
  await expect(row).toBeVisible();
  await expect(row).toContainText('PUBLISHED');

  // 8. Open edit mode to verify image input value persisted
  const editBtn = row.locator('a[title="Edit Article"]');
  await editBtn.click();
  await page.waitForURL('**/admin/articles/new?id=*');

  const editImgVal = await page.inputValue('input[name="featuredImage"]');
  console.log('Image input value in Edit mode:', editImgVal);
  expect(editImgVal).toContain('/api/uploads/');

  console.log('TEST_PASSED: Uploaded image persisted and article published successfully!');
});
