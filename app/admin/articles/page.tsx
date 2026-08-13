import type { Metadata } from 'next';
import Link from 'next/link';
import { PlusCircle, Search, Edit3, ExternalLink, Zap, EyeOff } from 'lucide-react';
import { getCmsArticles } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import type { ArticleStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { togglePublishStatusAction } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'Articles Management — GenZ Live CMS',
};

interface SearchParams {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function AdminArticlesPage({ searchParams }: SearchParams) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const { status, q } = await searchParams;
  const statusFilter = (status as ArticleStatus) || 'ALL';

  const data = await getCmsArticles({
    status: statusFilter,
    search: q,
  });

  const statuses = ['ALL', 'DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Articles Management</h1>
          <p className="text-xs text-slate-400">Total {data.total} articles in newsroom database</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 shadow-glow-purple">
          <PlusCircle className="w-4 h-4" /> Create Article
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {statuses.map(st => (
            <Link
              key={st}
              href={`/admin/articles?status=${st}${q ? `&q=${q}` : ''}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-brand-purple text-white shadow-glow-purple'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </Link>
          ))}
        </div>

        {/* Search Input */}
        <form action="/admin/articles" method="GET" className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="q"
            defaultValue={q || ''}
            placeholder="Search articles..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
          />
        </form>
      </div>

      {/* Articles Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Title & Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Views</th>
                <th className="p-4">Published</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {data.articles.map(art => (
                <tr key={art.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-medium text-white max-w-xs">
                    <p className="font-bold line-clamp-1">{art.title}</p>
                    <span className="text-[11px] text-slate-500 font-mono block">/{art.categorySlug}/{art.slug}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      art.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      art.status === 'DRAFT' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      art.status === 'REVIEW' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      art.status === 'SCHEDULED' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                      'bg-slate-800 text-slate-400 border-white/10'
                    }`}>
                      {art.status}
                    </span>
                  </td>
                  <td className="p-4">{art.categoryName}</td>
                  <td className="p-4">{art.authorName}</td>
                  <td className="p-4 font-mono">{art.views}</td>
                  <td className="p-4 text-slate-400">{art.publishedAt}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {art.status !== 'PUBLISHED' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'EDITOR') && (
                        <form action={togglePublishStatusAction} className="inline">
                          <input type="hidden" name="articleId" value={art.id} />
                          <input type="hidden" name="targetStatus" value="PUBLISHED" />
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] font-bold transition-all flex items-center gap-1 shadow-sm"
                            title="Publish Live Immediately"
                          >
                            <Zap className="w-3 h-3 text-emerald-400" /> Publish Live
                          </button>
                        </form>
                      )}

                      {art.status === 'PUBLISHED' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'EDITOR') && (
                        <form action={togglePublishStatusAction} className="inline">
                          <input type="hidden" name="articleId" value={art.id} />
                          <input type="hidden" name="targetStatus" value="DRAFT" />
                          <button
                            type="submit"
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-amber-400 border border-white/10 text-[10px] font-bold transition-all flex items-center gap-1"
                            title="Unpublish to Draft"
                          >
                            <EyeOff className="w-3 h-3" /> Unpublish
                          </button>
                        </form>
                      )}

                      <Link
                        href={`/admin/articles/new?id=${art.id}`}
                        className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-slate-800 hover:bg-brand-purple text-white transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      {art.status === 'PUBLISHED' && (
                        <a
                          href={`/${art.categorySlug}/${art.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-cyan transition-colors"
                          title="View Public Article"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
