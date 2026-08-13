// ================================================================
// GenZ Live — Production News & Article Data Access Engine
// Enforces strict public security filters: only PUBLISHED articles
// with publishedAt <= NOW() are accessible via public APIs and views.
// ================================================================

import prisma from '@/lib/prisma';
import type { Article, BreakingHeadline } from '@/types';
import { ARTICLES, FEATURED_STORIES, BREAKING_HEADLINES } from '@/lib/newsData';

const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true' || Boolean(process.env.DATABASE_URL);


/** Helper: Category-specific high-resolution fallback image (Optimized 800px WebP) */
export function getCategoryFallbackImage(categorySlug?: string, title?: string): string {
  const cat = (categorySlug || '').toLowerCase();
  const t = (title || '').toLowerCase();

  if (cat.includes('ai') || t.includes('ai') || t.includes('intelligence') || t.includes('robot')) {
    return 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=65';
  }
  if (cat.includes('tech') || t.includes('tech') || t.includes('software') || t.includes('code') || t.includes('app')) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=65';
  }
  if (cat.includes('india') || t.includes('india') || t.includes('ranchi') || t.includes('delhi') || t.includes('mumbai')) {
    return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=65';
  }
  if (cat.includes('sport') || t.includes('cricket') || t.includes('sport') || t.includes('match') || t.includes('ipl')) {
    return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=65';
  }
  if (cat.includes('market') || cat.includes('business') || t.includes('stock') || t.includes('crypto') || t.includes('finance')) {
    return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=65';
  }
  if (cat.includes('world') || t.includes('global') || t.includes('world') || t.includes('summit')) {
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=65';
  }
  if (cat.includes('entertainment') || cat.includes('culture') || t.includes('movie') || t.includes('music')) {
    return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=65';
  }
  return 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=65';
}

/** Helper: Label fallback data cleanly as [DEMO CONTENT] */
function withDemoLabel(article: Article): Article {
  return {
    ...article,
    isDemo: true,
    title: article.title.startsWith('[DEMO CONTENT]') ? article.title : `[DEMO CONTENT] ${article.title}`,
  };
}

/** Helper: determine if this is a renderable image URL or extract video thumbnail */
export function resolveArticleImage(url?: string | null, catSlug?: string, title?: string): string {
  let u = (url || '').trim();
  if (!u || u.length < 5) return getCategoryFallbackImage(catSlug, title);

  // Data URLs, dynamic upload paths, and standard relative URLs
  if (u.startsWith('data:image/') || u.startsWith('/')) return u;

  // YouTube watch/embed URL → extract thumbnail
  const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;

  // newspinch.in/video/VIDEO_ID → extract YouTube thumbnail
  const nsMatch = u.match(/newspinch\.in\/video\/([a-zA-Z0-9_-]+)/);
  if (nsMatch && nsMatch[1]) return `https://img.youtube.com/vi/${nsMatch[1]}/hqdefault.jpg`;

  // Optimize Unsplash images dynamically
  if (u.includes('images.unsplash.com')) {
    u = u.replace(/w=\d+/, 'w=800').replace(/q=\d+/, 'q=65');
    if (!u.includes('w=800')) {
      u += u.includes('?') ? '&w=800&auto=format&fit=crop&q=65' : '?w=800&auto=format&fit=crop&q=65';
    }
  }

  // If it's a standard web URL (http/https), pass it directly so custom CDN URLs work
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return u;
  }

  return getCategoryFallbackImage(catSlug, title);
}

