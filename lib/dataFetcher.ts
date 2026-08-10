// ================================================================
// GenZ Live — Data Fetching Architecture
// Decoupled data access layer: tries Prisma/MySQL first, falls back
// to clearly labeled fallback demo content when DB is unconfigured/empty.
// ================================================================

import prisma from '@/lib/prisma';
import type { Article, BreakingHeadline, YouTubeVideo } from '@/types';
import { ARTICLES, FEATURED_STORIES, BREAKING_HEADLINES, YOUTUBE_VIDEOS } from '@/lib/newsData';

// Only attempt live Prisma DB queries if explicitly enabled via ENABLE_DB_PRISMA environment variable
const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true';

/** Helper: Label fallback data cleanly as [DEMO CONTENT] */
function withDemoLabel(article: Article): Article {
  return {
    ...article,
    isDemo: true,
    title: article.title.startsWith('[DEMO CONTENT]') ? article.title : `[DEMO CONTENT] ${article.title}`,
  };
}

/** 1. Fetch Breaking News */
export async function getBreakingNews(): Promise<BreakingHeadline[]> {
  if (isDbEnabled) {
    try {
      const dbBreaking = await prisma.breakingNews.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 10,
      });

      if (dbBreaking.length > 0) {
        return dbBreaking.map(item => ({
          id: item.id,
          text: item.text,
          category: item.category,
          time: 'Just Now',
        }));
      }
    } catch {
      // Fail quietly to fallback demo data
    }
  }

  return BREAKING_HEADLINES;
}

/** 2. Fetch Featured Stories for Hero */
export async function getFeaturedArticles(): Promise<{ featuredStory: Article; secondaryStories: Article[] }> {
  if (isDbEnabled) {
    try {
      const dbFeatured = await prisma.article.findMany({
        where: { status: 'PUBLISHED', isFeatured: true },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
        take: 4,
      });

      if (dbFeatured.length > 0) {
        const mapped: Article[] = dbFeatured.map(a => ({
          id: a.id,
          title: a.title,
          subtitle: a.subtitle ?? undefined,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          authorRole: 'Staff Writer',
          authorAvatar: a.author.avatar ?? undefined,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '4 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
          content: a.content,
          isFeatured: a.isFeatured,
        }));

        return {
          featuredStory: mapped[0],
          secondaryStories: mapped.slice(1),
        };
      }
    } catch {
      // Fail quietly to fallback
    }
  }

  // Fallback demo content
  return {
    featuredStory: withDemoLabel(FEATURED_STORIES[0]),
    secondaryStories: FEATURED_STORIES.slice(1).map(withDemoLabel),
  };
}

/** 3. Fetch Latest Articles Feed */
export async function getLatestArticles(limit: number = 9): Promise<Article[]> {
  if (isDbEnabled) {
    try {
      const dbArticles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      if (dbArticles.length > 0) {
        return dbArticles.map(a => ({
          id: a.id,
          title: a.title,
          subtitle: a.subtitle ?? undefined,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          authorRole: 'Staff Writer',
          authorAvatar: a.author.avatar ?? undefined,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '3 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          content: a.content,
        }));
      }
    } catch {
      // Fail quietly to fallback
    }
  }

  return ARTICLES.slice(0, limit).map(withDemoLabel);
}

/** 4. Fetch Category Articles */
export async function getCategoryArticles(categorySlug: string, limit: number = 6): Promise<Article[]> {
  if (isDbEnabled) {
    try {
      const dbArticles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          category: { slug: categorySlug },
        },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      if (dbArticles.length > 0) {
        return dbArticles.map(a => ({
          id: a.id,
          title: a.title,
          subtitle: a.subtitle ?? undefined,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          authorRole: 'Staff Writer',
          authorAvatar: a.author.avatar ?? undefined,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '4 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          content: a.content,
        }));
      }
    } catch {
      // Fail quietly to fallback
    }
  }

  const matches = ARTICLES.filter(a => a.category === categorySlug || categorySlug === 'all');
  if (matches.length > 0) {
    return matches.slice(0, limit).map(withDemoLabel);
  }

  return ARTICLES.slice(0, limit).map(withDemoLabel);
}

/** 5. Fetch Trending Articles (01..05 ranked list) */
export async function getTrendingArticles(limit: number = 5): Promise<Article[]> {
  if (isDbEnabled) {
    try {
      const dbTrending = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        include: { category: true, author: true },
        orderBy: { views: 'desc' },
        take: limit,
      });

      if (dbTrending.length > 0) {
        return dbTrending.map(a => ({
          id: a.id,
          title: a.title,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '3 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          content: a.content,
        }));
      }
    } catch {
      // Fail quietly to fallback
    }
  }

  return ARTICLES.slice(0, limit).map(withDemoLabel);
}

/** 6. Fetch YouTube Videos */
export async function getVideos(limit: number = 6): Promise<YouTubeVideo[]> {
  if (isDbEnabled) {
    try {
      const dbVideos = await prisma.video.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      if (dbVideos.length > 0) {
        return dbVideos.map(v => ({
          id: v.id,
          title: v.title,
          duration: v.duration ?? '10:00',
          views: `${v.views} views`,
          thumbnail: v.thumbnail ?? '/brand/02_YouTube_Banner_2560x1440.png',
          embedId: v.youtubeId,
          isLive: v.isLive,
          published: v.publishedAt ? new Date(v.publishedAt).toLocaleDateString('en-US') : 'Recently',
        }));
      }
    } catch {
      // Fail quietly to fallback
    }
  }

  return YOUTUBE_VIDEOS.slice(0, limit);
}
