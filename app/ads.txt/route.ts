import { NextResponse } from 'next/server';

// ================================================================
// GenZ Live — Dynamic ads.txt Route (/ads.txt)
// Serves Google AdSense ads.txt authorization record dynamically.
// ================================================================

export async function GET() {
  const publisherId = process.env.ADSENSE_PUBLISHER_ID;

  let content = '# GenZ Live AdSense Authorized Digital Sellers (ads.txt)\n';

  if (publisherId && publisherId.startsWith('pub-')) {
    content += `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;
  } else {
    content += '# AdSense Publisher ID not yet configured. Provide ADSENSE_PUBLISHER_ID in .env file.\n';
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
