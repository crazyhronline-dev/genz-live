import { test, expect } from '@playwright/test';

test('verify top utility bar removes handle and renders LIVE in green with red blinking dot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Visit homepage
  console.log('1. Navigating to homepage...');
  await page.goto('https://genz-live.com/', { waitUntil: 'domcontentloaded' });

  // 2. Verify handle link is removed from top bar
  console.log('2. Verifying handle link is removed from top bar...');
  const topBarHandle = page.locator('header div.border-b a:has-text("@genz-live-official")');
  await expect(topBarHandle).toHaveCount(0);

  // 3. Verify green LIVE text badge
  console.log('3. Verifying green LIVE text badge...');
  const liveBadge = page.locator('span:has-text("LIVE")').first();
  await expect(liveBadge).toBeVisible();
  await expect(liveBadge).toHaveClass(/text-emerald-400/);

  // 4. Verify red blinking dot
  console.log('4. Verifying red blinking dot inside LIVE badge...');
  const redDot = liveBadge.locator('.bg-red-500').first();
  await expect(redDot).toBeVisible();

  console.log('✅ Top utility bar verified live on https://genz-live.com!');

  // Capture screenshot proof
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/top_bar_green_live_proof.png', fullPage: false });
});
