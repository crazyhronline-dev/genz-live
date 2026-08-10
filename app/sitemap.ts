import type { MetadataRoute } from 'next';
import { SITE_CONFIG, NAV_CATEGORIES } from '@/config/site';
import { getLatestArticles } from '@/lib/dataAccess';
import { getCategoryHref } from '@/lib/seo';

const domain = SITE_CONFIG.domain;
const NOW = new Date().toISOString();

const CAT_HREF: Record<string, string> = { tech: '/technology' };
const catHref = (id: string) => CAT_HREF[id] ?? `/${id}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: domain,
      lastModified: NOW,
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${domain}/videos`,
      lastModified: NOW,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = NAV_CATEGORIES
    .filter(cat => cat.id !== 'all')
    .map(cat => ({
      url: `${domain}${catHref(cat.id)}`,
      lastModified: NOW,
      changeFrequency: 'always' as const,
      priority: 0.9,
    }));

  const editorialRoutes: MetadataRoute.Sitemap = [
    { url: `${domain}/about`,              priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${domain}/contact`,            priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${domain}/editorial-policy`,   priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${domain}/corrections-policy`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${domain}/privacy-policy`,     priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${domain}/terms`,              priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${domain}/disclaimer`,         priority: 0.4, changeFrequency: 'monthly' as const },
  ].map(r => ({ ...r, lastModified: NOW }));

  // Published articles only — strict security filter applied inside getLatestArticles
  const latestArticles = await getLatestArticles(200);
  const articleRoutes: MetadataRoute.Sitemap = latestArticles
    .filter(a => !a.isDemo) // never index demo/placeholder articles
    .map(a => ({
      url: `${domain}${getCategoryHref(a.category)}/${a.slug ?? a.id}`,
      lastModified: a.updatedAtRaw ?? a.publishedAtRaw ?? NOW,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...editorialRoutes,
    ...articleRoutes,
  ];
}
