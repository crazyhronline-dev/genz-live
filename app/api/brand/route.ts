import { NextResponse } from 'next/server';
import { getBrandSettings } from '@/lib/brandSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const brand = await getBrandSettings();
    return NextResponse.json(brand, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch {
    return NextResponse.json({
      headerLogoUrl: '/brand/06_Website_Logo_1200x400.png',
      headerLogoHeight: 64,
      headerLogoWidth: 0,
      adminLogoUrl: '/brand/06_Website_Logo_1200x400.png',
      adminLogoHeight: 56,
      adminLogoWidth: 0,
      faviconUrl: '/brand/logo_square.png',
    });
  }
}
