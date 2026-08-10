// ================================================================
// GenZ Live — Ingestion Story Deduplication Engine
// SHA-256 URL hashing + normalized title fingerprinting & similarity check
// ================================================================

import crypto from 'crypto';

/** Compute SHA-256 hash of a string */
export function computeHash(input: string): string {
  return crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex');
}

/** Normalize URL for consistent deduplication hashing */
export function normalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl.trim());
    // Strip common tracking query parameters
    url.searchParams.delete('utm_source');
    url.searchParams.delete('utm_medium');
    url.searchParams.delete('utm_campaign');
    url.searchParams.delete('utm_term');
    url.searchParams.delete('utm_content');
    url.searchParams.delete('fbclid');
    url.searchParams.delete('gclid');
    url.searchParams.delete('ref');
    return url.toString().replace(/\/$/, ''); // strip trailing slash for consistency
  } catch {
    return rawUrl.trim().toLowerCase().replace(/\/$/, '');
  }
}

/** Normalize title for fingerprinting (lowercase, alphanumeric words) */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Calculate Jaccard word-token similarity score (0.0 to 1.0) */
export function calculateTitleSimilarity(titleA: string, titleB: string): number {
  const normA = normalizeTitle(titleA);
  const normB = normalizeTitle(titleB);

  if (normA === normB) return 1.0;

  const wordsA = new Set(normA.split(' ').filter(w => w.length > 2));
  const wordsB = new Set(normB.split(' ').filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersectionCount = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) {
      intersectionCount++;
    }
  }

  const unionSize = new Set([...wordsA, ...wordsB]).size;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateOfId?: string;
  reason?: string;
  similarityScore?: number;
}
