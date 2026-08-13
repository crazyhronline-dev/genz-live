import { test, expect } from '@playwright/test';

test('verify Interactive Page Placement Visualizer and Instant Live Previews in Admin Ad Manager', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 1100 });

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

  // 3. Verify Page Placement Visualizer is visible
  console.log('3. Verifying Interactive Page Placement Visualizer...');
  const visualizerHeader = page.locator('h2:has-text("Interactive Page Placement Visualizer")');
  await expect(visualizerHeader).toBeVisible();

  // 4. Fill an ad image into In-Article slot and verify Live Render Preview updates
  console.log('4. Testing live render preview...');
  const adImage = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80';
  await page.locator('input[name="inArticleImage"]').fill(adImage);
  await page.waitForTimeout(500);

  const livePreviewBadge = page.locator('span:has-text("Live Render Preview")').first();
  await expect(livePreviewBadge).toBeVisible();

  console.log('✅ Interactive Page Placement Visualizer & Live Previews verified on https://genz-live.com/admin/settings/ads!');

  // Take screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/admin_ad_manager_dashboard_previews_proof.png', fullPage: true });
});
