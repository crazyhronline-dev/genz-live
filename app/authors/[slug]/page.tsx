import type { Metadata } from 'next';
import Link from 'next/link';
import { UserCircle2, Clock, Eye } from 'lucide-react';
import StaticPage from '@/components/layout/StaticPage';
import { ARTICLES } from '@/lib/newsData';
import { buildPageMetadata } from '@/lib/seo';

interface Params { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const authorName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return buildPageMetadata({
    title: `${authorName} — Author`,
    description: `Articles and stories by ${authorName} on GenZ Live.`,
  });
}

export default async function AuthorPage({ params }: Params) {
  const { slug } = await params;
  const authorName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Find articles by this author (slug-based match for now)
  const authorArticles = ARTICLES.filter(a =>
    a.author.toLowerCase().replace(/\s+/g, '-') === slug
  );

  return (
    <StaticPage title={authorName} subtitle={`Author at GenZ Live`}>
      <div className="section-card flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-2xl bg-navy-elevated flex items-center justify-center shrink-0 border border-white/10">
          <UserCircle2 className="w-10 h-10 text-slate-500" />
        </div>
        <div>
          <h2 style={{ marginTop: 0, borderBottom: 'none', paddingBottom: 0 }} className="text-xl font-extrabold text-white">{authorName}</h2>
          <p className="text-slate-400 text-sm mt-1">Staff Writer · GenZ Live</p>
          <p className="text-slate-500 text-xs mt-1">{authorArticles.length} article{authorArticles.length !== 1 ? 's' : ''} published</p>
        </div>
      </div>

      {authorArticles.length > 0 ? (
        <div className="space-y-4">
          <h2>Published Articles</h2>
          {authorArticles.map(article => (
            <div key={article.id} className="section-card flex gap-4 items-center">
              <img src={article.image} alt={article.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="category-badge text-[10px]">{article.categoryName}</span>
                <h3 className="text-sm font-bold text-white mt-1 line-clamp-2">{article.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.views}</span>
                  <span>{article.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="section-card text-center py-10 space-y-3">
          <p className="text-slate-400">No articles found for this author.</p>
          <Link href="/" className="inline-block btn-primary text-xs">Browse All Articles</Link>
        </div>
      )}
    </StaticPage>
  );
}
