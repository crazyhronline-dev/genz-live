// ================================================================
// GenZ Live — Phase 5: News Sitemap (Google News format)
// Route: /news-sitemap.xml
// Only includes recently published articles (within 2 days per Google guidelines)
// ================================================================

import { SITE_CONFIG } from '@/config/site';
import { getLatestArticles } from '@/lib/dataAccess';
import { stripHtml } from '@/lib/sanitizer';
import { getCategoryHref } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(): Promise<Response> {
  const domain = SITE_CONFIG.domain;
  const now = new Date();
  // Google News sitemap: articles published in the past 2 days
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const articles = await getLatestArticles(100);

  // Filter to articles published within the last 2 days
  const recentArticles = articles.filter(a => {
    if (!a.publishedAtRaw) return true;
    const d = new Date(a.publishedAtRaw);
    return d >= twoDaysAgo && d <= now;
  });

  const items = recentArticles.map(a => {
    const titleClean = stripHtml(a.title).replace(/]]>/g, ']]&gt;');
    const pubDateIso = a.publishedAtRaw ? new Date(a.publishedAtRaw).toISOString() : now.toISOString();
    const catPath = getCategoryHref(a.category);

    return `
  <url>
    <loc>${domain}${catPath}/${a.slug ?? a.id}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_CONFIG.name}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDateIso}</news:publication_date>
      <news:title><![CDATA[${titleClean}]]></news:title>
    </news:news>
  </url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes
    },
  });
}
