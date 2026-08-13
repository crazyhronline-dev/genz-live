// app/robots.ts
// Next.js App Router — generates /robots.txt automatically at build time
// Phase 5: Updated to reference news sitemap and RSS feed

import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const domain = SITE_CONFIG.domain;

  return {
    rules: [
      // Allow all well-behaved search crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/_next/',
          '/preview/',
        ],
      },
      // Allow AI search and discovery crawlers on public routes
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot'],
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/_next/', '/preview/'],
      },
      // Allow Google Image Bot full access
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/admin', '/api/', '/_next/'],
      },
      // Allow Google News Bot full access
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/admin', '/api/', '/_next/'],
      },
    ],
    sitemap: [
      `${domain}/sitemap.xml`,
      `${domain}/news-sitemap.xml`,
    ],
    host: domain,
  };
}
