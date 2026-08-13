'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { logAuditAction } from '@/lib/auditLogger';
import { sanitizeHtml, stripHtml } from '@/lib/sanitizer';
import { validateExternalUrl } from '@/lib/security/ssrfGuard';
import { executeSourceFetch, runAiStoryAnalysis } from '@/lib/aiNewsroomData';
import prisma from '@/lib/prisma';

const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true' || Boolean(process.env.DATABASE_URL);


/** 1. ADD NEW NEWS SOURCE ACTION (Admin Only) */
export async function addSourceAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
    redirect('/admin/login?error=Unauthorized+access.');
  }

  const name = (formData.get('name') as string)?.trim();
  const websiteUrl = (formData.get('websiteUrl') as string)?.trim();
  const feedUrl = (formData.get('feedUrl') as string)?.trim();
  const category = (formData.get('category') as string)?.trim() || 'world';
  const trustLevel = (formData.get('trustLevel') as string)?.trim() || 'MEDIUM';

  if (!name || !feedUrl || !websiteUrl) {
    redirect('/admin/ai-newsroom/sources?error=Please+provide+all+required+fields.');
  }

  // SSRF Protection Check on Feed URL
  const ssrfCheck = await validateExternalUrl(feedUrl);
  if (!ssrfCheck.allowed) {
    redirect(`/admin/ai-newsroom/sources?error=Forbidden+feed+URL:+${encodeURIComponent(ssrfCheck.reason || '')}`);
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (isDbEnabled) {
    try {
      const newSource = await prisma.newsSource.create({
        data: {
          name,
          slug: `${slug}-${Date.now().toString(36)}`,
          websiteUrl,
          feedUrl,
          category,
          trustLevel,
          isActive: true,
        },
      });

      await logAuditAction({
        userId: user.id,
        action: 'SOURCE_CREATED',
        entityType: 'NewsSource',
        entityId: newSource.id,
        newData: { name, feedUrl, category },
      });
    } catch {
      redirect('/admin/ai-newsroom/sources?error=Failed+to+create+source.+Feed+URL+may+already+exist.');
    }
  }

  redirect('/admin/ai-newsroom/sources?success=Source+added+successfully.');
}

/** 2. TOGGLE SOURCE ACTIVE STATUS (Admin Only) */
export async function toggleSourceAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
    redirect('/admin/login?error=Unauthorized+access.');
  }

  const sourceId = (formData.get('sourceId') as string)?.trim();
  const isActive = formData.get('isActive') === 'true';

  if (isDbEnabled && sourceId) {
    try {
      await prisma.newsSource.update({
        where: { id: sourceId },
        data: { isActive },
      });

      await logAuditAction({
        userId: user.id,
        action: 'SOURCE_UPDATED',
        entityType: 'NewsSource',
        entityId: sourceId,
        newData: { isActive },
      });
    } catch {
      // Fail silently
    }
  }

  redirect('/admin/ai-newsroom/sources?success=Source+status+updated.');
}

/** 3. FETCH SOURCE NOW ACTION */
export async function fetchSourceNowAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    redirect('/admin/login?error=Unauthorized+access.');
  }

  const sourceId = (formData.get('sourceId') as string)?.trim();
  if (!sourceId) {
    redirect('/admin/ai-newsroom/sources?error=Missing+source+ID.');
  }

  const result = await executeSourceFetch(sourceId);
  if (result.error) {
    redirect(`/admin/ai-newsroom/sources?error=${encodeURIComponent(result.error)}`);
  }

  redirect(`/admin/ai-newsroom/inbox?success=Ingested+${result.addedCount}+new+stories+(${result.duplicateCount}+duplicates+skipped).`);
}

/** 4. RUN AI STORY ANALYSIS ACTION */
export async function analyzeStoryAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    redirect('/admin/login?error=Unauthorized+access.');
  }

  const storyId = (formData.get('storyId') as string)?.trim();
  if (!storyId) {
    redirect('/admin/ai-newsroom/inbox?error=Missing+story+ID.');
  }

  await runAiStoryAnalysis(storyId);

  await logAuditAction({
    userId: user.id,
    action: 'AI_ANALYSIS_COMPLETED',
    entityType: 'IngestedStory',
    entityId: storyId,
  });

  redirect(`/admin/ai-newsroom/stories/${storyId}?success=AI+story+analysis+completed.`);
}

/** 5. CONVERT AI STORY TO CMS ARTICLE DRAFT */
export async function createCmsDraftFromAiAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR', 'WRITER'])) {
    redirect('/admin/login?error=Unauthorized+access.');
  }

  const storyId = (formData.get('storyId') as string)?.trim();
  const categoryId = (formData.get('categoryId') as string)?.trim();
  const authorId = (formData.get('authorId') as string)?.trim();
  const title = (formData.get('title') as string)?.trim();
  const subtitle = (formData.get('subtitle') as string)?.trim();
  const excerpt = (formData.get('excerpt') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();

  if (!storyId || !title || !content) {
    redirect(`/admin/ai-newsroom/stories/${storyId}?error=Missing+required+article+draft+fields.`);
  }

  // Sanitize content & strip HTML for metadata
  const cleanTitle = stripHtml(title);
  const cleanSubtitle = subtitle ? stripHtml(subtitle) : undefined;
  const cleanExcerpt = excerpt ? stripHtml(excerpt) : cleanTitle;
  const sanitizedContent = sanitizeHtml(content);

  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

  if (isDbEnabled) {
    try {
      // Create Article record in DRAFT status — NEVER PUBLISHED
      const article = await prisma.article.create({
        data: {
          title: cleanTitle,
          slug: uniqueSlug,
          subtitle: cleanSubtitle,
          excerpt: cleanExcerpt,
          content: sanitizedContent,
          status: 'DRAFT', // ABSOLUTE RULE: ALWAYS DRAFT
          categoryId: categoryId || 'world-id',
          authorId: authorId || 'default-author',
          seoTitle: `${cleanTitle} — GenZ Live`,
          seoDescription: cleanExcerpt.slice(0, 155),
        },
      });

      // Record AI draft metadata for provenance
      await prisma.aIDraftMetadata.create({
        data: {
          articleId: article.id,
          ingestedStoryId: storyId,
          provider: 'AI-Assisted Newsroom Pipeline',
          model: 'gpt-4o-mini',
          isAiGenerated: true,
          approvedByUserId: user.id,
        },
      });

      // Update story status to DRAFT_CREATED
      await prisma.ingestedStory.update({
        where: { id: storyId },
        data: { status: 'DRAFT_CREATED', articleId: article.id },
      });

      await logAuditAction({
        userId: user.id,
        action: 'AI_DRAFT_GENERATED',
        entityType: 'Article',
        entityId: article.id,
        newData: { status: 'DRAFT', title: cleanTitle },
      });

      redirect(`/admin/articles/drafts?success=AI+Draft+created+successfully+as+DRAFT.+Verify+facts+before+review.`);
    } catch (err) {
      if ((err as Error).message === 'NEXT_REDIRECT') throw err;
      redirect(`/admin/ai-newsroom/stories/${storyId}?error=Failed+to+save+article+draft.`);
    }
  }

  redirect('/admin/articles/drafts?success=AI+Draft+created+successfully+as+DRAFT.');
}
