'use server';

// ================================================================
// GenZ Live — Phase 10 Growth & Distribution (Server Actions)
// Protected server actions for Newsroom Daily Brief, Discover/News
// readiness, Social Distribution, and AdSense readiness.
// ================================================================

import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { auditDiscoverNewsEligibility } from '@/lib/growth/discoverNewsEngine';
import { detectContentOpportunities } from '@/lib/growth/opportunityEngine';
import { generateSocialDistributionPackage } from '@/lib/growth/socialDistributionEngine';
import { calculateOptimalPublishingTime } from '@/lib/growth/publishingTimeEngine';
import { auditRevenueReadiness } from '@/lib/growth/revenueReadinessEngine';
import { getGSCPerformanceData } from '@/lib/analytics/gscClient';

/**
 * Today's Newsroom Daily Brief Fetcher (/admin/newsroom).
 */
export async function fetchNewsroomDailyBriefAction() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return null;
  }

  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
      },
      orderBy: { views: 'desc' },
      take: 50,
    });

    const gscData = await getGSCPerformanceData();
    const opportunities = detectContentOpportunities(articles, gscData);
    const optimalTime = calculateOptimalPublishingTime(articles);
    const revenueReport = auditRevenueReadiness();

    const discoverAudits = articles.map(a => auditDiscoverNewsEligibility(a));
    const discoverEligibleCount = discoverAudits.filter(a => a.isDiscoverEligible).length;
    const newsEligibleCount = discoverAudits.filter(a => a.isNewsEligible).length;

    return {
      todayDate: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      publishedCount: articles.length,
      discoverEligibleCount,
      newsEligibleCount,
      opportunities,
      optimalTime,
      revenueReport,
      topArticles: articles.slice(0, 5).map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        views: a.views,
        categoryName: a.category.name,
      })),
    };
  } catch (error) {
    console.error('[fetchNewsroomDailyBriefAction Error]:', error);
    return null;
  }
}

/**
 * Audience Growth & Distribution Hub Fetcher (/admin/growth).
 */
export async function fetchGrowthHubDataAction() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return null;
  }

  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 20,
    });

    const socialPackages = articles.slice(0, 5).map(a => generateSocialDistributionPackage(a));
    const discoverAudits = articles.map(a => auditDiscoverNewsEligibility(a));
    const revenueReport = auditRevenueReadiness();

    return {
      articlesCount: articles.length,
      socialPackages,
      discoverAudits,
      revenueReport,
    };
  } catch (error) {
    console.error('[fetchGrowthHubDataAction Error]:', error);
    return null;
  }
}