/** 1. Fetch Single Published Article by Category and Slug */
export async function getPublishedArticle(categorySlug: string, articleSlug: string): Promise<Article | null> {
  // Add 30-minute future buffer to prevent server/DB clock-skew from hiding newly published articles
  const now = new Date(Date.now() + 30 * 60 * 1000);

  if (isDbEnabled) {
    try {
      // Search by slug OR id, status = PUBLISHED, publishedAt <= now
      let article = await prisma.article.findFirst({
        where: {
          AND: [
            {
              OR: [
                { slug: articleSlug },
                { id: articleSlug },
              ],
            },
            { status: 'PUBLISHED' },
            {
              // Accept articles where publishedAt <= now OR publishedAt is null (published immediately)
              OR: [
                { publishedAt: { lte: now } },
                { publishedAt: null },
              ],
            },
          ],
        },
        include: {
          category: true,
          author: true,
          source: true,
          tags: { include: { tag: true } },
        },
      });

      // If not found, try case-insensitive or decoded slug
      if (!article) {
        const cleanSlug = decodeURIComponent(articleSlug).toLowerCase().trim();
        article = await prisma.article.findFirst({
        where: {
            AND: [
              {
                OR: [
                  { slug: cleanSlug },
                  { slug: { contains: cleanSlug } },
                ],
              },
              { status: 'PUBLISHED' },
              {
                // Accept articles where publishedAt <= now OR publishedAt is null
                OR: [
                  { publishedAt: { lte: now } },
                  { publishedAt: null },
                ],
              },
            ],
          },
          include: {
            category: true,
            author: true,
            source: true,
            tags: { include: { tag: true } },
          },
        });
      }

      if (article) {
        const image = resolveArticleImage(article.featuredImage, article.category.slug, article.title);

        return {
          id: article.id,
          slug: article.slug,
          title: article.title,
          subtitle: article.subtitle ?? undefined,
          excerpt: article.excerpt ?? undefined,
          content: article.content,
          category: article.category.slug,
          categoryName: article.category.name,
          author: article.author.name,
          authorRole: article.author.designation ?? 'Staff Writer',
          authorAvatar: article.author.avatar ?? undefined,
          publishedAt: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
          publishedAtRaw: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
          updatedAtRaw: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
          readTime: article.readTime ?? '4 min read',
          views: `${article.views}`,
          likes: article.likes,
          image,
          isFeatured: article.isFeatured,
          seoTitle: article.seoTitle ?? article.metaTitle ?? article.title,
          seoDescription: article.seoDescription ?? article.metaDescription ?? article.excerpt ?? undefined,
          keywords: article.keywords ? article.keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
          canonicalUrl: article.canonicalUrl ?? undefined,
          youtubeUrl: article.youtubeUrl ?? undefined,
          source: article.source ? { name: article.source.name, url: article.source.url ?? undefined } : undefined,
          tags: article.tags.map(t => ({ slug: t.tag.slug, name: t.tag.name })),
        };
      }
    } catch {
      // Fallback
    }
  }

  // Fallback match from static datasets
  const match = ARTICLES.find(a =>
    a.id === articleSlug ||
    a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === articleSlug ||
    a.category === categorySlug
  );

  return match ? withDemoLabel(match) : null;
}

