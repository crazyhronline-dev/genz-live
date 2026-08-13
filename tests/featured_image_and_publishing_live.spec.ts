import { test, expect } from '@playwright/test';

test('verify featured image fetching and instant live publishing', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in as Super Admin
  console.log('1. Logging in as Super Admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 2. Go to Create Article page
  console.log('2. Navigating to Create Article page...');
  await page.goto('https://genz-live.com/admin/articles/new', { waitUntil: 'networkidle' });

  // 3. Fill Title & Content
  console.log('3. Filling headline and content...');
  const testTitle = `Live AI Tech Breakthrough ${Date.now()}`;
  await page.fill('input[name="title"]', testTitle);
  await page.fill('textarea[name="content"]', '<p>Student developers and AI researchers today unveiled a revolutionary open source model operating at 10x efficiency.</p>');

  // 4. Click Auto-Suggest Image & Verify Image URL and Live Preview
  console.log('4. Clicking Auto-Suggest Image...');
  await page.click('button:has-text("Auto-Suggest Image")');
  await page.waitForTimeout(1000);

  const imgVal = await page.inputValue('input[name="featuredImage"]');
  console.log('Featured Image URL:', imgVal);
  expect(imgVal).toContain('https://images.unsplash.com');

  // Verify Live Image Preview thumbnail is visible
  const previewImg = page.locator('img[alt*="Featured image preview"], img[alt*="Live Image Preview"]');
  await expect(previewImg.first()).toBeVisible();

  // 5. Set Status to PUBLISHED
  console.log('5. Setting Workflow Status to PUBLISHED...');
  await page.selectOption('select[name="status"]', 'PUBLISHED');

  // 6. Save Article
  console.log('6. Saving Article...');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 7. Verify Redirected to All Articles page
  console.log('7. Verifying redirect back to /admin/articles...');
  expect(page.url()).toContain('/admin/articles');

  // 8. Go to Homepage & verify newly published article appears live in Latest Feed
  console.log('8. Checking live homepage feed...');
  await page.goto('https://genz-live.com/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const pageText = await page.innerText('body');
  console.log('Homepage contains new title:', pageText.includes(testTitle));
  expect(pageText).toContain(testTitle);

  // 9. Take snapshot proof
  console.log('9. Snapshotting live published article proof...');
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/publishing_and_image_live_proof.png' });
});
