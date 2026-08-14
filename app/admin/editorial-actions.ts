'use server';

// ================================================================
// GenZ Live — Editorial Actions (Server Actions)
// Protected server actions for running fact-checks, overriding warnings,
// and fetching editorial dashboard scorecards.
// ================================================================

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { logAuditAction } from '@/lib/auditLogger';
import { executeEditorialCheck, saveEditorialCheckResult, EditorialCheckReport, EditorialSourceInput } from '@/lib/editorial/orchestrator';

/**
 * Executes an Editorial Check for a specific article and saves results.
 */
export async function runEditorialCheckAction(
  articleId: string,
  sources: EditorialSourceInput[] = []
): Promise<{ success: boolean; report?: EditorialCheckReport; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized access.' };

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { source: true },
    });

    if (!article) return { success: false, error: 'Article not found.' };

    const combinedSources: EditorialSourceInput[] = [...sources];

    // Auto-include attached database source if available
    if (article.source && article.source.name) {
      combinedSources.push({
        name: article.source.name,
        url: article.source.url || undefined,
        content: article.content, // Fallback check against self
      });
    }

    // Run master orchestrator with metadata
    const report = await executeEditorialCheck(
      article.title,
      article.content,
      combinedSources,
      {
        featuredImage: article.featuredImage,
        featuredImageAlt: article.featuredImageAlt,
      }
    );

    // Save report to database
    await saveEditorialCheckResult(articleId, report, user.id);

    // Log audit event
    await logAuditAction({
      userId: user.id,
      action: 'EDITORIAL_CHECK_COMPLETED',
      entityType: 'Article',
      entityId: articleId,
      newData: { status: report.status, overallScore: report.overallScore },
    });

    revalidatePath(`/admin/articles/${articleId}`);
    revalidatePath('/admin/editorial-checks');

    return { success: true, report };
  } catch (error) {
    console.error('[runEditorialCheckAction Error]:', error);
    return { success: false, error: 'Failed to complete editorial check.' };
  }
}

/**
 * Allows authorized ADMIN and EDITOR users to override non-critical editorial check warnings.
 */
export async function overrideEditorialCheckAction(
  articleId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return { success: false, error: 'Permission denied. Only Admins and Editors can override warnings.' };
  }

  if (!reason || reason.trim().length < 10) {
    return { success: false, error: 'A detailed reason (at least 10 characters) is required for overrides.' };
  }

  try {
    await prisma.editorialCheck.update({
      where: { articleId },
      data: {
        status: 'PASSED',
        overrideReason: reason.trim(),
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });

    await logAuditAction({
      userId: user.id,
      action: 'EDITORIAL_OVERRIDE',
      entityType: 'Article',
      entityId: articleId,
      newData: { reason: reason.trim(), reviewedBy: user.name },
    });

    revalidatePath(`/admin/articles/${articleId}`);
    revalidatePath('/admin/editorial-checks');

    return { success: true };
  } catch (error) {
    console.error('[overrideEditorialCheckAction Error]:', error);
    return { success: false, error: 'Failed to record override.' };
  }
}

/**
 * Fetches dashboard statistics and review queues for /admin/editorial-checks.
 */
export async function fetchEditorialDashboardAction() {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const checks = await prisma.editorialCheck.findMany({
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            category: { select: { name: true, slug: true } },
            author: { select: { name: true } },
          },
        },
        claims: true,
        quoteChecks: true,
        sourceMatches: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    const counts = {
      total: checks.length,
      passed: checks.filter(c => c.status === 'PASSED').length,
      reviewRequired: checks.filter(c => c.status === 'REVIEW_REQUIRED').length,
      failed: checks.filter(c => c.status === 'FAILED').length,
      highDependency: checks.filter(c => c.sourceDependencyScore >= 60).length,
      unverifiedQuotes: checks.filter(c => c.quoteScore < 100).length,
    };

    return { checks, counts };
  } catch (error) {
    console.error('[fetchEditorialDashboardAction Error]:', error);
    return null;
  }
}