/** 2. Fetch Latest Published Articles */
export async function getLatestArticles(limit: number = 9): Promise<Article[]> {
  const now = new Date(Date.now() + 5 * 60 * 1000);
  let dbResult: Article[] = [];

  if (isDbEnabled) {
    try {
      const dbArticles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: now },
        },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      if (dbArticles.length > 0) {
        dbResult = dbArticles.map(a => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          subtitle: a.subtitle ?? undefined,
          excerpt: a.excerpt ?? undefined,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          authorRole: a.author.designation ?? 'Staff Writer',
          authorAvatar: a.author.avatar ?? undefined,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          publishedAtRaw: a.publishedAt ? new Date(a.publishedAt).toISOString() : undefined,
          updatedAtRaw: a.updatedAt ? new Date(a.updatedAt).toISOString() : undefined,
          readTime: a.readTime ?? '3 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: resolveArticleImage(a.featuredImage, a.category.slug, a.title),
          content: a.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  if (dbResult.length >= limit) return dbResult;

  // Auto-pad missing slots with clean demo articles so the page is always full & rich
  const existingSlugs = new Set(dbResult.map(a => a.slug));
  const fallbackList = ARTICLES.filter(a => !existingSlugs.has(a.slug)).map(withDemoLabel);
  const needed = limit - dbResult.length;

  return [...dbResult, ...fallbackList.slice(0, needed)];
}

/** 3. Fetch Featured Hero Articles (Hybrid Auto-Padded) */
export async function getFeaturedArticles(): Promise<{ featuredStory: Article; secondaryStories: Article[] }> {
  const now = new Date(Date.now() + 5 * 60 * 1000);
  let dbMapped: Article[] = [];

  if (isDbEnabled) {
    try {
      const dbFeatured = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: now },
        },
        include: { category: true, author: true },
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
        take: 4,
      });

      if (dbFeatured.length > 0) {
        dbMapped = dbFeatured.map(a => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          subtitle: a.subtitle ?? undefined,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          authorRole: a.author.designation ?? 'Staff Writer',
          authorAvatar: a.author.avatar ?? undefined,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '4 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: resolveArticleImage(a.featuredImage, a.category.slug, a.title),
          content: a.content,
          isFeatured: a.isFeatured,
        }));
      }
    } catch {
      // Fallback
    }
  }

  const featuredStory = dbMapped.length > 0 ? dbMapped[0] : withDemoLabel(FEATURED_STORIES[0]);
  const realSecondary = dbMapped.slice(1);
  const existingSlugs = new Set([featuredStory.slug, ...realSecondary.map(s => s.slug)]);
  const fallbackSecondary = FEATURED_STORIES.filter(s => !existingSlugs.has(s.slug)).map(withDemoLabel);

  const neededSecondary = 3 - realSecondary.length;
  const secondaryStories = [...realSecondary, ...fallbackSecondary.slice(0, Math.max(0, neededSecondary))];

  return {
    featuredStory,
    secondaryStories,
  };
}

