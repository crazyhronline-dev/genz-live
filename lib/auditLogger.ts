// ================================================================
// GenZ Live — Audit Logging Service
// Immutable record of editorial and system actions for accountability
// ================================================================

import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface AuditLogEntry {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditAction(entry: AuditLogEntry): Promise<void> {
  if (process.env.ENABLE_DB_PRISMA !== 'true') {
    return;
  }

  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        oldData: entry.oldData ? (JSON.parse(JSON.stringify(entry.oldData)) as Prisma.InputJsonValue) : undefined,
        newData: entry.newData ? (JSON.parse(JSON.stringify(entry.newData)) as Prisma.InputJsonValue) : undefined,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
      },
    });
  } catch {
    // Fail silently
  }
}
