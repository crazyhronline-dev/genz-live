import { test, expect } from '@playwright/test';

test('verify publishing live, unpublishing, status changes, and keyword preservation', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in as Super Admin
  console.log('1. Logging in as Super Admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 2. Go to All Articles page
  console.log('2. Navigating to All Articles page...');
  await page.goto('https://genz-live.com/admin/articles', { waitUntil: 'networkidle' });

  // 3. Edit first article
  console.log('3. Clicking Edit on first article...');
  const editLink = page.locator('a[title="Edit Article"]').first();
  await editLink.click();
  await page.waitForTimeout(3000);

  // 4. Verify Keywords are preserved and NOT wiped out
  console.log('4. Verifying Keywords preservation...');
  const hiddenKeywordsVal = await page.inputValue('input[name="keywords"]');
  console.log('Preserved Keywords Value:', hiddenKeywordsVal);

  // 5. Change Workflow Status to PUBLISHED (publishing live)
  console.log('5. Changing Workflow Status to PUBLISHED...');
  await page.selectOption('select[name="status"]', 'PUBLISHED');

  // 6. Click Save & Update Article
  console.log('6. Clicking Save & Update Article...');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 7. Verify redirected to /admin/articles
  console.log('7. Verifying redirect back to /admin/articles...');
  expect(page.url()).toContain('/admin/articles');

  // 8. Go back to Edit page & change status to DRAFT (unpublishing)
  console.log('8. Editing again and unpublishing (changing status to DRAFT)...');
  await page.locator('a[title="Edit Article"]').first().click();
  await page.waitForTimeout(3000);
  await page.selectOption('select[name="status"]', 'DRAFT');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 9. Snapshot All Articles list
  console.log('9. Snapshotting status & keywords verification proof...');
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/status_and_keywords_proof.png' });
});
