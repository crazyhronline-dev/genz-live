// ================================================================
// GenZ Live — Phase 5: RSS Feed
// Route: /rss.xml
// RSS 2.0 feed of recently published articles
// ================================================================

import { SITE_CONFIG } from '@/config/site';
import { getLatestArticles } from '@/lib/dataAccess';
import { stripHtml } from '@/lib/sanitizer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const domain = SITE_CONFIG.domain;
  const now = new Date().toUTCString();

  const articles = await getLatestArticles(50);

  const items = articles.map(a => {
    const url = `${domain}/${a.category}/${a.slug ?? a.id}`;
    const pubDate = a.publishedAtRaw
      ? new Date(a.publishedAtRaw).toUTCString()
      : now;
    const cleanExcerpt = stripHtml(a.excerpt ?? a.subtitle ?? '');
    const description = escapeXml(cleanExcerpt);
    const title = escapeXml(stripHtml(a.title));

    return `
  <item>
    <title>${title}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${description}</description>
    <pubDate>${pubDate}</pubDate>
    <author>editorial@genz-live.com (${escapeXml(stripHtml(a.author))})</author>
    <category>${escapeXml(stripHtml(a.categoryName))}</category>
    <source url="${domain}">${escapeXml(SITE_CONFIG.name)}</source>
  </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${domain}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <ttl>10</ttl>
    <image>
      <url>${domain}/brand/06_Website_Logo_1200x400.png</url>
      <title>${escapeXml(SITE_CONFIG.name)}</title>
      <link>${domain}</link>
    </image>
    <atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>editorial@genz-live.com (${escapeXml(SITE_CONFIG.name)})</managingEditor>
    <webMaster>tech@genz-live.com (${escapeXml(SITE_CONFIG.name)})</webMaster>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(SITE_CONFIG.name)}. All rights reserved.</copyright>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600', // 10 minutes
    },
  });
}
