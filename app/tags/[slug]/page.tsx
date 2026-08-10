import type { Metadata } from 'next';
import Link from 'next/link';
import { Hash, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleCard from '@/components/news/ArticleCard';
import { buildPageMetadata } from '@/lib/seo';
import { getArticlesByTag } from '@/lib/dataAccess';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return buildPageMetadata({
    title: `#${tagName} — Topic Tag`,
    description: `All published GenZ Live news articles, analysis, and stories tagged with #${tagName}.`,
  });
}

export default async function TagPage({ params }: Params) {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const articles = await getArticlesByTag(slug);

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Home
          </Link>

          {/* Tag Banner */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center shrink-0 shadow-glow-purple">
              <Hash className="w-8 h-8 text-brand-purple" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">Topic Tag</span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white font-heading">#{tagName}</h1>
              <p className="text-xs text-slate-400">
                {articles.length} story{articles.length !== 1 ? 'ies' : ''} tagged with #{tagName}
              </p>
            </div>
          </div>

          {/* Tagged Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} variant="grid" />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto">
              <Hash className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">No articles tagged with #{tagName} yet.</p>
              <Link href="/" className="btn-primary text-xs">Browse Main Feed</Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
