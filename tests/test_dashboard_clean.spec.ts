import { test, expect } from '@playwright/test';

test('verify CMS Dashboard contains only real articles after demo cleanup', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in
  console.log('1. Logging in to Admin CMS...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 2. Check Dashboard Metrics
  console.log('2. Checking Dashboard Metrics on /admin...');
  await page.goto('https://genz-live.com/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const totalArticlesText = await page.locator('a[href="/admin/articles"] p').innerText();
  console.log('Total Articles Count on Dashboard metric card:', totalArticlesText);
  expect(parseInt(totalArticlesText)).toBe(2);

  // 3. Check All Articles Management table on /admin/articles
  console.log('3. Navigating to /admin/articles...');
  await page.goto('https://genz-live.com/admin/articles', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const rowsCount = await page.locator('tbody tr').count();
  console.log('Total real article rows in CMS table:', rowsCount);
  expect(rowsCount).toBe(2);

  // Take screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/admin_dashboard_cleaned_proof.png', fullPage: true });
});
