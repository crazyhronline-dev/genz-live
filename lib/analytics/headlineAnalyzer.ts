// ================================================================
// GenZ Live — Editorial Headline Analysis Engine
// Evaluates headline clarity, specificity, length, and clickbait risk.
// ================================================================

export interface HeadlineAnalysisReport {
  headline: string;
  charCount: number;
  wordCount: number;
  qualityScore: number; // 0 - 100
  clarityLevel: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT';
  clickbaitRisk: 'LOW' | 'MODERATE' | 'HIGH';
  feedback: string[];
  suggestions: string[];
}

const CLICKBAIT_TRIGGERS = [
  'you won\'t believe',
  'will blow your mind',
  'shocking truth',
  'what happens next',
  'secret reason',
  'this is why',
  'number 5 will',
  'mind-blowing',
];

export function analyzeHeadlineQuality(headline: string): HeadlineAnalysisReport {
  if (!headline || !headline.trim()) {
    return {
      headline: '',
      charCount: 0,
      wordCount: 0,
      qualityScore: 0,
      clarityLevel: 'NEEDS_IMPROVEMENT',
      clickbaitRisk: 'LOW',
      feedback: ['Headline is empty.'],
      suggestions: ['Provide a clear, factual headline.'],
    };
  }

  const trimmed = headline.trim();
  const charCount = trimmed.length;
  const wordCount = trimmed.split(/\s+/).length;
  const lower = trimmed.toLowerCase();

  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Length Check (Optimal: 40-70 characters)
  if (charCount < 30) {
    score -= 20;
    feedback.push('Headline is too short. Search engines and readers prefer 40–70 characters.');
    suggestions.push('Add specific key details, entity names, or context to expand headline length.');
  } else if (charCount > 75) {
    score -= 15;
    feedback.push('Headline is slightly long and may truncate on search results SERPs.');
    suggestions.push('Keep main keywords within the first 60 characters.');
  } else {
    feedback.push('Optimal character length for Search SERPs and Social Cards.');
  }

  // Specificity Check (Contains numbers, proper nouns, or specific terms)
  const containsSpecifics = /[0-9A-Z]/.test(trimmed);
  if (!containsSpecifics) {
    score -= 15;
    feedback.push('Headline lacks specific numbers or proper nouns.');
    suggestions.push('Include specific company names, locations, or dates for stronger search intent.');
  }

  // Clickbait & Sensationalism Risk Check
  const foundClickbait = CLICKBAIT_TRIGGERS.filter(trigger => lower.includes(trigger));
  let clickbaitRisk: HeadlineAnalysisReport['clickbaitRisk'] = 'LOW';

  if (foundClickbait.length > 0) {
    score -= 30;
    clickbaitRisk = 'HIGH';
    feedback.push(`Contains clickbait phrasing: "${foundClickbait.join(', ')}".`);
    suggestions.push('Rephrase to state the factual event clearly without hype.');
  } else if (/\b(secret|shocker|unbelievable)\b/i.test(trimmed)) {
    clickbaitRisk = 'MODERATE';
    score -= 10;
    feedback.push('Contains sensationalist wording.');
  }

  let clarityLevel: HeadlineAnalysisReport['clarityLevel'] = 'GOOD';
  if (score >= 80) clarityLevel = 'EXCELLENT';
  else if (score < 60) clarityLevel = 'NEEDS_IMPROVEMENT';

  return {
    headline: trimmed,
    charCount,
    wordCount,
    qualityScore: Math.max(0, score),
    clarityLevel,
    clickbaitRisk,
    feedback,
    suggestions,
  };
}
