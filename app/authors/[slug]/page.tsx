import type { Metadata } from 'next';
import Link from 'next/link';
import { User, ArrowLeft, BookOpen } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleCard from '@/components/news/ArticleCard';
import { buildAuthorMetadata } from '@/lib/seo';
import { getArticlesByAuthor } from '@/lib/dataAccess';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const authorName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const articles = await getArticlesByAuthor(slug);
  return buildAuthorMetadata({
    name: authorName,
    slug,
    articleCount: articles.length,
  });
}

export default async function AuthorPage({ params }: Params) {
  const { slug } = await params;
  const authorName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const articles = await getArticlesByAuthor(slug);

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Home
          </Link>

          {/* Author Header Banner */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-brand-purple/50 flex items-center justify-center shrink-0 overflow-hidden shadow-glow-purple">
              <User className="w-12 h-12 text-brand-purple" />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                Editorial Staff
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white font-heading">{authorName}</h1>
              <p className="text-sm text-slate-300">Staff Writer & Journalist at GenZ Live</p>
              <p className="text-xs text-slate-400 max-w-2xl">
                Covering global tech trends, cultural shifts, markets, and artificial intelligence for digital natives worldwide.
              </p>
            </div>
          </div>

          {/* Published Articles Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white font-heading flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-purple" /> Published Articles ({articles.length})
              </h2>
            </div>

            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} variant="grid" />
                ))}
              </div>
            ) : (
              <div className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto">
                <p className="text-slate-400 text-sm">No published articles found for this author.</p>
                <Link href="/" className="btn-primary text-xs">Return to Main Feed</Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
