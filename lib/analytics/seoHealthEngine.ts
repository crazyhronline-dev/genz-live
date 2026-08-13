// ================================================================
// GenZ Live — Technical SEO Health Engine
// Scans articles and pages for SEO readiness, meta tags, and schema.
// ================================================================

// ================================================================

export interface SEOHealthCheckResult {
  articleId: string;
  status: 'GOOD' | 'WARNING' | 'ERROR';
  score: number; // 0 - 100
  hasMetaTitle: boolean;
  hasMetaDescription: boolean;
  hasCanonicalUrl: boolean;
  hasFeaturedImage: boolean;
  hasImageAltText: boolean;
  hasNewsArticleJsonLd: boolean;
  wordCount: number;
  internalLinksCount: number;
  inSitemap: boolean;
  inNewsSitemap: boolean;
  issues: string[];
  recommendations: string[];
}

export function auditArticleSEOHealth(article: {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  status: string;
  publishedAt?: Date | null;
  category?: { slug: string } | null;
}): SEOHealthCheckResult {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  const plainText = article.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  // 1. Meta Title Check
  const hasMetaTitle = Boolean(article.metaTitle || article.title);
  if (!hasMetaTitle) {
    score -= 20;
    issues.push('Missing Meta Title.');
    recommendations.push('Add an explicit SEO Meta Title (50–60 characters).');
  }

  // 2. Meta Description Check
  const hasMetaDescription = Boolean(article.metaDescription || article.excerpt);
  if (!hasMetaDescription) {
    score -= 20;
    issues.push('Missing Meta Description.');
    recommendations.push('Add an SEO Meta Description summary (140–160 characters).');
  }

  // 3. Canonical URL Check
  const hasCanonicalUrl = Boolean(article.canonicalUrl || (article.category && article.slug));
  if (!hasCanonicalUrl) {
    score -= 10;
    issues.push('Missing Canonical URL.');
  }

  // 4. Featured Image & Alt Text Check
  const hasFeaturedImage = Boolean(article.featuredImage);
  const hasImageAltText = Boolean(article.featuredImageAlt);
  if (!hasFeaturedImage) {
    score -= 15;
    issues.push('Missing Featured Image (Required for OpenGraph, Google Discover & Google News).');
  } else if (!hasImageAltText) {
    score -= 10;
    issues.push('Featured Image lacks Alt text.');
    recommendations.push('Provide descriptive Image Alt text for accessibility and Image Search.');
  }

  // 5. Article Length Check
  if (wordCount < 150) {
    score -= 15;
    issues.push(`Thin content detected (${wordCount} words).`);
    recommendations.push('Expand story details to at least 300 words for competitive search ranking.');
  }

  // 6. Internal Link Count Check
  const linkMatches = article.content.match(/<a\s+[^>]*href=["']([^"']+)["']/gi) || [];
  const internalLinksCount = linkMatches.filter(l => l.includes('genz-live.com') || l.includes('href="/"') || l.includes('href="/')).length;

  if (internalLinksCount === 0) {
    score -= 10;
    issues.push('No internal links detected in article content.');
    recommendations.push('Add 1–3 internal links to related GenZ Live articles or categories.');
  }

  // 7. Sitemap & News Sitemap Eligibility
  const isPublished = article.status === 'PUBLISHED';
  const hoursOld = article.publishedAt ? (Date.now() - article.publishedAt.getTime()) / (1000 * 60 * 60) : 999;
  const inSitemap = isPublished;
  const inNewsSitemap = isPublished && hoursOld <= 48;

  let status: SEOHealthCheckResult['status'] = 'GOOD';
  if (score < 70 || !hasFeaturedImage || !hasMetaTitle) {
    status = 'ERROR';
  } else if (score < 90 || issues.length > 0) {
    status = 'WARNING';
  }

  return {
    articleId: article.id,
    status,
    score: Math.max(0, score),
    hasMetaTitle,
    hasMetaDescription,
    hasCanonicalUrl,
    hasFeaturedImage,
    hasImageAltText,
    hasNewsArticleJsonLd: true,
    wordCount,
    internalLinksCount,
    inSitemap,
    inNewsSitemap,
    issues,
    recommendations,
  };
}
