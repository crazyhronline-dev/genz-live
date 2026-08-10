import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Eye, BookOpen } from 'lucide-react';
import { ARTICLES } from '@/lib/newsData';
import { NAV_CATEGORIES, SITE_CONFIG } from '@/config/site';
import { buildPageMetadata } from '@/lib/seo';

interface Params { params: Promise<{ category: string; 'article-slug': string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, 'article-slug': articleSlug } = await params;

  const article = ARTICLES.find(
    a => a.id === articleSlug || a.category === category
  );

  return buildPageMetadata({
    title: article?.title ?? 'Article',
    description: article?.subtitle ?? `Read the latest ${category} news on GenZ Live.`,
  });
}

export default async function ArticleSlugPage({ params }: Params) {
  const { category, 'article-slug': articleSlug } = await params;

  const catMeta = NAV_CATEGORIES.find(c => c.id === category);
  const article = ARTICLES.find(
    a => a.id === articleSlug || a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === articleSlug
  );

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col">
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <a href="/">
            <img src="/brand/06_Website_Logo_1200x400.png" alt="GenZ Live" className="h-9 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <span className="text-slate-700">/</span>
            <Link href={`/${category}`} className="text-slate-400 hover:text-purple-300 transition-colors capitalize">{catMeta?.name ?? category}</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/${category}`} className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-8 group transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to {catMeta?.name ?? category}
          </Link>

          {article ? (
            <article className="space-y-6">
              <div className="space-y-3">
                <span className="category-badge">{article.categoryName}</span>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white font-heading leading-tight">{article.title}</h1>
                {article.subtitle && <p className="text-slate-300 text-lg leading-relaxed">{article.subtitle}</p>}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/10">
                  <span className="font-semibold text-white">{article.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-400" /> {article.readTime}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-cyan-400" /> {article.views}</span>
                  <span>{article.publishedAt}</span>
                </div>
              </div>

              <img src={article.image} alt={article.title} className="w-full aspect-video object-cover rounded-2xl border border-white/10" />

              <div
                className="prose-genz"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <Link href={`/${category}`} className="btn-secondary text-xs py-2 px-4">
                  ← More {catMeta?.name ?? category} News
                </Link>
                <Link href="/" className="btn-primary text-xs py-2 px-4">
                  <BookOpen className="w-3.5 h-3.5" /> All News
                </Link>
              </div>
            </article>
          ) : (
            <div className="text-center space-y-6 py-20">
              <BookOpen className="w-16 h-16 text-slate-700 mx-auto" />
              <h1 className="text-2xl font-extrabold text-white">Article Coming Soon</h1>
              <p className="text-slate-400">
                This article will be published here at{' '}
                <code className="text-purple-400 bg-navy-surface px-2 py-0.5 rounded text-sm">
                  /{category}/{articleSlug}
                </code>
              </p>
              <p className="text-slate-500 text-sm">The full article CMS is being built. Check back soon or browse other news.</p>
              <div className="flex items-center justify-center gap-4">
                <Link href={`/${category}`} className="btn-secondary text-xs">Browse {catMeta?.name ?? category}</Link>
                <Link href="/" className="btn-primary text-xs">← Back to Home</Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-white/5 py-6 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {SITE_CONFIG.name} · <Link href="/privacy-policy" className="hover:text-purple-400">Privacy</Link> · <Link href="/terms" className="hover:text-purple-400">Terms</Link></p>
      </footer>
    </div>
  );
}
