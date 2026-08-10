// app/sitemap.ts
// Next.js App Router — generates /sitemap.xml automatically at build time
// Phase 1: static routes only. Phase 2 will add dynamic article URLs from DB.
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import type { MetadataRoute } from 'next';
import { SITE_CONFIG, NAV_CATEGORIES } from '@/config/site';

const domain = SITE_CONFIG.domain;

// Build timestamp — updated on each deployment
const NOW = new Date().toISOString();

// Category ID → URL slug mapping
const CAT_HREF: Record<string, string> = { tech: '/technology' };
const catHref = (id: string) => CAT_HREF[id] ?? `/${id}`;

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static core routes ──────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: domain,
      lastModified: NOW,
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${domain}/search`,
      lastModified: NOW,
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${domain}/videos`,
      lastModified: NOW,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // ── Category routes ─────────────────────────────────────────
  const categoryRoutes: MetadataRoute.Sitemap = NAV_CATEGORIES
    .filter(cat => cat.id !== 'all')
    .map(cat => ({
      url: `${domain}${catHref(cat.id)}`,
      lastModified: NOW,
      changeFrequency: 'always' as const,
      priority: 0.9,
    }));

  // ── Editorial / legal static pages ──────────────────────────
  const editorialRoutes: MetadataRoute.Sitemap = [
    { url: `${domain}/about`,              priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${domain}/contact`,            priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${domain}/editorial-policy`,   priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${domain}/corrections-policy`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${domain}/privacy-policy`,     priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${domain}/terms`,              priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${domain}/disclaimer`,         priority: 0.4, changeFrequency: 'monthly' as const },
  ].map(r => ({ ...r, lastModified: NOW }));

  // ── Phase 2 placeholder: dynamic article routes will be added here ──
  // Example:
  // const articles = await prisma.article.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, category: { select: { slug: true } }, updatedAt: true } });
  // const articleRoutes = articles.map(a => ({ url: `${domain}/${a.category.slug}/${a.slug}`, lastModified: a.updatedAt, changeFrequency: 'weekly', priority: 0.8 }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...editorialRoutes,
    // ...articleRoutes, // Phase 2
  ];
}
