// ================================================================
// GenZ Live — SEO Metadata Library
// Single source of truth for all page metadata, OG, Twitter/X cards
// ================================================================

import type { Metadata } from 'next';
import { SITE_CONFIG, NAV_CATEGORIES } from '@/config/site';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------
const DOMAIN = SITE_CONFIG.domain;
const SITE_NAME = SITE_CONFIG.name;
const TAGLINE = SITE_CONFIG.tagline;
const DESCRIPTION = SITE_CONFIG.description;

// OG image: absolute URL to the master square brand asset
const OG_IMAGE_URL = `${DOMAIN}/brand/MASTER_SQUARE_2000x2000.png`;
const OG_IMAGE_WIDE_URL = `${DOMAIN}/brand/06_Website_Logo_1200x400.png`;

// ----------------------------------------------------------------
// Global site keywords
// ----------------------------------------------------------------
export const SITE_KEYWORDS = [
  'GenZ Live',
  'The Voice of GenZ',
  'GenZ News',
  'GenZ Media',
  'Digital News Platform',
  'India News',
  'World News',
  'Technology News',
  'AI News',
  'Business News',
  'Markets News',
  'Entertainment News',
  'Sports News',
  'Culture News',
  'Trending News',
  'Breaking News',
  'Live News India',
  'Youth Media',
  'Next Generation News',
];

// ----------------------------------------------------------------
// Category-to-URL mapping (slug → route URL)
// ----------------------------------------------------------------
const CAT_HREF: Record<string, string> = {
  tech: '/technology',
};
export function getCategoryHref(id: string): string {
  return CAT_HREF[id] ?? `/${id}`;
}

// ----------------------------------------------------------------
// Base metadata shared by all pages
// ----------------------------------------------------------------
function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(DOMAIN),

    title: {
      default: `${SITE_NAME} | ${TAGLINE} — Global Digital News & Media`,
      template: `%s | ${SITE_NAME}`,
    },

    description: DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: [{ name: SITE_NAME, url: DOMAIN }],
    creator: SITE_NAME,
    publisher: SITE_NAME,

    // Favicon / app icons
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/brand/08_Website_Logo_300x100.png', type: 'image/png' },
      ],
      apple: '/brand/01_YouTube_Profile_800x800.png',
      shortcut: '/favicon.ico',
    },

    // Crawler directives (default: index + follow)
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url: DOMAIN,
      title: `${SITE_NAME} | ${TAGLINE}`,
      description: DESCRIPTION,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 2000,
          height: 2000,
          alt: `${SITE_NAME} — ${TAGLINE}`,
          type: 'image/png',
        },
        {
          url: OG_IMAGE_WIDE_URL,
          width: 1200,
          height: 400,
          alt: `${SITE_NAME} Logo`,
          type: 'image/png',
        },
      ],
    },

    // Twitter / X Card
    twitter: {
      card: 'summary_large_image',
      site: '@genzliveofficial',
      creator: '@genzliveofficial',
      title: `${SITE_NAME} | ${TAGLINE}`,
      description: DESCRIPTION,
      images: [OG_IMAGE_URL],
    },

    // Verification tags (fill in when domain is verified)
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFY ?? '',
    },

    // Alternate / canonical
    alternates: {
      canonical: DOMAIN,
    },

    // App metadata
    applicationName: SITE_NAME,
    referrer: 'origin-when-cross-origin',
    category: 'news',
  };
}

// ----------------------------------------------------------------
// buildPageMetadata — used by every page's metadata export
// ----------------------------------------------------------------
interface PageMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalPath?: string;
  noIndex?: boolean;

  // Article-specific
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
  };
}

export function buildPageMetadata(opts: PageMetadataOptions = {}): Metadata {
  const base = baseMetadata();

  const {
    title,
    description = DESCRIPTION,
    keywords = [],
    ogImage = OG_IMAGE_URL,
    ogType = 'website',
    canonicalPath,
    noIndex = false,
    article,
  } = opts;

  const fullTitle = title ?? undefined;
  const canonical = canonicalPath ? `${DOMAIN}${canonicalPath}` : undefined;
  const mergedKeywords = [...SITE_KEYWORDS, ...keywords];

  const og: Metadata['openGraph'] = {
    ...(base.openGraph as object),
    type: ogType,
    ...(title && { title: `${title} | ${SITE_NAME}` }),
    description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title ?? SITE_NAME,
        type: 'image/png',
      },
    ],
    ...(canonical && { url: canonical }),
    ...(ogType === 'article' && article
      ? {
          type: 'article',
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: article.authors,
          section: article.section,
          tags: article.tags,
        }
      : {}),
  };

  const twitter: Metadata['twitter'] = {
    ...(base.twitter as object),
    ...(title && { title: `${title} | ${SITE_NAME}` }),
    description,
    images: [ogImage],
  };

  const robots: Metadata['robots'] = noIndex
    ? { index: false, follow: false }
    : base.robots;

  return {
    ...base,
    ...(fullTitle && { title: fullTitle }),
    description,
    keywords: mergedKeywords,
    robots,
    openGraph: og,
    twitter,
    ...(canonical && { alternates: { canonical } }),
  };
}

// ----------------------------------------------------------------
// buildCategoryMetadata — for category pages
// ----------------------------------------------------------------
export function buildCategoryMetadata(categoryId: string): Metadata {
  const cat = NAV_CATEGORIES.find(c => c.id === categoryId);
  const name = cat?.name.replace(/^[\p{Emoji}\s]+/u, '').trim() ?? categoryId;
  const href = getCategoryHref(categoryId);

  return buildPageMetadata({
    title: `${name} News`,
    description: `Latest ${name} news, breaking stories and live updates — ${SITE_NAME}. Stay informed with real-time ${name} coverage.`,
    keywords: [name, `${name} news`, `${name} updates`, 'Breaking news'],
    canonicalPath: href,
    ogType: 'website',
  });
}

// ----------------------------------------------------------------
// buildArticleMetadata — for individual article pages (Phase 2)
// ----------------------------------------------------------------
export function buildArticleMetadata(opts: {
  title: string;
  excerpt: string;
  featuredImage?: string;
  categorySlug?: string;
  authorName?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  slug: string;
  categoryRoute?: string;
}): Metadata {
  const canonicalPath = opts.categoryRoute
    ? `/${opts.categoryRoute}/${opts.slug}`
    : `/article/${opts.slug}`;

  return buildPageMetadata({
    title: opts.title,
    description: opts.excerpt,
    ogImage: opts.featuredImage ?? OG_IMAGE_URL,
    ogType: 'article',
    canonicalPath,
    keywords: [...(opts.tags ?? []), opts.categorySlug ?? '', opts.authorName ?? ''].filter(Boolean),
    article: {
      publishedTime: opts.publishedAt,
      modifiedTime: opts.updatedAt,
      authors: opts.authorName ? [opts.authorName] : [SITE_NAME],
      section: opts.categorySlug,
      tags: opts.tags,
    },
  });
}
