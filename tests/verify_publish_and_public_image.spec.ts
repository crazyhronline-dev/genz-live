import { test, expect } from '@playwright/test';

test('verify published article image renders on public article page and persists in edit mode', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 950 });

  // 1. Log in as Admin
  console.log('1. Logging in as Admin...');
  await page.goto('https://genz-live.com/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'wilson@genz-live.com');
  await page.fill('input[name="password"]', 'Golden@123#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // 2. Create and Publish Article with Custom Image
  const uniqueTitle = `Live Public Image Test ${Date.now()}`;
  const customImgUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80';
  console.log('2. Creating published article:', uniqueTitle);
  await page.goto('https://genz-live.com/admin/articles/new', { waitUntil: 'networkidle' });
  await page.fill('input[name="title"]', uniqueTitle);
  await page.fill('textarea[name="excerpt"]', 'Testing live published article image rendering and edit persistence.');
  await page.selectOption('select[name="status"]', 'PUBLISHED');
  await page.fill('input[name="featuredImage"]', customImgUrl);
  await page.waitForTimeout(1000);

  // Save & Publish
  console.log('3. Submitting article...');
  await page.click('button[type="submit"]:has-text("Save & Update Article")');
  await page.waitForTimeout(3000);

  // 4. Re-edit article to verify image did NOT disappear
  console.log('4. Searching table for article to verify edit mode persistence...');
  const articleRow = page.locator(`tr:has-text("${uniqueTitle}")`).first();
  await expect(articleRow).toBeVisible();

  const editBtn = articleRow.locator('a:has-text("Edit")');
  await editBtn.click();
  await page.waitForTimeout(2000);

  // Verify image input value in Edit Mode
  const editImgInputVal = await page.locator('input[name="featuredImage"]').inputValue();
  console.log('Edit Mode Image Input Value:', editImgInputVal);
  expect(editImgInputVal).toBe(customImgUrl);

  const editPreviewImg = page.locator('img[alt*="Featured image preview"]');
  await expect(editPreviewImg).toBeVisible();

  // 5. Navigate to the Public Article Page
  const slug = uniqueTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const publicUrl = `https://genz-live.com/trending/${slug}`;
  console.log('5. Visiting public article page:', publicUrl);
  await page.goto(publicUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Verify public article page figure image element is present and visible
  const publicArticleImg = page.locator('figure img');
  await expect(publicArticleImg).toBeVisible();
  const publicImgSrc = await publicArticleImg.getAttribute('src');
  console.log('Public Article Page Image Src:', publicImgSrc);
  expect(publicImgSrc).toBe(customImgUrl);

  // Take snapshot proof of working live published article image
  await page.screenshot({ path: 'C:/Users/wilso/.gemini/antigravity/brain/6f3ff109-4d9d-46cd-8189-821bb016b94b/published_article_image_public_proof.png' });
});
