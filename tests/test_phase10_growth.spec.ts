import { test, expect } from '@playwright/test';
import { auditDiscoverNewsEligibility } from '../lib/growth/discoverNewsEngine';
import { detectContentOpportunities } from '../lib/growth/opportunityEngine';
import { generateSocialDistributionPackage } from '../lib/growth/socialDistributionEngine';
import { auditRevenueReadiness } from '../lib/growth/revenueReadinessEngine';
import { calculateOptimalPublishingTime } from '../lib/growth/publishingTimeEngine';

test.describe('Phase 10: Audience Growth, Distribution & Revenue Readiness Test Suite', () => {

  test('1. Discover & News eligibility engine must audit featured image, author, and freshness', () => {
    const article = {
      id: 'art_phase10',
      title: 'Global Tech Breakthrough in AI Chips 2026',
      content: '<p>Major breakthrough announcement with detailed performance benchmarks and industry expert quotes.</p>'.repeat(5),
      featuredImage: 'https://genz-live.com/brand/logo.png',
      featuredImageAlt: 'AI Chips',
      publishedAt: new Date(),
      status: 'PUBLISHED',
      author: { name: 'Lead Reporter' },
      category: { slug: 'technology', name: 'Technology' },
    };

    const audit = auditDiscoverNewsEligibility(article);
    expect(audit.discoverScore).toBeGreaterThan(70);
    expect(audit.isDiscoverEligible).toBe(true);
    expect(audit.isNewsEligible).toBe(true);
  });

  test('2. Social distribution generator must format X, FB, IG, TG, WA copy with UTM params', () => {
    const article = {
      id: 'art_social',
      title: 'India Tech Innovation Summit Launched',
      slug: 'india-tech-innovation-summit',
      excerpt: 'National summit highlights startup growth and AI policy.',
      category: { name: 'Technology', slug: 'technology' },
    };

    const pkg = generateSocialDistributionPackage(article);
    expect(pkg.platforms.x.utmUrl).toContain('utm_source=x');
    expect(pkg.platforms.facebook.utmUrl).toContain('utm_source=facebook');
    expect(pkg.platforms.instagram.copy).toContain('#GenZLive');
    expect(pkg.platforms.whatsapp.copy).toContain('GenZ Live');
  });

  test('3. Revenue readiness engine must audit legal policies and AdSense publisher ID setup', () => {
    const report = auditRevenueReadiness();
    expect(report.score).toBeGreaterThan(70);
    expect(report.checklist.length).toBeGreaterThan(5);
  });

  test('4. Optimal publishing time calculator must return standard window fallback when historical data is sparse', () => {
    const recommendation = calculateOptimalPublishingTime([]);
    expect(recommendation.recommendedWindow).toBeDefined();
    expect(recommendation.bestDays.length).toBeGreaterThan(0);
  });

  test('5. Content opportunity detector must flag high-impression GSC queries and popular follow-ups', () => {
    const articles = [
      { id: 'art_pop', title: 'Major AI Breakthrough', views: 80, publishedAt: new Date(), category: { name: 'Technology' } },
    ];
    const opportunities = detectContentOpportunities(articles);
    expect(opportunities.length).toBeGreaterThan(0);
    expect(opportunities[0].recommendedAction).toBeDefined();
  });

});
