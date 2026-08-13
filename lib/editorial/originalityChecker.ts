// ================================================================
// GenZ Live — Editorial Originality & Similarity Checker Engine
// Deterministic text overlap, n-gram matching, headline similarity,
// structural alignment, and Source Dependency Score (0–100).
// ================================================================

export interface SourceMatchResult {
  sourceName: string;
  sourceUrl?: string;
  headlineSimilarity: number; // 0.0 - 1.0
  textSimilarity: number; // 0.0 - 1.0
  structuralSimilarity: number; // 0.0 - 1.0
  matchingPhrasesCount: number;
  matchingPhrases: string[];
  dependencyScore: number; // 0 - 100
}

export interface OriginalityAnalysisResult {
  originalityScore: number; // 0 - 100
  sourceDependencyScore: number; // 0 - 100
  overallAssessment: 'HIGH' | 'MEDIUM' | 'LOW' | 'REVIEW_REQUIRED';
  headlineSimilarityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedHeadline?: string;
  matchingPhrases: string[];
  sourceMatches: SourceMatchResult[];
  structuralWarning?: string;
}

/**
 * Normalizes text for n-gram comparison (lowercase, strip punctuation).
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts word n-grams of specified size from text.
 */
function extractNGrams(text: string, n: number): Set<string> {
  const words = normalizeText(text).split(' ').filter(Boolean);
  const nGrams = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    nGrams.add(words.slice(i, i + n).join(' '));
  }
  return nGrams;
}

/**
 * Calculates Jaccard similarity index between two sets.
 */
function calculateJaccard(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  setA.forEach(item => {
    if (setB.has(item)) intersectionCount++;
  });
  const unionSize = setA.size + setB.size - intersectionCount;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
}

/**
 * Detects exact continuous matching phrases of 5+ words.
 */
export function findMatchingPhrases(textA: string, textB: string, minWords = 5): string[] {
  const normA = normalizeText(textA).split(' ');
  const normB = normalizeText(textB).split(' ');
  const normBStr = ` ${normB.join(' ')} `;

  const matches = new Set<string>();

  for (let i = 0; i <= normA.length - minWords; i++) {
    for (let len = minWords; len <= 12 && i + len <= normA.length; len++) {
      const phrase = normA.slice(i, i + len).join(' ');
      if (normBStr.includes(` ${phrase} `)) {
        matches.add(phrase);
      }
    }
  }

  // Filter sub-phrases (keep longest phrase matches)
  const sorted = Array.from(matches).sort((a, b) => b.length - a.length);
  const result: string[] = [];

  sorted.forEach(phrase => {
    if (!result.some(existing => existing.includes(phrase))) {
      result.push(phrase);
    }
  });

  return result.slice(0, 10);
}

/**
 * Calculates headline similarity level (LOW, MEDIUM, HIGH).
 */
export function calculateHeadlineSimilarity(headlineA: string, headlineB: string): {
  similarity: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
} {
  const nGramsA = extractNGrams(headlineA, 2);
  const nGramsB = extractNGrams(headlineB, 2);
  const similarity = calculateJaccard(nGramsA, nGramsB);

  let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (similarity >= 0.6) {
    level = 'HIGH';
  } else if (similarity >= 0.3) {
    level = 'MEDIUM';
  }

  return { similarity, level };
}

/**
 * Calculates structural section similarity between two articles.
 */
export function calculateStructuralSimilarity(contentA: string, contentB: string): number {
  const paragraphsA = contentA.split('\n\n').filter(p => p.trim().length > 30);
  const paragraphsB = contentB.split('\n\n').filter(p => p.trim().length > 30);

  if (paragraphsA.length === 0 || paragraphsB.length === 0) return 0;

  let paragraphMatches = 0;
  paragraphsA.forEach(pA => {
    const nA = extractNGrams(pA, 3);
    for (const pB of paragraphsB) {
      const nB = extractNGrams(pB, 3);
      if (calculateJaccard(nA, nB) >= 0.3) {
        paragraphMatches++;
        break;
      }
    }
  });

  return Math.min(1.0, paragraphMatches / Math.max(paragraphsA.length, paragraphsB.length));
}

