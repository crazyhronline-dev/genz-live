import type { Metadata } from 'next';
import Link from 'next/link';
import { PlusCircle, Edit3 } from 'lucide-react';
import { getCmsArticles } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Draft Articles — GenZ Live CMS',
};

export default async function AdminDraftsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const data = await getCmsArticles({
    status: 'DRAFT',
    authorOnlyId: user.role === 'AUTHOR' || user.role === 'WRITER' ? user.id : undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Draft Articles</h1>
          <p className="text-xs text-slate-400">Unpublished draft work in progress</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary text-xs py-2 px-3 inline-flex items-center gap-1">
          <PlusCircle className="w-3.5 h-3.5" /> New Draft
        </Link>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {data.articles.length > 0 ? (
          <div className="divide-y divide-white/5">
            {data.articles.map(art => (
              <div key={art.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors text-xs">
                <div className="min-w-0">
                  <h3 className="font-bold text-white line-clamp-1">{art.title}</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">{art.categoryName} · Author: {art.authorName} · Updated: {art.updatedAt}</p>
                </div>
                <Link href={`/admin/articles/new?id=${art.id}`} className="btn-secondary text-xs py-1.5 px-3 shrink-0">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">No draft articles found.</div>
        )}
      </div>
    </div>
  );
}
