import type { Metadata } from 'next';
import Link from 'next/link';
import { Hash, Clock, Eye } from 'lucide-react';
import StaticPage from '@/components/layout/StaticPage';
import { ARTICLES } from '@/lib/newsData';
import { buildPageMetadata } from '@/lib/seo';

interface Params { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return buildPageMetadata({
    title: `#${tagName} — Tag`,
    description: `All GenZ Live articles tagged with #${tagName}.`,
  });
}

export default async function TagPage({ params }: Params) {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Tag matching: match category or keyword in title (placeholder until real tag system)
  const tagArticles = ARTICLES.filter(a =>
    a.category === slug || a.title.toLowerCase().includes(slug.replace(/-/g, ' '))
  );

  return (
    <StaticPage title={`#${tagName}`} subtitle={`${tagArticles.length} article${tagArticles.length !== 1 ? 's' : ''} tagged`}>
      <div className="section-card flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center">
          <Hash className="w-6 h-6 text-brand-purple" />
        </div>
        <div>
          <h2 style={{ marginTop: 0, borderBottom: 'none', paddingBottom: 0 }}>#{tagName}</h2>
          <p className="text-slate-500 text-xs">{tagArticles.length} article{tagArticles.length !== 1 ? 's' : ''} · GenZ Live</p>
        </div>
      </div>

      {tagArticles.length > 0 ? (
        <div className="space-y-4">
          {tagArticles.map(article => (
            <div key={article.id} className="section-card flex gap-4 items-center">
              <img src={article.image} alt={article.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="category-badge text-[10px]">{article.categoryName}</span>
                <h3 className="text-sm font-bold text-white mt-1 line-clamp-2">{article.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{article.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="section-card text-center py-10 space-y-3">
          <Hash className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400">No articles found for this tag yet.</p>
          <Link href="/" className="inline-block btn-primary text-xs">Browse All News</Link>
        </div>
      )}
    </StaticPage>
  );
}
