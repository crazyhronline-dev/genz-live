'use server';

// ================================================================
// GenZ Live — Newsroom Growth & SEO Analytics (Server Actions)
// Server actions for fetching performance dashboards, SEO health,
// author/category metrics, and Search Console intelligence.
// ================================================================

import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { calculatePerformanceStatus, calculateDecayScore } from '@/lib/analytics/articleAnalytics';
import { generateTrendingRecommendations } from '@/lib/analytics/trendingIntelligence';
import { detectContentDecay } from '@/lib/analytics/contentDecayDetector';
import { auditArticleSEOHealth } from '@/lib/analytics/seoHealthEngine';
import { getGSCPerformanceData } from '@/lib/analytics/gscClient';

/**
 * Master Overview Analytics Data Fetcher.
 */
export async function fetchOverviewAnalyticsAction() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return null;
  }

  try {
    const totalArticles = await prisma.article.count({ where: { status: 'PUBLISHED' } });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const publishedToday = await prisma.article.count({
      where: { status: 'PUBLISHED', publishedAt: { gte: today } },
    });

    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
      },
      orderBy: { views: 'desc' },
      take: 100,
    });

    const totalViews = articles.reduce((acc, a) => acc + a.views, 0);

    const topArticle = articles[0] ? {
      title: articles[0].title,
      slug: articles[0].slug,
      views: articles[0].views,
      categoryName: articles[0].category.name,
    } : null;

    // Recommendations & Content Decay
    const trendingRecommendations = generateTrendingRecommendations(articles);
    const decayedArticles = detectContentDecay(articles);
    const gscData = await getGSCPerformanceData();

    return {
      overview: {
        totalArticles,
        publishedToday,
        totalViews,
        topArticle,
      },
      articles: articles.slice(0, 20).map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        views: a.views,
        publishedAt: a.publishedAt,
        categoryName: a.category.name,
        authorName: a.author.name,
        performanceStatus: calculatePerformanceStatus(a.views, a.publishedAt),
        decayScore: calculateDecayScore(a.publishedAt, 0),
      })),
      trendingRecommendations,
      decayedArticles: decayedArticles.slice(0, 5),
      gscData,
    };
  } catch (error) {
    console.error('[fetchOverviewAnalyticsAction Error]:', error);
    return null;
  }
}

/**
 * Author Performance Analytics Fetcher.
 */
export async function fetchAuthorAnalyticsAction() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return null;
  }

  try {
    const authors = await prisma.author.findMany({
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          select: { id: true, views: true, title: true, publishedAt: true },
        },
      },
    });

    return authors.map(author => {
      const articleCount = author.articles.length;
      const totalViews = author.articles.reduce((acc, a) => acc + a.views, 0);
      const avgViews = articleCount > 0 ? Math.round(totalViews / articleCount) : 0;
      const sortedArticles = [...author.articles].sort((a, b) => b.views - a.views);

      return {
        id: author.id,
        name: author.name,
        designation: author.designation || 'Staff Writer',
        articleCount,
        totalViews,
        avgViews,
        topArticleTitle: sortedArticles[0]?.title || 'No published stories',
      };
    }).sort((a, b) => b.totalViews - a.totalViews);
  } catch (error) {
    console.error('[fetchAuthorAnalyticsAction Error]:', error);
    return null;
  }
}

/**
 * Category Performance Analytics Fetcher.
 */
export async function fetchCategoryAnalyticsAction() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return null;
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          select: { id: true, views: true, title: true },
        },
      },
    });

    return categories.map(cat => {
      const articleCount = cat.articles.length;
      const totalViews = cat.articles.reduce((acc, a) => acc + a.views, 0);
      const avgViews = articleCount > 0 ? Math.round(totalViews / articleCount) : 0;

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        articleCount,
        totalViews,
        avgViews,
      };
    }).sort((a, b) => b.totalViews - a.totalViews);
  } catch (error) {
    console.error('[fetchCategoryAnalyticsAction Error]:', error);
    return null;
  }
}

/**
 * Technical SEO Health Dashboard Fetcher.
 */
export async function fetchSEOHealthDashboardAction() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return null;
  }

  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: { select: { slug: true } } },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });

    const audits = articles.map(a => auditArticleSEOHealth(a));

    const counts = {
      total: audits.length,
      good: audits.filter(a => a.status === 'GOOD').length,
      warning: audits.filter(a => a.status === 'WARNING').length,
      error: audits.filter(a => a.status === 'ERROR').length,
    };

    return { audits, counts };
  } catch (error) {
    console.error('[fetchSEOHealthDashboardAction Error]:', error);
    return null;
  }
}
