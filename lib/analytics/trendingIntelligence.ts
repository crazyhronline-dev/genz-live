// ================================================================
// GenZ Live — Trending & Breaking News Intelligence Engine
// Analyzes traffic velocity to generate editorial recommendations.
// ================================================================

export interface TrendingRecommendation {
  articleId: string;
  title: string;
  slug: string;
  categoryName: string;
  views: number;
  velocityScore: number;
  recommendationType: 'RECOMMEND_TRENDING' | 'RECOMMEND_BREAKING' | 'MONITOR';
  reason: string;
}

export function generateTrendingRecommendations(articles: Array<{
  id: string;
  title: string;
  slug: string;
  views: number;
  isTrending: boolean;
  isBreaking: boolean;
  publishedAt: Date | null;
  category: { name: string };
}>): TrendingRecommendation[] {
  const recommendations: TrendingRecommendation[] = [];

  articles.forEach(article => {
    if (!article.publishedAt) return;

    const hoursOld = Math.max(1, (Date.now() - article.publishedAt.getTime()) / (1000 * 60 * 60));
    const viewsPerHour = article.views / hoursOld;
    const velocityScore = Number(viewsPerHour.toFixed(1));

    if (!article.isTrending && (velocityScore >= 5 || article.views >= 50)) {
      recommendations.push({
        articleId: article.id,
        title: article.title,
        slug: article.slug,
        categoryName: article.category.name,
        views: article.views,
        velocityScore,
        recommendationType: 'RECOMMEND_TRENDING',
        reason: `High traffic velocity (${viewsPerHour.toFixed(1)} views/hr) over the past ${Math.round(hoursOld)} hours.`,
      });
    } else if (!article.isBreaking && hoursOld <= 6 && article.views >= 30) {
      recommendations.push({
        articleId: article.id,
        title: article.title,
        slug: article.slug,
        categoryName: article.category.name,
        views: article.views,
        velocityScore,
        recommendationType: 'RECOMMEND_BREAKING',
        reason: `Rapid early audience engagement within ${Math.round(hoursOld)} hours of publication.`,
      });
    }
  });

  return recommendations.sort((a, b) => b.velocityScore - a.velocityScore).slice(0, 10);
}
