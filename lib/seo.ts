// ================================================================
// GenZ Live — SEO Metadata Library (Phase 5: Advanced SEO)
// Single source of truth for all page metadata, OG, Twitter/X cards
// ================================================================

import type { Metadata } from 'next';
import { SITE_CONFIG, NAV_CATEGORIES } from '@/config/site';
import { stripHtml } from '@/lib/sanitizer';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------
const DOMAIN = SITE_CONFIG.domain;
const SITE_NAME = SITE_CONFIG.name;
const TAGLINE = SITE_CONFIG.tagline;
const DESCRIPTION = SITE_CONFIG.description;

// OG image: absolute URL to the new square brand logo
const OG_IMAGE_URL = `${DOMAIN}/brand/logo_square.png`;
const OG_IMAGE_WIDE_URL = `${DOMAIN}/brand/logo_square.png`;

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
  const googleVerify = process.env.NEXT_PUBLIC_GOOGLE_VERIFY;

  return {
    metadataBase: new URL(DOMAIN),

    title: {
      default: `${SITE_NAME} — ${TAGLINE}`,
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
        { url: '/favicon.png', type: 'image/png', sizes: '800x800' },
        { url: '/brand/logo_square.png', type: 'image/png' },
      ],
      apple: '/brand/logo_square.png',
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
      title: `${SITE_NAME} — ${TAGLINE}`,
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
      title: `${SITE_NAME} — ${TAGLINE}`,
      description: DESCRIPTION,
      images: [OG_IMAGE_URL],
    },

    // Verification tags (only output if environment variable exists & non-empty)
    ...(googleVerify ? { verification: { google: googleVerify } } : {}),

    // Alternate / canonical (homepage default)
    alternates: {
      canonical: DOMAIN,
      types: {
        'application/rss+xml': `${DOMAIN}/rss.xml`,
      },
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
  const cleanDescription = stripHtml(description);
  const canonical = canonicalPath !== undefined ? `${DOMAIN}${canonicalPath}` : undefined;
  const mergedKeywords = [...SITE_KEYWORDS, ...keywords];

  const og: Metadata['openGraph'] = {
    ...(base.openGraph as object),
    type: ogType,
    ...(title && { title: `${title} | ${SITE_NAME}` }),
    description: cleanDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title ?? SITE_NAME,
        type: ogImage.endsWith('.png') ? 'image/png' : 'image/jpeg',
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
    description: cleanDescription,
    images: [ogImage],
  };

  const robots: Metadata['robots'] = noIndex
    ? { index: false, follow: true } // noindex but allow following links
    : base.robots;

  return {
    ...base,
    ...(fullTitle && { title: fullTitle }),
    description: cleanDescription,
    keywords: mergedKeywords,
    robots,
    openGraph: og,
    twitter,
    ...(canonical !== undefined && {
      alternates: {
        canonical,
        types: {
          'application/rss+xml': `${DOMAIN}/rss.xml`,
        },
      },
    }),
  };
}

// ----------------------------------------------------------------
// buildCategoryMetadata — unique SEO metadata per category
// ----------------------------------------------------------------
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  world:         'Global news coverage from every continent — wars, diplomacy, climate, politics, and international affairs reported live for GenZ.',
  india:         'Breaking India news — politics, society, economy, regional stories, and culture across every state, reported in real time.',
  technology:    'Tech news, gadget launches, startup funding, cybersecurity, open source, and digital innovation covered daily for digital natives.',
  tech:          'Tech news, gadget launches, startup funding, cybersecurity, open source, and digital innovation covered daily for digital natives.',
  ai:            'Artificial intelligence breakthroughs, LLMs, generative AI, robotics, and machine learning news — the future, reported today.',
  business:      'Business news, corporate strategy, startups, entrepreneurship, mergers, and economic policy coverage for the next generation.',
  markets:       'Stock market, crypto, commodities, indices, and financial market analysis explained clearly for younger investors.',
  entertainment: 'Movies, OTT, music, celebrity culture, gaming, memes, and pop culture stories that define GenZ entertainment.',
  sports:        'Cricket, football, Olympics, eSports, and every sport that GenZ cares about — live scores, analysis, and athlete stories.',
  culture:       'GenZ culture — fashion, art, identity, social media trends, lifestyle, and the ideas shaping a generation.',
  trending:      'What GenZ is talking about right now — viral stories, social media trends, and the most-shared news of the day.',
};

