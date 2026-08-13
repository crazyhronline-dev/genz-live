// ================================================================
// GenZ Live — IndexNow API Route
// Route: POST /api/indexnow
// Protected endpoint for authenticated admins/editors to submit URLs
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimiter';
import { notifyIndexNow, isValidIndexNowUrl, formatIndexNowUrl } from '@/lib/indexNow';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Authentication Check
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'])) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  // 2. Rate Limiting Check (max 10 submissions per minute per admin)
  const rateLimitKey = `indexnow_api_${user.id}`;
  const rateLimit = checkRateLimit(rateLimitKey);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  }

  // 3. Parse and Validate Request Body
  let body: { urls?: string | string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  if (!body.urls) {
    return NextResponse.json({ error: 'No URLs provided in request.' }, { status: 400 });
  }

  const rawUrls = Array.isArray(body.urls) ? body.urls : [body.urls];

  // 4. SSRF & Canonical Domain Validation
  const validUrls = rawUrls
    .map(formatIndexNowUrl)
    .filter(isValidIndexNowUrl);

  if (validUrls.length === 0) {
    return NextResponse.json(
      { error: 'No valid https://genz-live.com public URLs provided.' },
      { status: 400 }
    );
  }

  // 5. Submit to IndexNow
  const success = await notifyIndexNow(validUrls);

  // 6. Return response without revealing secret key
  return NextResponse.json({
    success,
    submittedCount: validUrls.length,
    message: success
      ? `Successfully submitted ${validUrls.length} URL(s) to IndexNow search engine partners.`
      : 'IndexNow submission completed or skipped (key not configured).',
  });
}
