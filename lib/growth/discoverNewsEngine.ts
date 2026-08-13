// ================================================================
// GenZ Live — Google Discover & Google News Intelligence Engine
// Audits articles and publisher metadata for Discover/News eligibility.
// ================================================================

// ================================================================

export interface DiscoverNewsEligibilityReport {
  articleId: string;
  title: string;
  discoverScore: number; // 0 - 100
  newsScore: number; // 0 - 100
  isDiscoverEligible: boolean;
  isNewsEligible: boolean;
  warnings: string[];
  recommendations: string[];
}

export function auditDiscoverNewsEligibility(article: {
  id: string;
  title: string;
  content: string;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  publishedAt?: Date | null;
  status: string;
  author?: { name: string } | null;
  category?: { slug: string; name: string } | null;
}): DiscoverNewsEligibilityReport {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let discoverScore = 100;
  let newsScore = 100;

  // 1. Featured Image Audit (Discover requires large high-res image >= 1200px width, 16:9 ratio)
  if (!article.featuredImage) {
    discoverScore -= 40;
    newsScore -= 25;
    warnings.push('Missing Featured Image — Critical requirement for Google Discover cards.');
    recommendations.push('Add a high-resolution featured image (at least 1200px wide).');
  } else if (!article.featuredImageAlt) {
    discoverScore -= 10;
    warnings.push('Featured Image lacks descriptive Alt text.');
  }

  // 2. Publication Freshness Audit (Google News prioritizes content under 48h)
  const isPublished = article.status === 'PUBLISHED';
  const hoursOld = article.publishedAt ? (Date.now() - article.publishedAt.getTime()) / (1000 * 60 * 60) : 999;

  if (!isPublished) {
    discoverScore = 0;
    newsScore = 0;
    warnings.push('Article is not published.');
  } else if (hoursOld > 48) {
    newsScore -= 30;
    warnings.push(`Article is ${Math.round(hoursOld)} hours old — Beyond 48h Google News freshness window.`);
  }

  // 3. Author Transparency Audit (Google News E-E-A-T policy)
  if (!article.author || !article.author.name) {
    newsScore -= 30;
    discoverScore -= 20;
    warnings.push('Missing explicit Author attribution (Violates Google News E-E-A-T guideline).');
    recommendations.push('Assign a verified staff author profile to this story.');
  }

  // 4. Content Depth Audit
  const wordCount = article.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (wordCount < 150) {
    discoverScore -= 25;
    newsScore -= 20;
    warnings.push(`Short article body (${wordCount} words).`);
    recommendations.push('Expand content to at least 250–300 words for Discover distribution.');
  }

  const isDiscoverEligible = isPublished && discoverScore >= 70 && Boolean(article.featuredImage);
  const isNewsEligible = isPublished && newsScore >= 70 && hoursOld <= 48;

  return {
    articleId: article.id,
    title: article.title,
    discoverScore: Math.max(0, discoverScore),
    newsScore: Math.max(0, newsScore),
    isDiscoverEligible,
    isNewsEligible,
    warnings,
    recommendations,
  };
}
