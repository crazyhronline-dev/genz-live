const { test, expect } = require('@playwright/test');

test('Admin can set Admin Login Page Logo to 120px and save successfully', async ({ page }) => {
  console.log('1. Navigating to login...');
  await page.goto('https://genz-live.com/admin/login');
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);

  console.log('2. Navigating to Logo Settings...');
  await page.goto('https://genz-live.com/admin/settings/logo');
  await page.waitForSelector('input[name="adminLogoHeight"]');

  console.log('3. Changing Admin Login Logo Height to 120px...');
  await page.fill('input[name="adminLogoHeight"]', '120');

  console.log('4. Clicking Save Branding Changes...');
  await page.click('button[type="submit"]');

  console.log('5. Waiting 3 seconds for server action save...');
  await page.waitForTimeout(3500);

  const savedAdminLogoHeight = await page.inputValue('input[name="adminLogoHeight"]');
  console.log('SAVED_ADMIN_LOGO_HEIGHT_IN_INPUT:', savedAdminLogoHeight);

  expect(savedAdminLogoHeight).toBe('120');
});
