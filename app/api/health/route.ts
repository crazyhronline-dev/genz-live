// ================================================================
// GenZ Live — Safe Production Health Endpoint
// Route: GET /api/health
// Exposes operational status without exposing database secrets or internal paths
// ================================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true';
  let dbStatus = 'disabled';

  if (isDbEnabled) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'healthy';
    } catch {
      dbStatus = 'error';
    }
  }

  return NextResponse.json(
    {
      status: 'ok',
      service: 'GenZ Live Media Engine',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? 'production',
      database: dbStatus,
      aiEngine: process.env.AI_PROVIDER || 'mock',
      version: '1.0.0',
    },
    {
      status: dbStatus === 'error' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
