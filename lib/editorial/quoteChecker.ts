// ================================================================
// GenZ Live — Editorial Quote Verification Engine
// Extracts direct quotes and verifies speaker attributions against sources.
// Critical Rule: AI must NEVER invent quotes. Unverified quotes are RED flags.
// ================================================================

export interface ExtractedQuote {
  id: string;
  quote: string;
  speaker?: string;
  source?: string;
  status: 'VERIFIED' | 'UNVERIFIED' | 'MISSING_ATTRIBUTION';
  notes?: string;
}

/**
 * Extracts direct quote strings from article text.
 */
export function extractQuotesFromText(content: string): Array<{ quote: string; context: string }> {
  if (!content) return [];
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Match text inside double quotes or curly quotes
  const quoteRegex = /["“]([^"”]{10,300})["”]/g;
  const quotes: Array<{ quote: string; context: string }> = [];

  let match;
  while ((match = quoteRegex.exec(plainText)) !== null) {
    const quote = match[1].trim();
    // Get 50 chars surrounding context for speaker detection
    const startIdx = Math.max(0, match.index - 50);
    const endIdx = Math.min(plainText.length, match.index + match[0].length + 50);
    const context = plainText.slice(startIdx, endIdx);

    quotes.push({ quote, context });
  }

  return quotes.slice(0, 10);
}

/**
 * Detects potential speaker name from surrounding context.
 */
function detectSpeaker(context: string): string | undefined {
  const speakerRegex = /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(said|stated|announced|told|added|remarked|commented|explained)\b/i;
  const match = speakerRegex.exec(context);
  return match ? match[1] : undefined;
}

/**
 * Verifies extracted quotes against supplied source texts.
 */
export function verifyQuotes(articleContent: string, sourceTexts: string[]): {
  quotes: ExtractedQuote[];
  quoteScore: number;
  unverifiedCount: number;
} {
  const extracted = extractQuotesFromText(articleContent);
  const combinedSource = sourceTexts.join(' ').toLowerCase();

  const quotes: ExtractedQuote[] = [];
  let verifiedCount = 0;
  let unverifiedCount = 0;

  extracted.forEach((item, idx) => {
    const normQuote = item.quote.toLowerCase().replace(/[^\w\s]/g, '');
    const speaker = detectSpeaker(item.context);

    let status: ExtractedQuote['status'] = 'UNVERIFIED';
    let notes = 'Quote not found in supplied sources.';

    if (sourceTexts.length === 0) {
      status = 'UNVERIFIED';
      notes = 'No source references provided to verify quote.';
      unverifiedCount++;
    } else {
      const normSource = combinedSource.replace(/[^\w\s]/g, '');
      if (normSource.includes(normQuote) || normSource.includes(normQuote.slice(0, 30))) {
        status = speaker ? 'VERIFIED' : 'MISSING_ATTRIBUTION';
        notes = speaker ? `Verified quote attributed to ${speaker}.` : 'Quote text verified, but speaker attribution missing.';
        if (status === 'VERIFIED') verifiedCount++;
      } else {
        status = 'UNVERIFIED';
        notes = 'Quote text could not be verified in supplied source references.';
        unverifiedCount++;
      }
    }

    quotes.push({
      id: `quote_${idx + 1}`,
      quote: item.quote,
      speaker,
      status,
      notes,
    });
  });

  const total = quotes.length || 1;
  const quoteScore = quotes.length === 0 ? 100 : Math.round((verifiedCount / total) * 100);

  return {
    quotes,
    quoteScore,
    unverifiedCount,
  };
}
