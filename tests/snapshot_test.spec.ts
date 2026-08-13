import { test } from '@playwright/test';

test('capture live staff creation and login snapshots', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // 1. Homepage Snapshot
  console.log('1. Snapshotting Homepage...');
  await page.goto('https://genz-live.com/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/live_homepage_snapshot.png' });

  // 2. Admin Login Page Snapshot
  console.log('2. Snapshotting Admin Login Page...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/admin_login_snapshot.png' });

  // 3. Log in as Super Admin (wilson@genz-live.com)
  console.log('3. Logging in as Super Admin...');
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 4. Staff Dashboard (User Administration Page)
  console.log('4. Snapshotting Staff Dashboard...');
  await page.goto('https://genz-live.com/admin/users', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/staff_dashboard_snapshot.png' });

  // 5. Clear cookies to Log out
  console.log('5. Clearing session cookies (Logout)...');
  await page.context().clearCookies();
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });

  // 6. Log in as newly created Staff Member (EDITOR role)
  console.log('6. Logging in as Staff Member (EDITOR)...');
  await page.fill('input[name="email"]', 'test_staff_1786483142838@genz-live.com');
  await page.fill('input[name="password"]', 'testpassword123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 7. Snapshot Dashboard when logged in as Staff Member (EDITOR)
  console.log('7. Snapshotting Admin Dashboard logged in as Staff Member...');
  await page.goto('https://genz-live.com/admin', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/staff_logged_in_snapshot.png' });
});
