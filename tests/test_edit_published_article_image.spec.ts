import { test, expect } from '@playwright/test';

test('test editing published article image on live site', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Login
  console.log('1. Logging in to admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 2. Go directly to Edit Article page
  console.log('2. Navigating directly to Edit page for article cmspjboh0000152fnc0tb5yjp...');
  await page.goto('https://genz-live.com/admin/articles/new?id=cmspjboh0000152fnc0tb5yjp', { waitUntil: 'networkidle' });

  // Wait for title input to be populated
  await page.waitForFunction(() => {
    const input = document.querySelector('input[name="title"]') as HTMLInputElement;
    return input && input.value.length > 0;
  }, { timeout: 10000 }).catch(() => {});

  console.log('Edit URL:', page.url());

  // Check current featuredImage value
  const currentImg = await page.inputValue('input[name="featuredImage"]');
  console.log('Current Featured Image in editor:', currentImg);

  // Try changing featuredImage to an Unsplash URL
  const newImgUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80';
  console.log('4. Changing featured image to:', newImgUrl);
  await page.fill('input[name="featuredImage"]', newImgUrl);

  // Click Save button inside article form
  console.log('5. Clicking Save Article button inside main form...');
  await page.getByRole('button', { name: /Save &/i }).first().click();
  await page.waitForTimeout(4000);

  console.log('URL after save:', page.url());
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/after_save_edit.png' });

  // 6. Check public article page
  console.log('6. Checking public article page...');
  await page.goto('https://genz-live.com/trending/test-uploaded-img-1786505627555', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/public_article_after_edit.png' });

  const pageImgSrc = await page.locator('figure img').getAttribute('src');
  console.log('Public page image src:', pageImgSrc);
});
