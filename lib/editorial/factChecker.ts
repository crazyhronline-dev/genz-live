// ================================================================
// GenZ Live — Editorial Fact Checker Engine
// Extracts factual claims and verifies them against source materials.
// ================================================================

export interface ExtractedClaim {
  id: string;
  claim: string;
  claimType: 'FACT' | 'STATISTIC' | 'ALLEGATION' | 'STATEMENT' | 'DATE' | 'CAUSATION';
  supportingSource?: string;
  confidence: number; // 0.0 to 1.0
  attributionRequired: boolean;
  status: 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'UNSUPPORTED' | 'CONTRADICTED' | 'REQUIRES_REVIEW';
  suggestedAttribution?: string;
}

/**
 * Extracts key factual sentences and claims from article text.
 */
export function extractClaimsFromText(content: string): string[] {
  if (!content || !content.trim()) return [];

  // Strip HTML tags
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Split into sentences
  const sentences = plainText
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  // Filter sentences containing facts (names, numbers, dates, claims)
  const factKeywords = /\b(said|stated|announced|reported|according|launched|billion|million|crore|percent|%|dollar|\$|rs|inr|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|202[0-9]|police|ministry|court|government|ceo|president|prime minister)\b/i;

  const claims = sentences.filter(sentence => factKeywords.test(sentence));
  return claims.slice(0, 15); // Cap at top 15 key claims for performance
}

/**
 * Evaluates claims against supplied source texts.
 */
export function verifyClaims(articleContent: string, sourceTexts: string[]): {
  claims: ExtractedClaim[];
  factScore: number;
  unsupportedCount: number;
} {
  const rawClaims = extractClaimsFromText(articleContent);
  const combinedSourceText = sourceTexts.join(' ').toLowerCase();

  const claims: ExtractedClaim[] = [];
  let supportedCount = 0;
  let unsupportedCount = 0;

  rawClaims.forEach((claimText, idx) => {
    const lowerClaim = claimText.toLowerCase();

    // Categorize claim type
    let claimType: ExtractedClaim['claimType'] = 'FACT';
    if (/\b(\d+|percent|%|\$|billion|million|crore)\b/i.test(claimText)) {
      claimType = 'STATISTIC';
    } else if (/\b(accused|alleged|fraud|misconduct|scam|investigation|illegal)\b/i.test(claimText)) {
      claimType = 'ALLEGATION';
    } else if (/\b(said|stated|announced|claimed|commented)\b/i.test(claimText)) {
      claimType = 'STATEMENT';
    }

    // Check if key words of claim exist in source text
    const words = lowerClaim
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);

    let matchCount = 0;
    words.forEach(word => {
      if (combinedSourceText.includes(word)) matchCount++;
    });

    const matchRatio = words.length > 0 ? matchCount / words.length : 0;
    let status: ExtractedClaim['status'] = 'REQUIRES_REVIEW';
    let confidence = 0.5;

    if (sourceTexts.length === 0) {
      status = 'REQUIRES_REVIEW';
      confidence = 0.4;
      unsupportedCount++;
    } else if (matchRatio >= 0.7) {
      status = 'SUPPORTED';
      confidence = 0.9;
      supportedCount++;
    } else if (matchRatio >= 0.4) {
      status = 'PARTIALLY_SUPPORTED';
      confidence = 0.65;
    } else {
      status = 'REQUIRES_REVIEW';
      confidence = 0.3;
      unsupportedCount++;
    }

    // Check if attribution is missing for statements or external claims
    const hasAttribution = /\b(according to|said|stated|reported by|official told|police said|ministry stated)\b/i.test(claimText);
    const attributionRequired = claimType === 'ALLEGATION' || (claimType === 'STATEMENT' && !hasAttribution);

    claims.push({
      id: `claim_${idx + 1}`,
      claim: claimText,
      claimType,
      supportingSource: sourceTexts.length > 0 ? 'Supplied Source References' : undefined,
      confidence,
      attributionRequired,
      status,
      suggestedAttribution: attributionRequired ? `According to reporting, ${claimText.charAt(0).toLowerCase()}${claimText.slice(1)}` : undefined,
    });
  });

  const total = claims.length || 1;
  const factScore = Math.max(0, Math.round(((supportedCount + (total - unsupportedCount)) / (total * 2)) * 100));

  return {
    claims,
    factScore: Math.min(100, factScore),
    unsupportedCount,
  };
}
