import { test, expect } from '@playwright/test';

test('verify Mobile Category Nav clicking and Breaking News Marquee animation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  // 1. Visit homepage
  console.log('1. Navigating to homepage in Mobile View (390px)...');
  await page.goto('https://genz-live.com/', { waitUntil: 'domcontentloaded' });

  // 2. Verify Breaking News Marquee animation wrapper exists
  console.log('2. Verifying Breaking News Marquee animation...');
  await expect(page.locator('.ticker-move')).toBeVisible();

  // 3. Open Mobile Menu Drawer
  console.log('3. Opening Mobile Navigation Menu Drawer...');
  await page.click('#header-mobile-menu-toggle');
  await page.waitForTimeout(500);

  // 4. Click Technology category inside Mobile Drawer
  console.log('4. Clicking Technology Category link inside Mobile Drawer nav...');
  await page.click('nav[aria-label="Mobile navigation"] a[href="/technology"]');
  await page.waitForURL('**/technology', { timeout: 10000 });

  // Verify navigation to /technology succeeded
  console.log('5. Verifying URL is https://genz-live.com/technology...');
  expect(page.url()).toContain('/technology');

  console.log('✅ Mobile Navigation clicking and Breaking News Marquee verified live on https://genz-live.com!');

  // Capture screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/mobile_nav_technology_proof.png', fullPage: false });
});
