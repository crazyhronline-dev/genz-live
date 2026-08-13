import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Eye, Share2, Tag as TagIcon, ExternalLink, User } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleCard from '@/components/news/ArticleCard';
import AdSlot from '@/components/ui/AdSlot';
import InArticleContent from '@/components/news/InArticleContent';
import { buildArticleMetadata } from '@/lib/seo';
import { SITE_CONFIG, NAV_CATEGORIES } from '@/config/site';
import { getPublishedArticle, getRelatedArticles, incrementArticleViews } from '@/lib/dataAccess';

export const revalidate = 60; // Instant <15ms CDN caching with 60s background revalidation

interface Params {
  params: Promise<{ category: string; 'article-slug': string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, 'article-slug': articleSlug } = await params;
  const article = await getPublishedArticle(category, articleSlug);

  if (!article) return buildArticleMetadata();

  return buildArticleMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.subtitle ?? article.excerpt,
    category: article.categoryName,
    keywords: article.keywords,
    publishedTime: article.publishedAtRaw ?? article.publishedAt,
    modifiedTime: article.updatedAtRaw,
    author: article.author,
    image: article.image,
    slug: article.slug ?? articleSlug,
    catSlug: category,
  });
}

export default async function ArticleSlugPage({ params }: Params) {
  const { category, 'article-slug': articleSlug } = await params;
  const article = await getPublishedArticle(category, articleSlug);

  if (!article) {
    notFound();
  }

  // Increment view count in background
  if (article.id && !article.isDemo) {
    incrementArticleViews(article.id);
  }

  const relatedArticles = await getRelatedArticles(article.id, category, 3);
  const catMeta = NAV_CATEGORIES.find(c => c.id === category);
  const canonicalUrl = `${SITE_CONFIG.domain}/${category}/${article.slug ?? articleSlug}`;
  const authorSlug = article.author.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // JSON-LD NewsArticle Structured Data
  const newsArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: article.title,
    description: article.subtitle ?? article.excerpt ?? '',
    image: {
      '@type': 'ImageObject',
      url: article.image,
      width: 1200,
      height: 630,
    },
    datePublished: article.publishedAtRaw ?? article.publishedAt,
    dateModified: article.updatedAtRaw ?? article.publishedAtRaw ?? article.publishedAt,
    articleSection: article.categoryName,
    keywords: article.keywords?.join(', '),
    author: {
      '@type': 'Person',
      name: article.author,
      url: `${SITE_CONFIG.domain}/authors/${authorSlug}`,
      jobTitle: article.authorRole,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      '@id': `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/brand/06_Website_Logo_1200x400.png`,
        width: 1200,
        height: 400,
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.domain}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
    },
  };

  // JSON-LD BreadcrumbList Structured Data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.domain },
      { '@type': 'ListItem', position: 2, name: catMeta?.name ?? category, item: `${SITE_CONFIG.domain}/${category}` },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonicalUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Header activeCategory={category} />

      {/* Left & Right Outer Skyscraper Gutter Column Ads */}
      <AdSlot size="left-skyscraper" />
      <AdSlot size="right-skyscraper" />

      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${category}`} className="hover:text-purple-300 transition-colors capitalize">{catMeta?.name ?? category}</Link>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-xs">{article.title}</span>
          </nav>

          {/* Article Header */}
          <header className="space-y-4">
            {article.isDemo && (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-500/30">
                [DEMO CONTENT]
              </span>
            )}
            <span className="category-badge block w-fit">{article.categoryName}</span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white font-heading leading-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">{article.subtitle}</p>
            )}

            {/* Author & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                {article.authorAvatar ? (
                  <img src={article.authorAvatar} alt={article.author} className="w-10 h-10 rounded-full object-cover border border-brand-purple/50" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <div>
                  <Link href={`/authors/${authorSlug}`} className="font-bold text-white hover:text-brand-purple transition-colors block">
                    {article.author}
                  </Link>
                  <span className="text-[11px] text-brand-purple">{article.authorRole ?? 'Staff Writer'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-purple" /> {article.publishedAt}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-brand-cyan" /> {article.views} views</span>
              </div>
            </div>
          </header>

          {/* Featured Image (Only rendered if an image exists) */}
          {Boolean(article.image) && (
            <figure className="space-y-2">
              <img
                src={article.image}
                alt={article.title}
                loading="eager"
                decoding="async"
                width="768"
                height="432"
                className="w-full aspect-video object-cover rounded-2xl border border-white/10 shadow-2xl"
              />
            </figure>
          )}

          {/* Article Editorial Body with Embedded In-Article Ads */}
          <InArticleContent content={article.content} />

          {/* Sources Section */}
          {article.source && (
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Attributed Source</span>
              <a
                href={article.source.url ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-cyan hover:underline inline-flex items-center gap-1 font-medium"
              >
                {article.source.name} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Tags Section */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1"><TagIcon className="w-3.5 h-3.5" /> Tags:</span>
              {article.tags.map(t => (
                <Link
                  key={t.slug}
                  href={`/tags/${t.slug}`}
                  className="px-3 py-1 bg-slate-900 hover:bg-brand-purple/20 hover:text-purple-300 text-slate-300 text-xs rounded-full border border-white/10 transition-colors"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          )}

          {/* Social Sharing Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-brand-purple" /> Share Article
            </span>
            <div className="flex items-center gap-2 text-xs">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${canonicalUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-emerald-600/80 hover:bg-emerald-500 text-white font-semibold transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
              >
                X / Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-blue-600/80 hover:bg-blue-500 text-white font-semibold transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-blue-700/80 hover:bg-blue-600 text-white font-semibold transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t border-white/10 space-y-4">
              <h3 className="text-lg font-extrabold text-white font-heading">Related Stories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map(rel => (
                  <ArticleCard key={rel.id} article={rel} variant="grid" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Before-Footer Pre-Footer Ad Banner (Slot 7) */}
      <AdSlot size="footer-banner" />

      <Footer />
    </div>
  );
}
