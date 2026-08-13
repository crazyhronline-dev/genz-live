// ================================================================
// GenZ Live — Internal Link Recommendation Engine
// Suggests contextual internal links between published articles.
// ================================================================

import { SITE_CONFIG } from '@/config/site';

export interface InternalLinkSuggestion {
  targetArticleId: string;
  targetTitle: string;
  targetUrl: string;
  recommendedAnchorText: string;
  relevanceScore: number; // 0 - 100
  reason: string;
}

export function generateInternalLinkSuggestions(
  currentArticle: { id: string; categoryId: string; content: string; keywords?: string | null },
  otherPublishedArticles: Array<{
    id: string;
    title: string;
    slug: string;
    categoryId: string;
    category: { slug: string };
    keywords?: string | null;
  }>
): InternalLinkSuggestion[] {
  const suggestions: InternalLinkSuggestion[] = [];

  otherPublishedArticles.forEach(target => {
    if (target.id === currentArticle.id) return;

    let score = 0;
    const reasons: string[] = [];

    // Category match
    if (target.categoryId === currentArticle.categoryId) {
      score += 40;
      reasons.push('Same category');
    }

    // Title keyword match in current content
    const cleanTitle = target.title.toLowerCase().replace(/[^\w\s]/g, '');
    const titleWords = cleanTitle.split(/\s+/).filter(w => w.length > 4);

    let keywordMatches = 0;
    const contentLower = currentArticle.content.toLowerCase();

    titleWords.forEach(w => {
      if (contentLower.includes(w)) keywordMatches++;
    });

    if (keywordMatches >= 2) {
      score += 40;
      reasons.push('Keyword overlap');
    }

    if (score >= 40) {
      suggestions.push({
        targetArticleId: target.id,
        targetTitle: target.title,
        targetUrl: `${SITE_CONFIG.domain}/${target.category.slug}/${target.slug}`,
        recommendedAnchorText: target.title,
        relevanceScore: Math.min(100, score),
        reason: reasons.join(', '),
      });
    }
  });

  return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 5);
}
