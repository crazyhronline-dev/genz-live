import { test, expect } from '@playwright/test';

test('verify 1-click publish live option and instant image URL fetching preview', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in
  console.log('1. Logging in as Super Admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // 2. Go to All Articles Management page
  console.log('2. Checking All Articles page for 1-click Publish Live options...');
  await page.goto('https://genz-live.com/admin/articles', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check if Publish Live buttons are rendered in table
  const publishBtns = page.locator('button:has-text("Publish Live")');
  const count = await publishBtns.count();
  console.log(`Found ${count} "Publish Live" 1-click action buttons in table!`);

  // Take snapshot of All Articles table showing 1-click Publish Live options
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/all_articles_publish_live_options.png' });

  // 3. Test Live Image Fetch & Preview in Article Editor
  console.log('3. Navigating to Article Editor to test live image URL pasting & fetching preview...');
  await page.goto('https://genz-live.com/admin/articles/new', { waitUntil: 'networkidle' });

  const testImgUrl = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80';
  await page.fill('input[name="featuredImage"]', testImgUrl);
  await page.waitForTimeout(1000);

  // Verify Live Image Preview thumbnail is displayed
  const previewImg = page.locator('img[alt*="Featured image preview"], img[alt*="Live Image Preview"]');
  const src = await previewImg.first().getAttribute('src');
  console.log('Fetched & Previewed Live Image SRC:', src);
  expect(src).toBe(testImgUrl);

  // Take snapshot of Editor Live Image Preview
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/editor_image_url_live_fetch_preview.png' });
});
