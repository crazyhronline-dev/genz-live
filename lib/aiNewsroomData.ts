// ================================================================
// GenZ Live — AI Newsroom Data Access Engine
// Data queries & persistence for Sources, Ingested Stories, AI Jobs,
// AI Analysis, Duplicate Detection, and Newsroom Metrics.
// ================================================================

import prisma from '@/lib/prisma';
import { fetchAndParseFeed } from '@/lib/ingestion/rssFetcher';
import { calculateTitleSimilarity } from '@/lib/ingestion/deduplicator';
import { getAIProvider, type AIAnalysisResult, type AIDraftResult } from '@/lib/ai/provider';

const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true';

// ----------------------------------------------------------------
// 1. AI NEWSROOM DASHBOARD METRICS
// ----------------------------------------------------------------
export async function getAiNewsroomMetrics() {
  if (isDbEnabled) {
    try {
      const [
        totalSources,
        activeSources,
        incomingStories,
        unprocessedCount,
        analyzedCount,
        draftsCreatedCount,
        reviewCount,
        duplicateCount,
        failedJobsCount,
        recentJobs,
      ] = await Promise.all([
        prisma.newsSource.count(),
        prisma.newsSource.count({ where: { isActive: true } }),
        prisma.ingestedStory.count(),
        prisma.ingestedStory.count({ where: { status: 'NEW' } }),
        prisma.ingestedStory.count({ where: { status: 'ANALYZED' } }),
        prisma.ingestedStory.count({ where: { status: 'DRAFT_CREATED' } }),
        prisma.ingestedStory.count({ where: { status: 'REVIEW' } }),
        prisma.ingestedStory.count({ where: { status: 'DUPLICATE' } }),
        prisma.aIJob.count({ where: { status: 'FAILED' } }),
        prisma.aIJob.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { ingestedStory: true },
        }),
      ]);

      return {
        totalSources,
        activeSources,
        incomingStories,
        unprocessedCount,
        analyzedCount,
        draftsCreatedCount,
        reviewCount,
        duplicateCount,
        failedJobsCount,
        recentJobs: recentJobs.map(j => ({
          id: j.id,
          jobType: j.jobType,
          status: j.status,
          storyTitle: j.ingestedStory?.sourceTitle ?? 'General Task',
          createdAt: j.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        })),
      };
    } catch {
      // Fallback
    }
  }

  return {
    totalSources: 4,
    activeSources: 3,
    incomingStories: 18,
    unprocessedCount: 5,
    analyzedCount: 7,
    draftsCreatedCount: 4,
    reviewCount: 2,
    duplicateCount: 2,
    failedJobsCount: 0,
    recentJobs: [
      { id: 'job-1', jobType: 'ANALYZE_STORY', status: 'COMPLETED', storyTitle: 'Global AI Summit 2026 Directives', createdAt: '10:12 AM' },
      { id: 'job-2', jobType: 'GENERATE_DRAFT', status: 'COMPLETED', storyTitle: 'Quantum Computing Chip Advances', createdAt: '09:40 AM' },
      { id: 'job-3', jobType: 'ANALYZE_STORY', status: 'COMPLETED', storyTitle: 'ISRO Next-Gen Satellite Launch', createdAt: '08:15 AM' },
    ],
  };
}

