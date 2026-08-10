import type { Metadata } from 'next';
import { Tag as TagIcon, Plus } from 'lucide-react';
import { getCmsTags } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tags — GenZ Live CMS',
};

export default async function AdminTagsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const tags = await getCmsTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Topic Tags</h1>
        <p className="text-xs text-slate-400">Keyword tagging for article indexing and discovery</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <div key={t.id} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-2 text-xs">
                  <TagIcon className="w-3.5 h-3.5 text-brand-purple" />
                  <span className="font-bold text-white">#{t.name}</span>
                  <span className="text-[10px] font-mono text-brand-cyan bg-slate-950 px-1.5 py-0.5 rounded">{t.articleCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">Add New Tag</h3>
            <div className="space-y-3">
              <input placeholder="Tag Name (e.g. Machine Learning)" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              <button disabled className="w-full btn-primary py-2.5 text-xs font-bold opacity-75 cursor-not-allowed">
                <Plus className="w-4 h-4 inline mr-1" /> Add Tag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
