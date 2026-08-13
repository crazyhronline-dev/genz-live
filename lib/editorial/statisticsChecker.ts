// ================================================================
// GenZ Live — Editorial Statistics & Numbers Checker Engine
// Extracts numbers, monetary values, percentages, and verifies sources.
// Critical Rule: AI must NEVER invent statistics.
// ================================================================

export interface ExtractedStatistic {
  id: string;
  statistic: string;
  context: string;
  status: 'SUPPORTED' | 'UNSUPPORTED' | 'SOURCE_REQUIRED';
  notes?: string;
}

/**
 * Extracts numeric claims, percentages, and financial figures from text.
 */
export function extractStatisticsFromText(content: string): ExtractedStatistic[] {
  if (!content) return [];
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const statRegex = /\b(\$\d+[\d,.]*\s*(?:billion|million|trillion|crore|lakh)?|\b\d+[\d,.]*\s*(?:percent|%|billion|million|crore|lakh|users|people|dollars|rupees|inr|usd))\b/gi;
  const results: ExtractedStatistic[] = [];

  let match;
  let idx = 1;
  while ((match = statRegex.exec(plainText)) !== null && idx <= 10) {
    const statistic = match[0].trim();
    const start = Math.max(0, match.index - 30);
    const end = Math.min(plainText.length, match.index + statistic.length + 30);
    const context = plainText.slice(start, end).trim();

    results.push({
      id: `stat_${idx}`,
      statistic,
      context,
      status: 'SOURCE_REQUIRED',
    });
    idx++;
  }

  return results;
}

/**
 * Verifies statistics against supplied source references.
 */
export function verifyStatistics(articleContent: string, sourceTexts: string[]): {
  statistics: ExtractedStatistic[];
  statisticsScore: number;
  unsupportedCount: number;
} {
  const stats = extractStatisticsFromText(articleContent);
  const combinedSource = sourceTexts.join(' ').toLowerCase();

  let supportedCount = 0;
  let unsupportedCount = 0;

  const verifiedStats = stats.map(item => {
    const normStat = item.statistic.toLowerCase().replace(/[^\w]/g, '');
    let status: ExtractedStatistic['status'] = 'UNSUPPORTED';
    let notes = 'Statistic figure not found in supplied source references.';

    if (sourceTexts.length === 0) {
      status = 'SOURCE_REQUIRED';
      notes = 'Statistic requires source verification reference.';
      unsupportedCount++;
    } else if (combinedSource.replace(/[^\w]/g, '').includes(normStat)) {
      status = 'SUPPORTED';
      notes = 'Numeric figure verified in source references.';
      supportedCount++;
    } else {
      status = 'UNSUPPORTED';
      notes = 'Statistic figure could not be matched to source references.';
      unsupportedCount++;
    }

    return { ...item, status, notes };
  });

  const total = verifiedStats.length || 1;
  const statisticsScore = verifiedStats.length === 0 ? 100 : Math.round((supportedCount / total) * 100);

  return {
    statistics: verifiedStats,
    statisticsScore,
    unsupportedCount,
  };
}
