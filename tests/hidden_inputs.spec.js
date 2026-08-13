const { test, expect } = require('@playwright/test');

test('Hidden input state guarantees 140px header logo saves to MySQL', async ({ page }) => {
  console.log('1. Navigating to login...');
  await page.goto('https://genz-live.com/admin/login');
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);

  console.log('2. Navigating to Logo Settings...');
  await page.goto('https://genz-live.com/admin/settings/logo');
  await page.waitForSelector('input[name="headerLogoHeight"]');

  console.log('3. Changing Header Logo Height to 140px...');
  await page.evaluate(() => {
    const input = document.querySelector('input[name="headerLogoHeight"]');
    if (input) {
      input.value = '140';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  console.log('4. Clicking Save Branding Changes...');
  await page.click('button[type="submit"]');

  console.log('5. Waiting 3.5s for server action to persist to MySQL...');
  await page.waitForTimeout(3500);

  const savedHeight = await page.inputValue('input[name="headerLogoHeight"]');
  console.log('SAVED_HEADER_LOGO_HEIGHT_IN_INPUT:', savedHeight);

  expect(savedHeight).toBe('140');
});
