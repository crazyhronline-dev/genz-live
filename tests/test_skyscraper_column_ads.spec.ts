import { test, expect } from '@playwright/test';

test('verify configuring and publishing Left and Right Skyscraper Column Ads live', async ({ page }) => {
  await page.setViewportSize({ width: 1550, height: 950 });

  // 1. Log in to admin
  console.log('1. Logging in to admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 2. Navigate to Admin Ad Manager (/admin/settings/ads)
  console.log('2. Navigating to /admin/settings/ads...');
  await page.goto('https://genz-live.com/admin/settings/ads', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 3. Enable Left & Right Skyscraper Slots
  console.log('3. Enabling Left and Right Skyscraper Ad Slots...');
  const checkboxes = page.locator('input[type="checkbox"]');
  
  // Left Skyscraper (checkbox index 1)
  const leftCheckbox = checkboxes.nth(1);
  if (!(await leftCheckbox.isChecked())) {
    await leftCheckbox.check({ force: true });
  }

  // Right Skyscraper (checkbox index 2)
  const rightCheckbox = checkboxes.nth(2);
  if (!(await rightCheckbox.isChecked())) {
    await rightCheckbox.check({ force: true });
  }

  const leftImage = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
  const rightImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80';

  await page.locator('input[name="leftSkyscraperLink"]').fill('https://genz-live.com');
  await page.locator('input[name="leftSkyscraperTitle"]').fill('TechNeon Setup');
  await page.locator('input[placeholder*="Paste image URL"]').nth(1).fill(leftImage);

  await page.locator('input[name="rightSkyscraperLink"]').fill('https://genz-live.com');
  await page.locator('input[name="rightSkyscraperTitle"]').fill('Aurora Collection');
  await page.locator('input[placeholder*="Paste image URL"]').nth(2).fill(rightImage);

  // 4. Save Ad Settings
  console.log('4. Saving Ad Settings...');
  await page.click('button[type="submit"]:has-text("Save Ad Configuration")');
  await page.waitForTimeout(4000);

  expect(page.url()).toContain('/admin/settings/ads?saved=true');

  // 5. Check Public Homepage for Left & Right Column Ads
  console.log('5. Checking public homepage on 1550px viewport for Left & Right Column Ads...');
  await page.goto('https://genz-live.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const leftBadge = page.locator('div:has-text("TechNeon Setup")');
  const rightBadge = page.locator('div:has-text("Aurora Collection")');

  await expect(leftBadge.first()).toBeVisible();
  await expect(rightBadge.first()).toBeVisible();

  console.log('✅ Left & Right Skyscraper Column Ads verified live on https://genz-live.com!');

  // Take screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/skyscraper_ads_live_proof.png', fullPage: true });
});
