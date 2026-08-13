// ================================================================
// GenZ Live — Content Opportunity & Traffic Intelligence Engine
// Identifies high-search/low-CTR topics and follow-up coverage candidates.
// ================================================================

export interface ContentOpportunity {
  id: string;
  type: 'HIGH_SEARCH_NO_ARTICLE' | 'HIGH_IMPRESSIONS_LOW_CTR' | 'POPULAR_FOLLOWUP' | 'CONTENT_REFRESH';
  title: string;
  description: string;
  sourceSignal: 'INTERNAL_DATA' | 'GSC_DATA' | 'EDITORIAL_INFERENCE';
  recommendedAction: string;
}

export function detectContentOpportunities(
  articles: Array<{ id: string; title: string; views: number; publishedAt: Date | null; category: { name: string } }>,
  gscData?: { topQueries: Array<{ query: string; clicks: number; impressions: number; ctr: number }> } | null
): ContentOpportunity[] {
  const opportunities: ContentOpportunity[] = [];

  // 1. Analyze Internal Articles for Follow-up Opportunities
  articles.forEach(art => {
    if (art.views >= 50) {
      opportunities.push({
        id: `opp_followup_${art.id}`,
        type: 'POPULAR_FOLLOWUP',
        title: `Follow-up Story Opportunity: "${art.title}"`,
        description: `Story has accumulated ${art.views} audience views in ${art.category.name}.`,
        sourceSignal: 'INTERNAL_DATA',
        recommendedAction: 'Write a follow-up analysis or interview extending this high-interest story.',
      });
    }
  });

  // 2. Analyze GSC Queries if available
  if (gscData && gscData.topQueries.length > 0) {
    gscData.topQueries.forEach((q, idx) => {
      if (q.impressions > 500 && q.ctr < 3.0) {
        opportunities.push({
          id: `opp_gsc_${idx}`,
          type: 'HIGH_IMPRESSIONS_LOW_CTR',
          title: `Low CTR Query: "${q.query}"`,
          description: `${q.impressions} impressions in Google Search with low CTR (${q.ctr}%).`,
          sourceSignal: 'GSC_DATA',
          recommendedAction: 'Improve article meta title and description to match reader search intent.',
        });
      }
    });
  }

  return opportunities.slice(0, 8);
}
