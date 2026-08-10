import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Edit3 } from 'lucide-react';
import { getCmsArticles } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Scheduled Queue — GenZ Live CMS',
};

export default async function AdminScheduledPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const data = await getCmsArticles({ status: 'SCHEDULED' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Scheduled Publication Queue</h1>
        <p className="text-xs text-slate-400">Articles queued for automatic publication at future timestamps</p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {data.articles.length > 0 ? (
          <div className="divide-y divide-white/5">
            {data.articles.map(art => (
              <div key={art.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors text-xs">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Scheduled for: {art.scheduledAt || 'Future'}
                    </span>
                    <span className="text-slate-400">{art.categoryName}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{art.title}</h3>
                  <p className="text-slate-400 text-[11px]">Author: {art.authorName}</p>
                </div>
                <Link href={`/admin/articles/new?id=${art.id}`} className="btn-secondary text-xs py-1.5 px-3 shrink-0">
                  <Edit3 className="w-3.5 h-3.5" /> Edit / Reschedule
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">No scheduled articles found.</div>
        )}
      </div>
    </div>
  );
}
