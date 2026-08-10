// ================================================================
// GenZ Live — Production News & Article Data Access Engine
// Enforces strict public security filters: only PUBLISHED articles
// with publishedAt <= NOW() are accessible via public APIs and views.
// ================================================================

import prisma from '@/lib/prisma';
import type { Article, BreakingHeadline } from '@/types';
import { ARTICLES, FEATURED_STORIES, BREAKING_HEADLINES } from '@/lib/newsData';

const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true';

/** Helper: Label fallback data cleanly as [DEMO CONTENT] */
function withDemoLabel(article: Article): Article {
  return {
    ...article,
    isDemo: true,
    title: article.title.startsWith('[DEMO CONTENT]') ? article.title : `[DEMO CONTENT] ${article.title}`,
  };
}

/** 1. Fetch Single Published Article by Category and Slug */
export async function getPublishedArticle(categorySlug: string, articleSlug: string): Promise<Article | null> {
  const now = new Date();

  if (isDbEnabled) {
    try {
      const article = await prisma.article.findFirst({
        where: {
          slug: articleSlug,
          category: { slug: categorySlug },
          status: 'PUBLISHED',
          publishedAt: { lte: now },
        },
        include: {
          category: true,
          author: true,
          source: true,
          tags: { include: { tag: true } },
        },
      });

      if (article) {
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
          image: article.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
          isFeatured: article.isFeatured,
          seoTitle: article.seoTitle ?? article.metaTitle ?? article.title,
          seoDescription: article.seoDescription ?? article.metaDescription ?? article.excerpt ?? undefined,
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
  const now = new Date();

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
        return dbArticles.map(a => ({
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
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          content: a.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return ARTICLES.slice(0, limit).map(withDemoLabel);
}

/** 3. Fetch Featured Hero Articles */
export async function getFeaturedArticles(): Promise<{ featuredStory: Article; secondaryStories: Article[] }> {
  const now = new Date();

  if (isDbEnabled) {
    try {
      const dbFeatured = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          isFeatured: true,
          publishedAt: { lte: now },
        },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
        take: 4,
      });

      if (dbFeatured.length > 0) {
        const mapped: Article[] = dbFeatured.map(a => ({
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
      // Fallback
    }
  }

  return {
    featuredStory: withDemoLabel(FEATURED_STORIES[0]),
    secondaryStories: FEATURED_STORIES.slice(1).map(withDemoLabel),
  };
}

/** 4. Fetch Category Articles */
export async function getCategoryArticles(categorySlug: string, limit: number = 6): Promise<Article[]> {
  const now = new Date();

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
        return dbArticles.map(a => ({
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
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          content: a.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  const matches = ARTICLES.filter(a => a.category === categorySlug || categorySlug === 'all');
  return matches.slice(0, limit).map(withDemoLabel);
}

/** 5. Fetch Trending Articles */
export async function getTrendingArticles(limit: number = 5): Promise<Article[]> {
  const now = new Date();

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
        return dbTrending.map(a => ({
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
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          content: a.content,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return ARTICLES.slice(0, limit).map(withDemoLabel);
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
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
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
          image: t.article.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
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
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
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
          image: a.featuredImage ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
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
