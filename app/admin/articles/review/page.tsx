import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, CheckCircle2, Edit3 } from 'lucide-react';
import { getCmsArticles } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { updateArticleStatusAction } from '@/app/admin/actions';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Editorial Review Queue — GenZ Live CMS',
};

export default async function AdminReviewQueuePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const data = await getCmsArticles({ status: 'REVIEW' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Editorial Review Queue</h1>
        <p className="text-xs text-slate-400">Articles submitted by authors waiting for editor approval and publishing</p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {data.articles.length > 0 ? (
          <div className="divide-y divide-white/5">
            {data.articles.map(art => (
              <div key={art.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors text-xs">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Awaiting Review
                    </span>
                    <span className="text-slate-400">{art.categoryName}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{art.title}</h3>
                  <p className="text-slate-400 text-[11px]">Submitted by {art.authorName} · Updated {art.updatedAt}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/articles/new?id=${art.id}`} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Link>

                  {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'EDITOR') && (
                    <form action={async () => { 'use server'; await updateArticleStatusAction(art.id, 'PUBLISHED'); }}>
                      <button type="submit" className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shadow-glow-purple">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">
            No articles currently awaiting review in queue.
          </div>
        )}
      </div>
    </div>
  );
}
