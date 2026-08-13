import { test, expect } from '@playwright/test';

test('verify AI SERP ranking keywords auto-suggestion and management', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in as Super Admin
  console.log('1. Logging in as Super Admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // 2. Go to Create Article page
  console.log('2. Navigating to Create Article page...');
  await page.goto('https://genz-live.com/admin/articles/new', { waitUntil: 'networkidle' });

  // 3. Fill in Title, Excerpt, and Body Content
  console.log('3. Filling in article details...');
  await page.fill('input[name="title"]', 'GenZ protest in Ranchi against NEET paper leak 2026');
  await page.fill('textarea[name="excerpt"]', 'Thousands of students gathered in Ranchi to demand justice, exam cancellation, and paper leak investigation.');
  await page.fill('textarea[name="content"]', '<p>Student unions across Jharkhand led a massive rally in Ranchi today calling for government action on the examination system.</p>');

  // 4. Click Auto-Suggest Keywords with AI
  console.log('4. Clicking Auto-Suggest Keywords with AI button...');
  const aiButton = page.locator('button:has-text("Auto-Suggest Keywords with AI")');
  await aiButton.click();

  // 5. Wait for AI suggestions to load
  console.log('5. Waiting for AI suggestions to generate...');
  await page.waitForTimeout(3500);

  // 6. Scroll keywords section into center & snapshot close-up
  console.log('6. Snapshotting AI SERP Ranking Keywords UI...');
  const keywordsSection = page.locator('div:has-text("TARGET SERP RANKING KEYWORDS")').first();
  await keywordsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/ai_serp_keywords_chips_snapshot.png' });
});
