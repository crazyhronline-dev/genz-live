import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/growth/newsletterEngine';

// ================================================================
// GenZ Live — Newsletter API Route (/api/newsletter)
// Receives reader email subscriptions safely.
// ================================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source } = body;

    const result = await subscribeToNewsletter(email, source || 'website-footer');
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request payload.' }, { status: 400 });
  }
}
