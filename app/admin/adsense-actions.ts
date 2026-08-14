'use server';

// ================================================================
// GenZ Live — AdSense Readiness Auditor (Server Actions)
// Protected server actions for auditing, fetching reports, and history.
// ================================================================

import { getCurrentUser, hasPermission } from '@/lib/auth';
import { runAdSenseReadinessAudit, getLatestAdSenseAudit, AdSenseAuditReport } from '@/lib/adsense/auditor';
import { logAuditAction } from '@/lib/auditLogger';
import prisma from '@/lib/prisma';

/**
 * Triggers a full server-side AdSense readiness audit.
 */
export async function runAdSenseAuditAction(): Promise<AdSenseAuditReport | null> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return null;
  }

  await logAuditAction({
    userId: user.id,
    action: 'ADSENSE_AUDIT_STARTED',
    entityType: 'ADSENSE_READINESS',
    newData: { initiatedBy: user.email },
  });

  try {
    const report = await runAdSenseReadinessAudit();

    await logAuditAction({
      userId: user.id,
      action: 'ADSENSE_AUDIT_COMPLETED',
      entityType: 'ADSENSE_READINESS',
      entityId: report.id,
      newData: {
        overallScore: report.overallScore,
        status: report.status,
        criticalBlockers: report.criticalBlockersCount,
        warnings: report.warningsCount,
        durationMs: report.durationMs,
      },
    });

    return report;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during audit execution';
    await logAuditAction({
      userId: user.id,
      action: 'ADSENSE_AUDIT_FAILED',
      entityType: 'ADSENSE_READINESS',
      newData: { error: errorMessage },
    });
    console.error('[runAdSenseAuditAction Error]:', error);
    return null;
  }
}

/**
 * Fetches the latest audit report or executes a fresh audit if none exists.
 */
export async function fetchLatestAdSenseAuditAction(): Promise<AdSenseAuditReport | null> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return null;
  }

  let latest = await getLatestAdSenseAudit();
  if (!latest) {
    latest = await runAdSenseReadinessAudit();
  }

  return latest;
}

/**
 * Fetches historical audit log snapshots.
 */
export async function fetchAdSenseAuditHistoryAction() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
    return [];
  }

  try {
    const history = await prisma.adSenseReadinessAudit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        createdAt: true,
        overallScore: true,
        status: true,
        criticalBlockersCount: true,
        warningsCount: true,
        publishedArticleCount: true,
        durationMs: true,
      },
    });

    return history;
  } catch (error) {
    console.error('[fetchAdSenseAuditHistoryAction Error]:', error);
    return [];
  }
}
