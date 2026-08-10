import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { buildPageMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/config/site';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = buildPageMetadata();

// JSON-LD structured data — NewsMediaOrganization schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'NewsMediaOrganization',
      '@id': `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.name,
      alternateName: 'GenZ Live Media',
      url: SITE_CONFIG.domain,
      description: SITE_CONFIG.description,
      slogan: SITE_CONFIG.tagline,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/brand/06_Website_Logo_1200x400.png`,
        width: 1200,
        height: 400,
      },
      sameAs: [
        SITE_CONFIG.youtube.url,
        SITE_CONFIG.social.instagram,
        SITE_CONFIG.social.facebook,
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@genz-live.com',
        contactType: 'editorial',
        availableLanguage: ['English', 'Hindi'],
      },
      foundingDate: '2024',
      publishingPrinciples: `${SITE_CONFIG.domain}/editorial-policy`,
      correctionsPolicy: `${SITE_CONFIG.domain}/corrections-policy`,
      ethicsPolicy: `${SITE_CONFIG.domain}/editorial-policy`,
      masthead: `${SITE_CONFIG.domain}/about`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.domain}/#website`,
      url: SITE_CONFIG.domain,
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      publisher: { '@id': `${SITE_CONFIG.domain}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_CONFIG.domain}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'en-US',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* RSS Auto-discovery */}
        <link rel="alternate" type="application/rss+xml" title={`${SITE_CONFIG.name} RSS Feed`} href={`${SITE_CONFIG.domain}/rss.xml`} />
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.youtube.com" />
        <link rel="dns-prefetch" href="//i.ytimg.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Theme color for browsers */}
        <meta name="theme-color" content="#0a0f1e" />
        <meta name="color-scheme" content="dark" />
        {/* Mobile web app */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GenZ Live" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-purple-600 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
