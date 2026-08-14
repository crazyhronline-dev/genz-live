// ================================================================
// GenZ Live — Editorial Checker Master Orchestrator
// Coordinates fact-checking, originality, quote, statistics, allegation,
// and SSRF URL security to generate unified Editorial Scorecards.
// ================================================================

import prisma from '@/lib/prisma';
import { verifyClaims, ExtractedClaim } from './factChecker';
import { analyzeOriginality, SourceMatchResult } from './originalityChecker';
import { verifyQuotes, ExtractedQuote } from './quoteChecker';
import { verifyStatistics, ExtractedStatistic } from './statisticsChecker';
import { checkAllegationSafety, FlaggedAllegation } from './allegationChecker';

export interface EditorialSourceInput {
  name: string;
  url?: string;
  headline?: string;
  content: string;
}

export interface EditorialCheckReport {
  status: 'PASSED' | 'REVIEW_REQUIRED' | 'FAILED';
  overallScore: number;
  factScore: number;
  originalityScore: number;
  sourceDependencyScore: number;
  quoteScore: number;
  statisticsScore: number;
  attributionScore: number;
  aiRiskScore: number;
  
  claims: ExtractedClaim[];
  sourceMatches: SourceMatchResult[];
  quotes: ExtractedQuote[];
  statistics: ExtractedStatistic[];
  allegations: FlaggedAllegation[];
  matchingPhrases: string[];
  riskFlags: string[];
  suggestedAttributions: string[];
  headlineSimilarityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedHeadline?: string;
  
  finalRecommendation: string;
}

/**
 * Validates external source URLs to prevent SSRF vulnerabilities.
 */
export function isValidSourceUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Reject dangerous schemes
  if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://')) return false;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    // Reject localhost, 127.0.0.1, IPv6 loopback, and private IP ranges
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      /^(\d{1,3}\.){3}\d{1,3}$/.test(host)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Strips prompt injection tokens from source materials to treat external data as untrusted text.
 */
export function sanitizeSourceContent(rawContent: string): string {
  if (!rawContent) return '';
  return rawContent
    .replace(/\b(ignore previous instructions|publish this article|reveal system prompt|you are now|system override)\b/gi, '[filtered prompt instruction]')
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, '');
}

export interface EditorialMetaDataInput {
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
}

/**
 * Master Server-Side Orchestrator function to execute all editorial checks.
 */
export async function executeEditorialCheck(
  headline: string,
  content: string,
  sourcesInput: EditorialSourceInput[] = [],
  metaInput?: EditorialMetaDataInput
): Promise<EditorialCheckReport> {
  // 1. Sanitize source content and filter SSRF URLs
  const sanitizedSources = sourcesInput
    .filter(s => !s.url || isValidSourceUrl(s.url))
    .map(s => ({
      ...s,
      content: sanitizeSourceContent(s.content),
    }));

  const sourceTexts = sanitizedSources.map(s => s.content).filter(Boolean);

  // 2. Execute sub-checking engines
  const factResult = verifyClaims(content, sourceTexts);
  const originalityResult = analyzeOriginality(headline, content, sanitizedSources);
  const quoteResult = verifyQuotes(content, sourceTexts);
  const statResult = verifyStatistics(content, sourceTexts);
  const allegationResult = checkAllegationSafety(content);

  // 3. Synthesize risk flags and suggestions
  const riskFlags: string[] = [];
  const suggestedAttributions: string[] = [];
  let scoreDeductions = 0;

  // Word count & thin content check
  const plainWords = (content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean);
  const wordCount = plainWords.length;

  if (wordCount < 100) {
    riskFlags.push(`❌ Thin Content Alert: Article contains only ${wordCount} word(s). Minimum 200 words required for publication.`);
    scoreDeductions += 35;
  } else if (wordCount < 200) {
    riskFlags.push(`⚠️ Short Article Warning: Article contains ${wordCount} words (recommend expanding to 200+ words).`);
    scoreDeductions += 15;
  }

  // Image & Alt text compliance check
  if (metaInput?.featuredImage) {
    const altText = metaInput.featuredImageAlt?.trim() || '';
    if (!altText) {
      riskFlags.push(`⚠️ Missing Image ALT Text: Featured header image lacks descriptive ALT text for accessibility & SEO.`);
      scoreDeductions += 15;
    } else if (['test', 'image', 'photo', 'img', 'picture'].includes(altText.toLowerCase())) {
      riskFlags.push(`⚠️ Generic Image ALT Text: Featured image ALT text ("${altText}") is non-descriptive.`);
      scoreDeductions += 10;
    }
  } else {
    riskFlags.push(`⚠️ Missing Featured Image: No header image attached to article.`);
    scoreDeductions += 10;
  }

  // Test / Placeholder Title check
  if (/\b(test|sample|draft|demo|dummy)\b/i.test(headline)) {
    riskFlags.push(`⚠️ Placeholder Title Flag: Article title contains test/draft keywords ("${headline}").`);
    scoreDeductions += 15;
  }

  if (quoteResult.unverifiedCount > 0) {
    riskFlags.push(`${quoteResult.unverifiedCount} unverified quote(s) detected without source confirmation.`);
  }

  if (allegationResult.criticalCount > 0) {
    riskFlags.push(`${allegationResult.criticalCount} unverified criminal/defamation allegation(s) detected.`);
  }

  if (originalityResult.sourceDependencyScore >= 70) {
    riskFlags.push(`High Source Dependency Score (${originalityResult.sourceDependencyScore}/100). Review article structure.`);
  }

  if (originalityResult.matchingPhrases.length > 0) {
    riskFlags.push(`${originalityResult.matchingPhrases.length} matching phrase(s) overlapping with source text.`);
  }

  factResult.claims.forEach(c => {
    if (c.suggestedAttribution) suggestedAttributions.push(c.suggestedAttribution);
  });

  // Calculate overall weighted score (0 - 100) with deductions
  const baseScore = Math.round(
    factResult.factScore * 0.25 +
    originalityResult.originalityScore * 0.25 +
    quoteResult.quoteScore * 0.20 +
    statResult.statisticsScore * 0.15 +
    (100 - allegationResult.aiRiskScore) * 0.15
  );

  const overallScore = Math.max(0, baseScore - scoreDeductions);

  let status: EditorialCheckReport['status'] = 'PASSED';
  let finalRecommendation = 'READY FOR EDITORIAL APPROVAL';

  if (quoteResult.unverifiedCount > 0 || allegationResult.criticalCount > 0 || originalityResult.sourceDependencyScore >= 80 || wordCount < 50) {
    status = 'FAILED';
    finalRecommendation = 'DO NOT PUBLISH UNTIL CRITICAL ISSUES ARE RESOLVED';
  } else if (overallScore < 75 || riskFlags.length > 0) {
    status = 'REVIEW_REQUIRED';
    finalRecommendation = 'HUMAN EDITORIAL REVIEW REQUIRED';
  }

  const attributionScore = factResult.claims.length > 0
    ? Math.round(((factResult.claims.length - suggestedAttributions.length) / factResult.claims.length) * 100)
    : 100;

  return {
    status,
    overallScore,
    factScore: factResult.factScore,
    originalityScore: originalityResult.originalityScore,
    sourceDependencyScore: originalityResult.sourceDependencyScore,
    quoteScore: quoteResult.quoteScore,
    statisticsScore: statResult.statisticsScore,
    attributionScore: Math.max(0, attributionScore),
    aiRiskScore: allegationResult.aiRiskScore,

    claims: factResult.claims,
    sourceMatches: originalityResult.sourceMatches,
    quotes: quoteResult.quotes,
    statistics: statResult.statistics,
    allegations: allegationResult.allegations,
    matchingPhrases: originalityResult.matchingPhrases,
    riskFlags,
    suggestedAttributions,
    headlineSimilarityLevel: originalityResult.headlineSimilarityLevel,
    suggestedHeadline: originalityResult.suggestedHeadline,
    finalRecommendation,
  };
}

