// ================================================================
// GenZ Live — Article Analytics Engine
// Computes article views, velocity, decay scores, and performance status.
// ================================================================

export interface ArticlePerformanceSummary {
  articleId: string;
  title: string;
  slug: string;
  views: number;
  publishedAt: Date | null;
  performanceStatus: 'PERFORMING_WELL' | 'NORMAL' | 'UNDERPERFORMING' | 'NEEDS_ATTENTION';
  velocityScore: number;
  decayScore: number;
  categoryName: string;
  authorName: string;
}

/**
 * Calculates performance status label based on views and publication age.
 */
export function calculatePerformanceStatus(
  views: number,
  publishedAt: Date | null,
  avgViews = 50
): 'PERFORMING_WELL' | 'NORMAL' | 'UNDERPERFORMING' | 'NEEDS_ATTENTION' {
  if (!publishedAt) return 'NORMAL';

  const daysOld = Math.max(1, Math.floor((Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24)));
  const viewsPerDay = views / daysOld;

  if (views >= avgViews * 3 || viewsPerDay >= 20) {
    return 'PERFORMING_WELL';
  } else if (viewsPerDay >= 5) {
    return 'NORMAL';
  } else if (daysOld > 7 && views < 10) {
    return 'NEEDS_ATTENTION';
  } else {
    return 'UNDERPERFORMING';
  }
}

/**
 * Calculates traffic velocity score (acceleration over recent period).
 */
export function calculateVelocityScore(recentViews: number, totalViews: number): number {
  if (totalViews <= 0) return 0;
  return Number(((recentViews / Math.max(1, totalViews)) * 100).toFixed(1));
}

/**
 * Calculates content decay score (0 - 100).
 */
export function calculateDecayScore(publishedAt: Date | null, recentViews: number): number {
  if (!publishedAt) return 0;

  const daysOld = Math.floor((Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysOld < 14) return 0; // Fresh articles cannot be decayed

  if (recentViews === 0 && daysOld > 30) {
    return 85;
  } else if (recentViews < 5 && daysOld > 60) {
    return 95;
  }

  return Math.min(100, Math.round((daysOld / 365) * 50));
}
