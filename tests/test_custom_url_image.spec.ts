import { test, expect } from '@playwright/test';

test('test updating article image with custom CDN web URL on live site', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Login
  console.log('1. Logging in to admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 2. Go directly to Edit Article page
  console.log('2. Navigating to Edit page...');
  await page.goto('https://genz-live.com/admin/articles/new?id=cmspjboh0000152fnc0tb5yjp', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 3. Paste a custom web image URL (e.g. dynamic CDN link)
  const customWebUrl = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80';
  console.log('3. Pasting custom image URL:', customWebUrl);
  await page.fill('input[name="featuredImage"]', customWebUrl);

  // 4. Click Save
  console.log('4. Saving article with custom web image URL...');
  await page.getByRole('button', { name: /Save &/i }).first().click();
  await page.waitForTimeout(4000);

  expect(page.url()).toContain('/admin/articles');

  // 5. Check public article page
  console.log('5. Checking public article page...');
  await page.goto('https://genz-live.com/trending/test-uploaded-img-1786505627555', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const publicImgSrc = await page.locator('figure img').getAttribute('src');
  console.log('Public page image src:', publicImgSrc);
  expect(publicImgSrc).toBe(customWebUrl);

  // Take screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/public_article_custom_url_proof.png' });
});
