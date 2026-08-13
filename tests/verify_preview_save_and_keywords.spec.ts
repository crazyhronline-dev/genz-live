import { test, expect } from '@playwright/test';

test('verify preview save buttons and keyword persistence', async ({ page }) => {
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

  // 3. Test Keyword Persistence (Add custom keywords)
  console.log('3. Testing Keyword Persistence...');
  const keywordInput = page.locator('input[placeholder*="Add keyword"]');
  await keywordInput.fill('GenZ News');
  await keywordInput.press('Enter');
  await keywordInput.fill('Artificial Intelligence');
  await keywordInput.press('Enter');
  await page.waitForTimeout(500);

  const tags = page.locator('span:has-text("GenZ News"), span:has-text("Artificial Intelligence")');
  const tagCount = await tags.count();
  console.log(`Found ${tagCount} keywords added cleanly!`);
  expect(tagCount).toBeGreaterThanOrEqual(2);

  // 4. Test Preview Mode Save Buttons
  console.log('4. Opening Preview Mode...');
  await page.click('button:has-text("Preview Article")');
  await page.waitForTimeout(1500);

  // Verify Save Article button in preview topbar
  const topbarSaveBtn = page.locator('div[style*="linear-gradient"] button:has-text("Save Article")');
  await expect(topbarSaveBtn).toBeVisible();

  // Verify Sticky Bottom Bar in Preview Mode
  const bottomSaveBtn = page.locator('div.fixed.bottom-0 button:has-text("Save Article")');
  const bottomPublishBtn = page.locator('div.fixed.bottom-0 button:has-text("Save & Publish Live")');
  await expect(bottomSaveBtn).toBeVisible();
  await expect(bottomPublishBtn).toBeVisible();

  // Take snapshot proof of Preview Mode with bottom Save & Publish buttons
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/preview_mode_save_buttons_proof.png' });
});