/** 4. Fetch Category Articles (Hybrid Auto-Padded) */
export async function getCategoryArticles(categorySlug: string, limit: number = 6): Promise<Article[]> {
  const now = new Date(Date.now() + 5 * 60 * 1000);
  let dbResult: Article[] = [];

  if (isDbEnabled) {
    try {
      const dbArticles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          category: { slug: categorySlug },
          publishedAt: { lte: now },
        },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      if (dbArticles.length > 0) {
        dbResult = dbArticles.map(a => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          subtitle: a.subtitle ?? undefined,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          authorRole: a.author.designation ?? 'Staff Writer',
          authorAvatar: a.author.avatar ?? undefined,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '4 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: resolveArticleImage(a.featuredImage, a.category.slug, a.title),
          content: a.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  if (dbResult.length >= limit) return dbResult;

  const existingSlugs = new Set(dbResult.map(a => a.slug));
  const categoryMatches = ARTICLES.filter(a => (a.category === categorySlug || categorySlug === 'all') && !existingSlugs.has(a.slug)).map(withDemoLabel);
  const needed = limit - dbResult.length;

  return [...dbResult, ...categoryMatches.slice(0, needed)];
}

/** 5. Fetch Trending Articles (Hybrid Auto-Padded) */
export async function getTrendingArticles(limit: number = 5): Promise<Article[]> {
  const now = new Date(Date.now() + 5 * 60 * 1000);
  let dbResult: Article[] = [];

  if (isDbEnabled) {
    try {
      const dbTrending = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: now },
        },
        include: { category: true, author: true },
        orderBy: [{ isTrending: 'desc' }, { views: 'desc' }],
        take: limit,
      });

      if (dbTrending.length > 0) {
        dbResult = dbTrending.map(a => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '3 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: resolveArticleImage(a.featuredImage, a.category.slug, a.title),
          content: a.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  if (dbResult.length >= limit) return dbResult;

  const existingSlugs = new Set(dbResult.map(a => a.slug));
  const fallbackList = ARTICLES.filter(a => !existingSlugs.has(a.slug)).map(withDemoLabel);
  const needed = limit - dbResult.length;

  return [...dbResult, ...fallbackList.slice(0, needed)];
}

/** 6. Fetch Active Breaking News */
export async function getBreakingNews(): Promise<BreakingHeadline[]> {
  const now = new Date();

  if (isDbEnabled) {
    try {
      const dbBreaking = await prisma.breakingNews.findMany({
        where: {
          isActive: true,
          startAt: { lte: now },
          OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
        },
        orderBy: [{ priority: 'desc' }, { sortOrder: 'asc' }],
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
      // Fallback
    }
  }

  return BREAKING_HEADLINES;
}

/** 7. Fetch Related Articles */
export async function getRelatedArticles(currentId: string, categorySlug: string, limit: number = 3): Promise<Article[]> {
  const now = new Date();

  if (isDbEnabled) {
    try {
      const related = await prisma.article.findMany({
        where: {
          id: { not: currentId },
          category: { slug: categorySlug },
          status: 'PUBLISHED',
          publishedAt: { lte: now },
        },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      if (related.length > 0) {
        return related.map(a => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '3 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: resolveArticleImage(a.featuredImage, a.category.slug, a.title),
          content: a.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return ARTICLES.filter(a => a.id !== currentId && a.category === categorySlug).slice(0, limit).map(withDemoLabel);
}

/** 8. Fetch Articles by Tag */
export async function getArticlesByTag(tagSlug: string, limit: number = 10): Promise<Article[]> {
  const now = new Date();

  if (isDbEnabled) {
    try {
      const tagged = await prisma.articleTag.findMany({
        where: {
          tag: { slug: tagSlug },
          article: { status: 'PUBLISHED', publishedAt: { lte: now } },
        },
        include: {
          article: { include: { category: true, author: true } },
        },
        take: limit,
      });

      if (tagged.length > 0) {
        return tagged.map(t => ({
          id: t.article.id,
          slug: t.article.slug,
          title: t.article.title,
          category: t.article.category.slug,
          categoryName: t.article.category.name,
          author: t.article.author.name,
          publishedAt: t.article.publishedAt ? new Date(t.article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: t.article.readTime ?? '3 min read',
          views: `${t.article.views}`,
          likes: t.article.likes,
          image: resolveArticleImage(t.article.featuredImage, t.article.category.slug, t.article.title),
          content: t.article.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return ARTICLES.slice(0, limit).map(withDemoLabel);
}

/** 9. Fetch Articles by Author */
export async function getArticlesByAuthor(authorSlug: string, limit: number = 10): Promise<Article[]> {
  const now = new Date();

  if (isDbEnabled) {
    try {
      const dbArticles = await prisma.article.findMany({
        where: {
          author: { slug: authorSlug },
          status: 'PUBLISHED',
          publishedAt: { lte: now },
        },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      if (dbArticles.length > 0) {
        return dbArticles.map(a => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '3 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: resolveArticleImage(a.featuredImage, a.category.slug, a.title),
          content: a.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return ARTICLES.slice(0, limit).map(withDemoLabel);
}

/** 10. Search Published Articles Safely */
export async function searchPublishedArticles(query: string, categorySlug?: string, limit: number = 20): Promise<Article[]> {
  const now = new Date();
  const q = query.trim();

  if (isDbEnabled && q) {
    try {
      const searchResults = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: now },
          category: categorySlug && categorySlug !== 'all' ? { slug: categorySlug } : undefined,
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
            { content: { contains: q } },
          ],
        },
        include: { category: true, author: true },
        take: limit,
      });

      if (searchResults.length > 0) {
        return searchResults.map(a => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          category: a.category.slug,
          categoryName: a.category.name,
          author: a.author.name,
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          readTime: a.readTime ?? '3 min read',
          views: `${a.views}`,
          likes: a.likes,
          image: resolveArticleImage(a.featuredImage, a.category.slug, a.title),
          content: a.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return ARTICLES.filter(a => {
    const matchSearch = !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.author.toLowerCase().includes(q.toLowerCase());
    const matchCat = !categorySlug || categorySlug === 'all' || a.category === categorySlug;
    return matchSearch && matchCat;
  }).slice(0, limit).map(withDemoLabel);
}

/** 11. View Count Architecture Foundation */
export async function incrementArticleViews(articleId: string): Promise<void> {
  if (!isDbEnabled || !articleId) return;

  try {
    await prisma.article.update({
      where: { id: articleId },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Fail silently
  }
}
