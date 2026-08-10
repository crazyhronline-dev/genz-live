// app/manifest.ts
// Next.js App Router — generates /manifest.webmanifest for PWA support
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest

import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: 'GenZ Live',
    description: SITE_CONFIG.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1e',
    theme_color: '#0a0f1e',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['news', 'entertainment', 'lifestyle'],
    icons: [
      {
        src: '/brand/08_Website_Logo_300x100.png',
        sizes: '300x100',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/brand/01_YouTube_Profile_800x800.png',
        sizes: '800x800',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/brand/MASTER_SQUARE_2000x2000.png',
        sizes: '2000x2000',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [],
    related_applications: [
      {
        platform: 'web',
        url: SITE_CONFIG.domain,
      },
    ],
    prefer_related_applications: false,
  };
}
