const { test, expect } = require('@playwright/test');

test('Admin can set logo size to 120px and save permanently', async ({ page }) => {
  console.log('1. Navigating to login...');
  await page.goto('https://genz-live.com/admin/login');
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);

  console.log('2. Navigating to Logo Settings...');
  await page.goto('https://genz-live.com/admin/settings/logo');
  await page.waitForSelector('input[name="headerLogoHeight"]');

  console.log('3. Changing Logo Height slider to 120px...');
  await page.fill('input[name="headerLogoHeight"]', '120');

  console.log('4. Clicking Save Branding Changes...');
  await page.click('button[type="submit"]');

  console.log('5. Waiting 3 seconds for server action to persist to MySQL...');
  await page.waitForTimeout(3500);

  const currentHeightValue = await page.inputValue('input[name="headerLogoHeight"]');
  console.log('SAVED_LOGO_HEIGHT_IN_INPUT:', currentHeightValue);

  expect(currentHeightValue).toBe('120');
});
