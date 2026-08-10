import type { Metadata } from 'next';
import { Flame, Plus, Check } from 'lucide-react';
import { getCmsBreakingNews } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Breaking News Ticker — GenZ Live CMS',
};

export default async function AdminBreakingNewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const breakingItems = await getCmsBreakingNews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Breaking News Ticker</h1>
        <p className="text-xs text-slate-400">Control items displayed in the public top breaking ticker bar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
            {breakingItems.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Priority {item.priority}
                    </span>
                    <span className="text-brand-purple font-bold">{item.category}</span>
                  </div>
                  <p className="font-bold text-white line-clamp-1">{item.text}</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/30 shrink-0 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">Add Breaking Item</h3>
            <div className="space-y-3">
              <input placeholder="Headline text..." className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              <input placeholder="Category label (e.g. AI)" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              <button disabled className="w-full btn-primary py-2.5 text-xs font-bold opacity-75 cursor-not-allowed">
                <Plus className="w-4 h-4 inline mr-1" /> Add Ticker Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
