import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to GenZ Live newsletter!',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