export function buildCategoryMetadata(categoryId: string): Metadata {
  const cat = NAV_CATEGORIES.find(c => c.id === categoryId);
  const name = cat?.name.replace(/^[\p{Emoji}\s]+/u, '').trim() ?? categoryId;
  const href = getCategoryHref(categoryId);
  const desc = CATEGORY_DESCRIPTIONS[categoryId]
    ?? `Latest ${name} news, breaking stories and live updates — ${SITE_NAME}. Stay informed with real-time ${name} coverage.`;

  return buildPageMetadata({
    title: `${name} News — Latest Headlines & Breaking Stories`,
    description: desc,
    keywords: [name, `${name} news`, `${name} updates`, 'Breaking news', `Latest ${name}`],
    canonicalPath: href,
    ogType: 'website',
  });
}

// ----------------------------------------------------------------
// buildArticleMetadata — for individual article pages
// ----------------------------------------------------------------
export function buildArticleMetadata(opts?: {
  title?: string;
  description?: string;
  category?: string;
  catSlug?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  image?: string;
  slug?: string;
}): Metadata {
  if (!opts || !opts.title) {
    return buildPageMetadata({
      title: 'Article Not Found',
      description: 'The requested news article could not be found on GenZ Live.',
      noIndex: true,
    });
  }

  const catSlug = opts.catSlug ?? opts.category?.toLowerCase().replace(/\s+/g, '-') ?? 'news';

  return buildPageMetadata({
    title: opts.title,
    description: opts.description ?? DESCRIPTION,
    keywords: opts.keywords ?? [],
    ogImage: opts.image ?? OG_IMAGE_URL,
    ogType: 'article',
    canonicalPath: opts.slug ? `/${catSlug}/${opts.slug}` : undefined,
    article: {
      publishedTime: opts.publishedTime,
      modifiedTime: opts.modifiedTime,
      authors: opts.author ? [opts.author] : [SITE_NAME],
      section: opts.category,
      tags: opts.keywords,
    },
  });
}

// ----------------------------------------------------------------
// buildAuthorMetadata — for author profile pages
// ----------------------------------------------------------------
export function buildAuthorMetadata(opts: {
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  articleCount?: number;
}): Metadata {
  const shouldIndex = (opts.articleCount ?? 0) > 0;

  return buildPageMetadata({
    title: `${opts.name} — Editorial Author`,
    description: opts.bio
      ? `${opts.bio.slice(0, 150)}...`
      : `Published articles, news reports, and analysis by ${opts.name} on ${SITE_NAME}. ${opts.articleCount ? `${opts.articleCount} published stories.` : ''}`,
    ogImage: opts.avatar ?? OG_IMAGE_URL,
    canonicalPath: `/authors/${opts.slug}`,
    noIndex: !shouldIndex,
  });
}

// ----------------------------------------------------------------
// buildTagMetadata — for topic tag pages (with noindex control)
// ----------------------------------------------------------------
export function buildTagMetadata(opts: {
  name: string;
  slug: string;
  articleCount: number;
}): Metadata {
  // Noindex tags with fewer than 3 articles to avoid thin-content indexation
  const shouldIndex = opts.articleCount >= 3;

  return buildPageMetadata({
    title: `#${opts.name} — Topic Tag`,
    description: `${opts.articleCount} published ${SITE_NAME} news articles, analysis and stories tagged with #${opts.name}.`,
    canonicalPath: `/tags/${opts.slug}`,
    noIndex: !shouldIndex,
  });
}
