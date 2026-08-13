import { test, expect } from '@playwright/test';

test('verify image url is never auto-replaced', async ({ page }) => {
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

  // 3. Paste specific custom image URL
  const customImgUrl = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80';
  console.log('3. Pasting custom image URL:', customImgUrl);
  await page.fill('input[name="featuredImage"]', customImgUrl);
  await page.waitForTimeout(3000);

  // 4. Verify preview image SRC is NOT auto-replaced
  const previewImg = page.locator('img[alt*="Featured image preview"]');
  const actualSrc = await previewImg.getAttribute('src');
  console.log('Actual Live Image SRC:', actualSrc);

  expect(actualSrc).toBe(customImgUrl);

  // Take snapshot proof showing original image URL preserved cleanly
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/no_auto_replacement_proof.png' });
});
