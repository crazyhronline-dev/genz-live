import { test, expect } from '@playwright/test';

test('capture website design snapshot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // Add a cache-busting timestamp or navigate cleanly to live site
  console.log('Navigating to https://genz-live.com/...');
  await page.goto('https://genz-live.com/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Check header height & font sizes
  const headerStats = await page.evaluate(() => {
    const header = document.querySelector('header');
    const h1 = document.querySelector('h1');
    return {
      headerHeight: header ? window.getComputedStyle(header).height : 'none',
      h1Position: h1 ? window.getComputedStyle(h1).position : 'none',
      h1Width: h1 ? window.getComputedStyle(h1).width : 'none',
    };
  });
  console.log('Header Stats:', JSON.stringify(headerStats));

  await page.screenshot({
    path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/website_design_resolved_proof.png',
    fullPage: false,
  });
});
