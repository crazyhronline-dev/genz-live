import { test, expect } from '@playwright/test';

test('test clearing/deleting published article image on live site', async ({ page }) => {
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

  // 3. Click Clear image button or clear input
  console.log('3. Clearing featured image...');
  const clearBtn = page.locator('button:has-text("Clear")');
  if (await clearBtn.isVisible()) {
    await clearBtn.click();
  } else {
    await page.fill('input[name="featuredImage"]', '');
  }

  const valAfterClear = await page.inputValue('input[name="featuredImage"]');
  console.log('Image value after clear:', `"${valAfterClear}"`);
  expect(valAfterClear).toBe('');

  // 4. Click Save
  console.log('4. Saving article without image...');
  await page.getByRole('button', { name: /Save &/i }).first().click();
  await page.waitForTimeout(4000);

  expect(page.url()).toContain('/admin/articles');

  // 5. Check public article page
  console.log('5. Checking public article page...');
  await page.goto('https://genz-live.com/trending/test-uploaded-img-1786505627555', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const figureImgCount = await page.locator('figure img').count();
  console.log('Figure img elements count on public page:', figureImgCount);

  // Take screenshot proof of public article after clearing image
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/public_article_after_clear_image.png' });
});