// ----------------------------------------------------------------
// 2. NEWS SOURCES MANAGEMENT
// ----------------------------------------------------------------
export async function getNewsSources() {
  if (isDbEnabled) {
    try {
      const sources = await prisma.newsSource.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { ingestedStories: true } } },
      });

      return sources.map(s => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description ?? undefined,
        websiteUrl: s.websiteUrl,
        feedUrl: s.feedUrl,
        sourceType: s.sourceType,
        category: s.category ?? 'world',
        trustLevel: s.trustLevel,
        isActive: s.isActive,
        lastFetchedAt: s.lastFetchedAt ? s.lastFetchedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Never',
        lastFetchStatus: s.lastFetchStatus ?? undefined,
        storiesCount: s._count.ingestedStories,
      }));
    } catch {
      // Fallback
    }
  }

  return [
    {
      id: 'src-1',
      name: 'TechCrunch Wire',
      slug: 'techcrunch',
      websiteUrl: 'https://techcrunch.com',
      feedUrl: 'https://techcrunch.com/feed/',
      sourceType: 'RSS',
      category: 'technology',
      trustLevel: 'HIGH',
      isActive: true,
      lastFetchedAt: '10:00 AM',
      lastFetchStatus: 'SUCCESS',
      storiesCount: 12,
    },
    {
      id: 'src-2',
      name: 'Reuters World News',
      slug: 'reuters-world',
      websiteUrl: 'https://reuters.com',
      feedUrl: 'https://www.reutersagency.com/feed/?best-topics=world',
      sourceType: 'RSS',
      category: 'world',
      trustLevel: 'HIGH',
      isActive: true,
      lastFetchedAt: '09:30 AM',
      lastFetchStatus: 'SUCCESS',
      storiesCount: 8,
    },
    {
      id: 'src-3',
      name: 'BBC Tech & Science',
      slug: 'bbc-tech',
      websiteUrl: 'https://bbc.com',
      feedUrl: 'http://feeds.bbci.co.uk/news/technology/rss.xml',
      sourceType: 'RSS',
      category: 'technology',
      trustLevel: 'HIGH',
      isActive: false,
      lastFetchedAt: 'Yesterday',
      lastFetchStatus: 'SUCCESS',
      storiesCount: 4,
    },
  ];
}

// ----------------------------------------------------------------
// 3. MANUAL / CRON RSS FETCH ACTION
// ----------------------------------------------------------------
export async function executeSourceFetch(sourceId: string): Promise<{ addedCount: number; duplicateCount: number; error?: string }> {
  if (!isDbEnabled) {
    return { addedCount: 3, duplicateCount: 1 };
  }

  try {
    const source = await prisma.newsSource.findUnique({ where: { id: sourceId } });
    if (!source || !source.isActive) {
      return { addedCount: 0, duplicateCount: 0, error: 'Source not found or inactive.' };
    }

    const fetchedStories = await fetchAndParseFeed(source.feedUrl);

    let addedCount = 0;
    let duplicateCount = 0;

    for (const item of fetchedStories) {
      // 1. Check exact URL hash duplicate
      const existingUrl = await prisma.ingestedStory.findUnique({
        where: { urlHash: item.urlHash },
      });

      if (existingUrl) {
        duplicateCount++;
        continue;
      }

      // 2. Check title similarity with existing stories from the past 3 days
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const recentStories = await prisma.ingestedStory.findMany({
        where: { createdAt: { gte: threeDaysAgo } },
        select: { id: true, sourceTitle: true },
      });

      let duplicateOfId: string | undefined = undefined;
      for (const recent of recentStories) {
        const score = calculateTitleSimilarity(item.sourceTitle, recent.sourceTitle);
        if (score >= 0.75) { // 75% title similarity threshold
          duplicateOfId = recent.id;
          break;
        }
      }

      await prisma.ingestedStory.create({
        data: {
          sourceId: source.id,
          sourceUrl: item.sourceUrl,
          urlHash: item.urlHash,
          sourceTitle: item.sourceTitle,
          titleHash: item.titleHash,
          sourceDescription: item.sourceDescription,
          sourceAuthor: item.sourceAuthor,
          sourcePublishedAt: item.sourcePublishedAt,
          status: duplicateOfId ? 'DUPLICATE' : 'NEW',
          duplicateOfId,
          categorySuggestion: item.categorySuggestion ?? source.category,
        },
      });

      if (duplicateOfId) duplicateCount++;
      else addedCount++;
    }

    await prisma.newsSource.update({
      where: { id: source.id },
      data: {
        lastFetchedAt: new Date(),
        lastFetchStatus: 'SUCCESS',
        lastFetchError: null,
      },
    });

    return { addedCount, duplicateCount };
  } catch (err) {
    const errorMsg = (err as Error).message;
    await prisma.newsSource.update({
      where: { id: sourceId },
      data: {
        lastFetchedAt: new Date(),
        lastFetchStatus: 'FAILED',
        lastFetchError: errorMsg,
      },
    }).catch(() => {});

    return { addedCount: 0, duplicateCount: 0, error: errorMsg };
  }
}