/**
 * Main Originality Analysis Engine.
 */
export function analyzeOriginality(
  headline: string,
  content: string,
  sources: Array<{ name: string; url?: string; headline?: string; content: string }>
): OriginalityAnalysisResult {
  if (!sources || sources.length === 0) {
    return {
      originalityScore: 100,
      sourceDependencyScore: 0,
      overallAssessment: 'HIGH',
      headlineSimilarityLevel: 'LOW',
      matchingPhrases: [],
      sourceMatches: [],
    };
  }

  const allMatchingPhrases: string[] = [];
  const sourceMatches: SourceMatchResult[] = [];
  let maxHeadlineSim = 0;
  let maxHeadlineLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let maxTextSim = 0;
  let maxStructSim = 0;

  sources.forEach(src => {
    const headlineSimResult = src.headline
      ? calculateHeadlineSimilarity(headline, src.headline)
      : { similarity: 0, level: 'LOW' as const };

    if (headlineSimResult.similarity > maxHeadlineSim) {
      maxHeadlineSim = headlineSimResult.similarity;
      maxHeadlineLevel = headlineSimResult.level;
    }

    const nGramsContent = extractNGrams(content, 3);
    const nGramsSrc = extractNGrams(src.content, 3);
    const textSim = calculateJaccard(nGramsContent, nGramsSrc);
    if (textSim > maxTextSim) maxTextSim = textSim;

    const structSim = calculateStructuralSimilarity(content, src.content);
    if (structSim > maxStructSim) maxStructSim = structSim;

    const matches = findMatchingPhrases(content, src.content, 5);
    matches.forEach(m => allMatchingPhrases.push(m));

    // Calculate source dependency score for this source (0-100)
    const dependencyScore = Math.min(
      100,
      Math.round(textSim * 50 + structSim * 30 + headlineSimResult.similarity * 20)
    );

    sourceMatches.push({
      sourceName: src.name,
      sourceUrl: src.url,
      headlineSimilarity: headlineSimResult.similarity,
      textSimilarity: textSim,
      structuralSimilarity: structSim,
      matchingPhrasesCount: matches.length,
      matchingPhrases: matches,
      dependencyScore,
    });
  });

  const uniquePhrases = Array.from(new Set(allMatchingPhrases));
  const overallDependencyScore = Math.min(
    100,
    Math.round(maxTextSim * 45 + maxStructSim * 35 + maxHeadlineSim * 20)
  );

  const originalityScore = Math.max(0, 100 - overallDependencyScore);

  let overallAssessment: OriginalityAnalysisResult['overallAssessment'] = 'HIGH';
  if (overallDependencyScore >= 70 || uniquePhrases.length >= 5) {
    overallAssessment = 'REVIEW_REQUIRED';
  } else if (overallDependencyScore >= 40 || uniquePhrases.length >= 2) {
    overallAssessment = 'MEDIUM';
  } else if (overallDependencyScore >= 20) {
    overallAssessment = 'MEDIUM';
  }

  let structuralWarning: string | undefined = undefined;
  if (maxStructSim >= 0.6) {
    structuralWarning =
      'High structural similarity detected. The article follows a narrative section order similar to the source.';
  }

  let suggestedHeadline: string | undefined = undefined;
  if ((maxHeadlineLevel as string) === 'HIGH') {
    suggestedHeadline = `${headline} — GenZ Perspective & Live Analysis`;
  }

  return {
    originalityScore,
    sourceDependencyScore: overallDependencyScore,
    overallAssessment,
    headlineSimilarityLevel: maxHeadlineLevel,
    suggestedHeadline,
    matchingPhrases: uniquePhrases,
    sourceMatches,
    structuralWarning,
  };
}
