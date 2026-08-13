// ================================================================
// GenZ Live — Data Fetching Architecture
// Decoupled data access layer: tries Prisma/MySQL first, falls back
// to clearly labeled fallback demo content when DB is unconfigured/empty.
// ================================================================

import prisma from '@/lib/prisma';
import type { BreakingHeadline, YouTubeVideo } from '@/types';
import { BREAKING_HEADLINES, YOUTUBE_VIDEOS } from '@/lib/newsData';

// Only attempt live Prisma DB queries if explicitly enabled via ENABLE_DB_PRISMA environment variable
const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true' || Boolean(process.env.DATABASE_URL);

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

// Re-export core data functions from lib/dataAccess.ts to ensure 100% consistent Hybrid Auto-Padding
export {
  getFeaturedArticles,
  getLatestArticles,
  getCategoryArticles,
  getTrendingArticles,
  getPublishedArticle,
} from '@/lib/dataAccess';

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
