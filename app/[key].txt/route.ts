// ================================================================
// GenZ Live — IndexNow Key Verification Route
// Route: /[key].txt (e.g. /a1b2c3d4e5f6.txt)
// Verifies IndexNow ownership for Bing, Yandex, Naver, and Seznam.
// ================================================================

import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
): Promise<Response> {
  const { key } = await params;
  const configuredKey = process.env.INDEXNOW_KEY;

  if (!configuredKey || key !== configuredKey) {
    return new Response('Not Found', { status: 404 });
  }

  return new Response(configuredKey, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
