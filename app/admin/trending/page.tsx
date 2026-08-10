import type { Metadata } from 'next';
import { TrendingUp } from 'lucide-react';
import { getCmsArticles } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Trending Stories — GenZ Live CMS',
};

export default async function AdminTrendingPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const data = await getCmsArticles({ status: 'PUBLISHED' });
  const trendingArticles = data.articles.filter(a => a.isTrending);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Trending Stories (01..05)</h1>
        <p className="text-xs text-slate-400">Articles featured in the numbered homepage trending ranking list</p>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
        {trendingArticles.map((art, idx) => (
          <div key={art.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-2xl font-extrabold text-brand-purple font-mono w-8 text-center shrink-0">
                0{idx + 1}
              </span>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-brand-cyan uppercase">{art.categoryName}</span>
                <h3 className="font-bold text-white line-clamp-1">{art.title}</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">{art.views} total views</p>
              </div>
            </div>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3 h-3" /> Trending ON
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
