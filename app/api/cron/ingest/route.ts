// ================================================================
// GenZ Live — Production Scheduled Ingestion Cron Endpoint
// Route: GET /api/cron/ingest
// Safe execution for Hostinger cron jobs or external scheduled triggers.
// Protected by CRON_SECRET token. NEVER automatically publishes articles.
// ================================================================

import { NextResponse } from 'next/server';
import { getNewsSources, executeSourceFetch } from '@/lib/aiNewsroomData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
  const querySecret = searchParams.get('secret');

  const configuredSecret = process.env.CRON_SECRET;

  // Secret Authorization Check
  if (configuredSecret) {
    const isAuthorized = authHeader === configuredSecret || querySecret === configuredSecret;
    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized cron request.' }, { status: 401 });
    }
  }

  try {
    const sources = await getNewsSources();
    const activeSources = sources.filter(s => s.isActive);

    const results = [];
    let totalAdded = 0;
    let totalDuplicates = 0;

    for (const source of activeSources) {
      const fetchResult = await executeSourceFetch(source.id);
      totalAdded += fetchResult.addedCount;
      totalDuplicates += fetchResult.duplicateCount;

      results.push({
        sourceId: source.id,
        sourceName: source.name,
        addedCount: fetchResult.addedCount,
        duplicateCount: fetchResult.duplicateCount,
        error: fetchResult.error,
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      activeSourcesCount: activeSources.length,
      totalAdded,
      totalDuplicates,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: (err as Error).message || 'Cron execution failed',
      },
      { status: 500 }
    );
  }
}
