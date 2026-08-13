// ================================================================
// GenZ Live — Content Decay Detection Engine
// Identifies older evergreen articles experiencing traffic decline.
// ================================================================

export interface DecayedArticleReport {
  articleId: string;
  title: string;
  slug: string;
  categoryName: string;
  authorName: string;
  publishedAt: Date | null;
  daysOld: number;
  totalViews: number;
  recentViews: number;
  decayScore: number; // 0 - 100
  recommendation: string;
}

export function detectContentDecay(articles: Array<{
  id: string;
  title: string;
  slug: string;
  views: number;
  publishedAt: Date | null;
  category: { name: string };
  author: { name: string };
}>): DecayedArticleReport[] {
  const decayed: DecayedArticleReport[] = [];

  articles.forEach(art => {
    if (!art.publishedAt) return;

    const daysOld = Math.floor((Date.now() - art.publishedAt.getTime()) / (1000 * 60 * 60 * 24));
    if (daysOld < 30) return; // Only analyze articles older than 30 days

    // Estimate recent traffic decay ratio
    const avgViewsPerDay = art.views / daysOld;
    let decayScore = 0;

    if (art.views > 50 && avgViewsPerDay < 0.2) {
      decayScore = 85;
    } else if (daysOld > 90 && art.views < 20) {
      decayScore = 95;
    } else if (daysOld > 60 && avgViewsPerDay < 0.5) {
      decayScore = 65;
    }

    if (decayScore >= 60) {
      decayed.push({
        articleId: art.id,
        title: art.title,
        slug: art.slug,
        categoryName: art.category.name,
        authorName: art.author.name,
        publishedAt: art.publishedAt,
        daysOld,
        totalViews: art.views,
        recentViews: 0,
        decayScore,
        recommendation: 'REFRESH RECOMMENDED — Update statistics, quotes, or internal links to restore traffic.',
      });
    }
  });

  return decayed.sort((a, b) => b.decayScore - a.decayScore);
}