// ----------------------------------------------------------------
// 4. INGESTED STORIES LISTING & FILTERING
// ----------------------------------------------------------------
export async function getIngestedStories(filter: { status?: string; search?: string; page?: number; limit?: number } = {}) {
  const page = filter.page || 1;
  const limit = filter.limit || 15;
  const skip = (page - 1) * limit;

  if (isDbEnabled) {
    try {
      const where: Record<string, unknown> = {};
      if (filter.status && filter.status !== 'ALL') {
        where.status = filter.status;
      }
      if (filter.search) {
        where.sourceTitle = { contains: filter.search };
      }

      const [stories, total] = await Promise.all([
        prisma.ingestedStory.findMany({
          where,
          include: { source: true, aiAnalysis: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.ingestedStory.count({ where }),
      ]);

      return {
        stories: stories.map(s => ({
          id: s.id,
          sourceName: s.source.name,
          sourceUrl: s.sourceUrl,
          title: s.sourceTitle,
          description: s.sourceDescription ?? undefined,
          author: s.sourceAuthor ?? undefined,
          publishedAt: s.sourcePublishedAt ? s.sourcePublishedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          status: s.status,
          category: s.categorySuggestion ?? 'world',
          hasAnalysis: !!s.aiAnalysis,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch {
      // Fallback
    }
  }

  // Fallback static dataset for demo mode
  const mockStories = [
    { id: 'story-1', sourceName: 'TechCrunch Wire', sourceUrl: 'https://techcrunch.com/article-1', title: 'OpenAI Announces GPT-5 Developer Beta Access', description: 'Next generation artificial intelligence models feature advanced reasoning and multimodal code generation.', publishedAt: '10:15 AM', status: 'NEW', category: 'ai', hasAnalysis: false },
    { id: 'story-2', sourceName: 'Reuters World News', sourceUrl: 'https://reuters.com/article-2', title: 'Global Climate Accord Signed at Geneva Energy Summit', description: 'Representatives from 140 nations reached a landmark agreement to accelerate renewable grid infrastructure.', publishedAt: '09:40 AM', status: 'ANALYZED', category: 'world', hasAnalysis: true },
    { id: 'story-3', sourceName: 'BBC Tech & Science', sourceUrl: 'https://bbc.com/article-3', title: 'ISRO Prepares Launch Vehicle for Chandrayaan-4 Lunar Sample Mission', description: 'Indian space agency completes final static fire test ahead of upcoming lunar sample return mission.', publishedAt: '08:20 AM', status: 'DRAFT_CREATED', category: 'india', hasAnalysis: true },
  ];

  return {
    stories: mockStories,
    total: mockStories.length,
    page: 1,
    totalPages: 1,
  };
}

// ----------------------------------------------------------------
// 5. SINGLE INGESTED STORY & AI ANALYSIS DETAILS
// ----------------------------------------------------------------
export async function getIngestedStoryDetail(storyId: string) {
  if (isDbEnabled) {
    try {
      const story = await prisma.ingestedStory.findUnique({
        where: { id: storyId },
        include: { source: true, aiAnalysis: true, article: true },
      });

      if (story) {
        return {
          id: story.id,
          sourceName: story.source.name,
          sourceUrl: story.sourceUrl,
          title: story.sourceTitle,
          description: story.sourceDescription ?? '',
          author: story.sourceAuthor ?? undefined,
          publishedAt: story.sourcePublishedAt ? story.sourcePublishedAt.toLocaleString() : 'Recently',
          status: story.status,
          category: story.categorySuggestion ?? 'world',
          analysis: story.aiAnalysis ? {
            summary: story.aiAnalysis.summary,
            keyFacts: story.aiAnalysis.keyFacts as string[],
            entities: story.aiAnalysis.entities as AIAnalysisResult['entities'],
            claims: story.aiAnalysis.claims as AIAnalysisResult['claims'],
            suggestedHeadline: story.aiAnalysis.suggestedHeadline,
            suggestedHeadlines: story.aiAnalysis.suggestedHeadlines as string[],
            suggestedCategory: story.aiAnalysis.suggestedCategory,
            suggestedTags: story.aiAnalysis.suggestedTags as string[],
            riskFlags: story.aiAnalysis.riskFlags as string[],
          } : null,
          createdArticleId: story.articleId ?? undefined,
        };
      }
    } catch {
      // Fallback
    }
  }

  return {
    id: storyId,
    sourceName: 'TechCrunch Wire',
    sourceUrl: 'https://techcrunch.com/article-demo',
    title: 'OpenAI Announces Next-Generation Developer Beta Access',
    description: 'Next generation artificial intelligence models feature advanced reasoning, coding capabilities, and reduced hallucinations for enterprise deployments.',
    author: 'Staff Tech Reporter',
    publishedAt: 'Today at 10:15 AM',
    status: 'NEW',
    category: 'ai',
    analysis: null,
    createdArticleId: undefined,
  };
}

// ----------------------------------------------------------------
// 6. TRIGGER AI STORY ANALYSIS ACTION
// ----------------------------------------------------------------
export async function runAiStoryAnalysis(storyId: string): Promise<AIAnalysisResult> {
  const story = await getIngestedStoryDetail(storyId);
  const ai = getAIProvider();

  // Create job record if DB enabled
  let jobId: string | null = null;
  if (isDbEnabled) {
    try {
      const job = await prisma.aIJob.create({
        data: {
          jobType: 'ANALYZE_STORY',
          status: 'PROCESSING',
          ingestedStoryId: storyId,
          provider: ai.name,
          startedAt: new Date(),
        },
      });
      jobId = job.id;
    } catch {
      // Fail silently
    }
  }

  const analysis = await ai.analyzeStory(story.title, story.description);

  if (isDbEnabled) {
    try {
      await prisma.aIAnalysis.upsert({
        where: { ingestedStoryId: storyId },
        create: {
          ingestedStoryId: storyId,
          summary: analysis.summary,
          keyFacts: analysis.keyFacts,
          entities: analysis.entities,
          claims: analysis.claims,
          suggestedHeadline: analysis.suggestedHeadline,
          suggestedHeadlines: analysis.suggestedHeadlines,
          suggestedCategory: analysis.suggestedCategory,
          suggestedTags: analysis.suggestedTags,
          riskFlags: analysis.riskFlags,
        },
        update: {
          summary: analysis.summary,
          keyFacts: analysis.keyFacts,
          entities: analysis.entities,
          claims: analysis.claims,
          suggestedHeadline: analysis.suggestedHeadline,
          suggestedHeadlines: analysis.suggestedHeadlines,
          suggestedCategory: analysis.suggestedCategory,
          suggestedTags: analysis.suggestedTags,
          riskFlags: analysis.riskFlags,
        },
      });

      await prisma.ingestedStory.update({
        where: { id: storyId },
        data: { status: 'ANALYZED' },
      });

      if (jobId) {
        await prisma.aIJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });
      }
    } catch {
      // Fail silently
    }
  }

  return analysis;
}

// ----------------------------------------------------------------
// 7. TRIGGER AI ARTICLE DRAFT GENERATION ACTION
// ----------------------------------------------------------------
export async function runAiDraftGeneration(storyId: string, options: { category?: string } = {}): Promise<AIDraftResult> {
  const story = await getIngestedStoryDetail(storyId);
  const ai = getAIProvider();

  let jobId: string | null = null;
  if (isDbEnabled) {
    try {
      const job = await prisma.aIJob.create({
        data: {
          jobType: 'GENERATE_DRAFT',
          status: 'PROCESSING',
          ingestedStoryId: storyId,
          provider: ai.name,
          startedAt: new Date(),
        },
      });
      jobId = job.id;
    } catch {
      // Fail silently
    }
  }

  const draft = await ai.generateDraft(story.title, story.description, options.category ?? story.category);

  if (isDbEnabled && jobId) {
    try {
      await prisma.aIJob.update({
        where: { id: jobId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    } catch {
      // Fail silently
    }
  }

  return draft;
}
