// GenZ Live — SEO Metadata Utilities

import type { Metadata } from 'next';
import { SITE_CONFIG, BRAND_ASSETS } from '@/config/site';

export function buildPageMetadata(overrides?: Partial<Metadata>): Metadata {
  const base: Metadata = {
    metadataBase: new URL(SITE_CONFIG.domain),
    title: {
      default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline} — Digital News & Media Platform`,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: [
      'GenZ Live', 'The Voice of GenZ', 'Technology News', 'AI News',
      'India News', 'World News', 'Business', 'Markets', 'Trending News', 'GenZ Media',
    ],
    authors: [{ name: 'GenZ Live Media' }],
    creator: 'GenZ Live',
    publisher: 'GenZ Live',
    robots: { index: true, follow: true },
    openGraph: {
      title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
      description: SITE_CONFIG.description,
      url: SITE_CONFIG.domain,
      siteName: SITE_CONFIG.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: BRAND_ASSETS.masterSq,
          width: 1200,
          height: 1200,
          alt: 'GenZ Live',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
      description: SITE_CONFIG.description,
      images: [BRAND_ASSETS.masterSq],
    },
    icons: {
      icon: BRAND_ASSETS.logoSmall,
      apple: BRAND_ASSETS.logoSmall,
    },
  };

  return { ...base, ...overrides };
}