/**
 * Saves or updates EditorialCheck in database for an article.
 */
export async function saveEditorialCheckResult(
  articleId: string,
  report: EditorialCheckReport,
  userId?: string
) {
  try {
    const existing = await prisma.editorialCheck.findUnique({
      where: { articleId },
    });

    const checkData = {
      status: report.status,
      overallScore: report.overallScore,
      factScore: report.factScore,
      originalityScore: report.originalityScore,
      sourceDependencyScore: report.sourceDependencyScore,
      quoteScore: report.quoteScore,
      statisticsScore: report.statisticsScore,
      attributionScore: report.attributionScore,
      aiRiskScore: report.aiRiskScore,
      matchingPhrases: report.matchingPhrases,
      suggestedAttributions: report.suggestedAttributions,
      allegations: JSON.parse(JSON.stringify(report.allegations)),
      riskFlags: report.riskFlags,
      reviewedById: userId || null,
      reviewedAt: new Date(),
    };

    let checkRecord;
    if (existing) {
      checkRecord = await prisma.editorialCheck.update({
        where: { articleId },
        data: checkData,
      });

      // Clear old sub-records
      await prisma.editorialClaim.deleteMany({ where: { editorialCheckId: checkRecord.id } });
      await prisma.editorialSourceMatch.deleteMany({ where: { editorialCheckId: checkRecord.id } });
      await prisma.editorialQuoteCheck.deleteMany({ where: { editorialCheckId: checkRecord.id } });
    } else {
      checkRecord = await prisma.editorialCheck.create({
        data: {
          articleId,
          ...checkData,
        },
      });
    }

    // Insert claims
    if (report.claims.length > 0) {
      await prisma.editorialClaim.createMany({
        data: report.claims.map(c => ({
          editorialCheckId: checkRecord.id,
          claim: c.claim,
          claimType: c.claimType,
          supportingSource: c.supportingSource || null,
          confidence: c.confidence,
          attributionRequired: c.attributionRequired,
          status: c.status,
        })),
      });
    }

    // Insert source matches
    if (report.sourceMatches.length > 0) {
      await prisma.editorialSourceMatch.createMany({
        data: report.sourceMatches.map(m => ({
          editorialCheckId: checkRecord.id,
          sourceName: m.sourceName,
          sourceUrl: m.sourceUrl || null,
          headlineSimilarity: m.headlineSimilarity,
          textSimilarity: m.textSimilarity,
          structuralSimilarity: m.structuralSimilarity,
          matchingPhrasesCount: m.matchingPhrasesCount,
          dependencyScore: m.dependencyScore,
        })),
      });
    }

    // Insert quote checks
    if (report.quotes.length > 0) {
      await prisma.editorialQuoteCheck.createMany({
        data: report.quotes.map(q => ({
          editorialCheckId: checkRecord.id,
          quote: q.quote,
          speaker: q.speaker || null,
          source: q.source || null,
          status: q.status,
          notes: q.notes || null,
        })),
      });
    }

    return checkRecord;
  } catch (error) {
    console.error('[EditorialCheck Database Save Error]:', error);
    return null;
  }
}
