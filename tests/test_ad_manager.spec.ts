import { test, expect } from '@playwright/test';

test('verify configuring and publishing a Sponsored Ad Banner via Admin Ad Manager', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

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

  // 3. Configure Leaderboard Ad Slot
  console.log('3. Enabling and configuring Top Leaderboard Ad Slot...');
  const checkbox = page.locator('input[type="checkbox"]').first();
  if (!(await checkbox.isChecked())) {
    await checkbox.check({ force: true });
  }

  const adImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
  const adLink = 'https://genz-live.com';
  const adTitle = 'Exclusive Brand Partner';

  await page.locator('input[placeholder*="Paste image URL"]').first().fill(adImage);
  await page.locator('input[name="leaderboardLink"]').fill(adLink);
  await page.locator('input[name="leaderboardTitle"]').fill(adTitle);

  // 4. Save Ad Settings
  console.log('4. Saving Ad Settings...');
  await page.click('button[type="submit"]:has-text("Save Ad Configuration")');
  await page.waitForTimeout(4000);

  expect(page.url()).toContain('/admin/settings/ads?saved=true');

  // 5. Check Public Homepage for Live Sponsored Banner
  console.log('5. Checking public homepage for Sponsored Banner...');
  await page.goto('https://genz-live.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const sponsorBadge = page.locator('span:has-text("Exclusive Brand Partner")');
  await expect(sponsorBadge.first()).toBeVisible();

  console.log('✅ Sponsored Banner verified live on https://genz-live.com!');

  // Take screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/sponsored_ad_banner_live_proof.png', fullPage: true });
});
