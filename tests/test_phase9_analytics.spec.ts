import { test, expect } from '@playwright/test';
import { calculatePerformanceStatus, calculateVelocityScore, calculateDecayScore } from '../lib/analytics/articleAnalytics';
import { generateTrendingRecommendations } from '../lib/analytics/trendingIntelligence';
import { analyzeHeadlineQuality } from '../lib/analytics/headlineAnalyzer';
import { auditArticleSEOHealth } from '../lib/analytics/seoHealthEngine';
import { generateInternalLinkSuggestions } from '../lib/analytics/internalLinkEngine';
import { detectContentDecay } from '../lib/analytics/contentDecayDetector';
import { getGSCPerformanceData } from '../lib/analytics/gscClient';

test.describe('Phase 9: Newsroom Growth & SEO Intelligence Test Suite', () => {

  test('1. Article performance status must calculate correct tiers', () => {
    const statusHigh = calculatePerformanceStatus(300, new Date(Date.now() - 86400000), 50);
    const statusLow = calculatePerformanceStatus(2, new Date(Date.now() - 86400000 * 10), 50);

    expect(statusHigh).toBe('PERFORMING_WELL');
    expect(statusLow).toBe('NEEDS_ATTENTION');
  });

  test('2. Traffic velocity score must calculate views per hour acceleration', () => {
    const velocity = calculateVelocityScore(25, 100);
    expect(velocity).toBe(25);
  });

  test('3. Content decay score must flag older evergreen stories experiencing traffic decline', () => {
    const oldDate = new Date(Date.now() - 86400000 * 40);
    const decay = calculateDecayScore(oldDate, 0);
    expect(decay).toBeGreaterThan(50);
  });

  test('4. Headline Analyzer must detect optimal length, clickbait risk, and offer suggestions', () => {
    const clickbait = analyzeHeadlineQuality('You Won\'t Believe What Happened Next In Tech');
    const goodHeadline = 'TechCorp Reports Record $10 Billion Revenue Growth in Q4';

    expect(clickbait.clickbaitRisk).toBe('HIGH');
    expect(goodHeadline).toBeDefined();

    const goodReport = analyzeHeadlineQuality(goodHeadline);
    expect(goodReport.qualityScore).toBeGreaterThan(80);
    expect(goodReport.clarityLevel).toBe('EXCELLENT');
  });

  test('5. SEO Health Engine must audit meta tags, featured image, word count, and sitemaps', () => {
    const article = {
      id: 'art_123',
      title: 'India AI Summit 2026 Live Updates',
      slug: 'india-ai-summit-2026',
      content: '<p>Comprehensive report covering the artificial intelligence summit in New Delhi with major tech CEOs attending <a href="https://genz-live.com/india/related">related story</a>.</p>'.repeat(10),
      excerpt: 'India AI Summit 2026 live coverage',
      metaTitle: 'India AI Summit 2026 Live Updates — GenZ Live',
      metaDescription: 'Complete live coverage of the India AI Summit 2026 in New Delhi.',
      canonicalUrl: 'https://genz-live.com/india/india-ai-summit-2026',
      featuredImage: 'https://genz-live.com/brand/logo.png',
      featuredImageAlt: 'India AI Summit 2026',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      category: { slug: 'india' },
    };

    const audit = auditArticleSEOHealth(article);
    expect(audit.status).toBe('GOOD');
    expect(audit.hasMetaTitle).toBe(true);
    expect(audit.hasFeaturedImage).toBe(true);
  });

  test('6. Internal Link Suggester must generate relevant target links based on category and title keywords', () => {
    const current = {
      id: 'art_1',
      categoryId: 'cat_tech',
      content: 'TechCorp launched a new artificial intelligence agent today.',
    };

    const targetArticles = [
      { id: 'art_2', title: 'TechCorp Artificial Intelligence Breakthrough', slug: 'techcorp-ai-breakthrough', categoryId: 'cat_tech', category: { slug: 'technology' } },
    ];

    const suggestions = generateInternalLinkSuggestions(current, targetArticles);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].targetTitle).toContain('TechCorp');
  });

  test('7. Content Decay Detector must identify stories needing refresh', () => {
    const articles = [
      {
        id: 'art_old',
        title: 'Complete Guide to AI Frameworks 2025',
        slug: 'ai-frameworks-2025',
        views: 15,
        publishedAt: new Date(Date.now() - 86400000 * 100),
        category: { name: 'Technology' },
        author: { name: 'Senior Tech Writer' },
      },
    ];

    const decayed = detectContentDecay(articles);
    expect(decayed.length).toBe(1);
    expect(decayed[0].decayScore).toBeGreaterThan(60);
  });

  test('8. Google Search Console API fallback must handle unconfigured environment safely', async () => {
    const gsc = await getGSCPerformanceData();
    expect(gsc.isConnected).toBeDefined();
    expect(typeof gsc.statusMessage).toBe('string');
  });

});
