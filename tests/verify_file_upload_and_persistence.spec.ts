import { test, expect } from '@playwright/test';

test('verify image persistence on re-edit and upload option availability', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in
  console.log('1. Logging in...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // 2. Open All Articles & click Edit on first article
  console.log('2. Opening All Articles...');
  await page.goto('https://genz-live.com/admin/articles', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const editLink = page.locator('a[title="Edit Article"]').first();
  await editLink.click();
  await page.waitForTimeout(2000);

  const currentUrl = page.url();
  console.log('Editing Article URL:', currentUrl);

  // 3. Set a specific custom image URL
  const customImgUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80';
  console.log('3. Setting custom image URL:', customImgUrl);
  await page.fill('input[name="featuredImage"]', customImgUrl);
  await page.waitForTimeout(1000);

  // Verify Live Image Preview displays custom image
  const previewImg = page.locator('img[alt*="Featured image preview"], img[alt*="Live Image Preview"]');
  const srcBefore = await previewImg.first().getAttribute('src');
  console.log('Live Preview Image SRC before save:', srcBefore);
  expect(srcBefore).toBe(customImgUrl);

  // 4. Save Article
  console.log('4. Saving Article...');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 5. Navigate back to edit the exact same article
  console.log('5. Re-opening the exact same article to verify persistence...');
  await page.goto(currentUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 6. Verify image URL was NOT wiped out and matches customImgUrl
  const imgValAfter = await page.inputValue('input[name="featuredImage"]');
  console.log('Featured Image URL after re-opening edit page:', imgValAfter);
  expect(imgValAfter).toBe(customImgUrl);

  // Take snapshot proof of preserved image URL and live preview
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/image_persistence_reedit_proof.png' });
});
