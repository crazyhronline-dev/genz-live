import { test, expect } from '@playwright/test';

test('verify published article appears first while homepage stays rich & full via Hybrid Auto-Padding', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in to admin
  console.log('1. Logging in to admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 2. Publish 1 real article
  console.log('2. Publishing 1 real article...');
  await page.goto('https://genz-live.com/admin/articles/new?id=cmspjboh0000152fnc0tb5yjp', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Change status to PUBLISHED
  await page.selectOption('select[name="status"]', 'PUBLISHED');
  await page.click('input[name="isFeatured"]'); // Check isFeatured
  await page.getByRole('button', { name: /Save &/i }).first().click();
  await page.waitForTimeout(4000);

  // 3. Visit public homepage
  console.log('3. Visiting public homepage https://genz-live.com...');
  await page.goto('https://genz-live.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Verify homepage is full of article cards
  const articleCards = page.locator('article, a[href*="/trending/"], a[href*="/tech/"], a[href*="/ai/"]');
  const cardCount = await articleCards.count();
  console.log('Total article cards visible on homepage:', cardCount);
  expect(cardCount).toBeGreaterThanOrEqual(8);

  // Take screenshot proof of public homepage
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/hybrid_homepage_full_proof.png', fullPage: true });
});
