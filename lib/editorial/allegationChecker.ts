// ================================================================
// GenZ Live — Editorial Allegation & Defamation Safety Checker
// Detects sensitive legal/criminal claims presented without attribution.
// ================================================================

export interface FlaggedAllegation {
  id: string;
  sentence: string;
  keyword: string;
  hasAttribution: boolean;
  status: 'SAFE' | 'ATTRIBUTION_RECOMMENDED' | 'CRITICAL_RISK';
  suggestedPhrasing: string;
}

const ALLEGATION_KEYWORDS = [
  'accused',
  'allegedly',
  'reportedly',
  'fraud',
  'corruption',
  'criminal',
  'scam',
  'misconduct',
  'sexual misconduct',
  'illegal',
  'cheating',
  'investigation',
  'arrested',
  'bribed',
  'embezzled',
];

const ATTRIBUTION_PATTERNS = [
  'according to',
  'police said',
  'officials stated',
  'report alleged',
  'authorities claimed',
  'lawyers stated',
  'court documents',
  'denied all',
];

export function checkAllegationSafety(content: string): {
  allegations: FlaggedAllegation[];
  aiRiskScore: number;
  criticalCount: number;
} {
  if (!content) return { allegations: [], aiRiskScore: 0, criticalCount: 0 };
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const sentences = plainText.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
  const allegations: FlaggedAllegation[] = [];
  let criticalCount = 0;

  sentences.forEach((sentence, idx) => {
    const lower = sentence.toLowerCase();
    const foundKeyword = ALLEGATION_KEYWORDS.find(kw => lower.includes(kw));

    if (foundKeyword) {
      const hasAttribution = ATTRIBUTION_PATTERNS.some(pat => lower.includes(pat));
      let status: FlaggedAllegation['status'] = 'SAFE';

      if (!hasAttribution) {
        if (/\b(is a|was a|committed|stole|defrauded|cheated)\b/i.test(sentence)) {
          status = 'CRITICAL_RISK';
          criticalCount++;
        } else {
          status = 'ATTRIBUTION_RECOMMENDED';
        }
      }

      allegations.push({
        id: `allegation_${idx + 1}`,
        sentence,
        keyword: foundKeyword,
        hasAttribution,
        status,
        suggestedPhrasing: `According to reports, ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`,
      });
    }
  });

  const aiRiskScore = Math.min(100, criticalCount * 30 + (allegations.length - criticalCount) * 10);

  return {
    allegations,
    aiRiskScore,
    criticalCount,
  };
}
