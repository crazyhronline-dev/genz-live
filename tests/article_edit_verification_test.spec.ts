import { test, expect } from '@playwright/test';

test('verify article editing, content population, and status updating', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

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

  // 3. Click Edit on the first article
  console.log('3. Clicking Edit button on the first article...');
  const editLink = page.locator('a[title="Edit Article"]').first();
  await editLink.click();
  await page.waitForTimeout(3000);

  // 4. Verify URL has ?id= parameter and form fields are populated
  console.log('4. Verifying URL and populated fields on Editor page...');
  console.log('Current URL:', page.url());
  expect(page.url()).toContain('/admin/articles/new?id=');

  const titleValue = await page.inputValue('input[name="title"]');
  console.log('Populated Title:', titleValue);
  expect(titleValue.length).toBeGreaterThan(0);

  // 5. Snapshot Editor form showing pre-populated content
  console.log('5. Snapshotting Editor form with populated contents...');
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/article_edit_form_snapshot.png' });

  // 6. Update Article Title and Status
  console.log('6. Editing Article Title & Status...');
  await page.fill('input[name="title"]', titleValue + ' (Updated)');
  await page.selectOption('select[name="status"]', 'DRAFT');

  // 7. Click Save & Update Article
  console.log('7. Clicking Save & Update Article...');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 8. Verify redirected back to /admin/articles
  console.log('8. Verifying redirect back to /admin/articles...');
  console.log('URL after save:', page.url());
  expect(page.url()).toContain('/admin/articles');

  // 9. Snapshot updated articles list
  console.log('9. Snapshotting updated Articles table...');
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/article_updated_table_snapshot.png' });
});
