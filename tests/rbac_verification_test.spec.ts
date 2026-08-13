import { test, expect } from '@playwright/test';

test('verify RBAC permission scoping for Editor vs Admin roles', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // 1. Log in as EDITOR (Test Staff)
  console.log('1. Logging in as EDITOR (Test Staff)...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'test_staff_1786483142838@genz-live.com');
  await page.fill('input[name="password"]', 'testpassword123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 2. Snapshot Editor Dashboard & Sidebar
  console.log('2. Snapshotting Editor Dashboard & Sidebar...');
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/editor_rbac_sidebar_snapshot.png' });

  // 3. Attempt direct URL navigation to /admin/users as Editor
  console.log('3. Attempting direct navigation to /admin/users as Editor...');
  await page.goto('https://genz-live.com/admin/users', { waitUntil: 'networkidle' });
  console.log('URL after /admin/users attempt:', page.url());
  expect(page.url()).toBe('https://genz-live.com/admin');

  // 4. Attempt direct URL navigation to /admin/settings as Editor
  console.log('4. Attempting direct navigation to /admin/settings as Editor...');
  await page.goto('https://genz-live.com/admin/settings', { waitUntil: 'networkidle' });
  console.log('URL after /admin/settings attempt:', page.url());
  expect(page.url()).toBe('https://genz-live.com/admin');

  // 5. Clear cookies to log out
  console.log('5. Logging out Editor...');
  await page.context().clearCookies();

  // 6. Log in as Super Admin (wilson@genz-live.com)
  console.log('6. Logging in as Super Admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 7. Snapshot Admin Dashboard & Sidebar (showing all modules)
  console.log('7. Snapshotting Admin Dashboard & Sidebar...');
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/admin_rbac_sidebar_snapshot.png' });
});
