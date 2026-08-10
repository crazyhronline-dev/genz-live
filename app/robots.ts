// app/robots.ts
// Next.js App Router — generates /robots.txt automatically at build time
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const domain = SITE_CONFIG.domain;

  return {
    rules: [
      // Allow all well-behaved crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',          // Admin dashboard (Phase 2)
          '/api/',            // API routes not meant for crawlers
          '/_next/',          // Next.js internals
          '/dashboard/',      // Future publisher dashboard
          '/preview/',        // Draft article previews
          '*.json',           // JSON data files
        ],
      },
      // Block AI training scrapers
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
      // Allow Google Image Bot full access
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      // Allow Google News Bot full access
      {
        userAgent: 'Googlebot-News',
        allow: '/',
      },
    ],
    sitemap: `${domain}/sitemap.xml`,
    host: domain,
  };
}
