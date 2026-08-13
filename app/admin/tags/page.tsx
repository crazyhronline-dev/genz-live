import type { Metadata } from 'next';
import { Tag as TagIcon, Plus, Trash2 } from 'lucide-react';
import { getCmsTags } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createTagAction, deleteTagAction } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'Tags — GenZ Live CMS',
};

export default async function AdminTagsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role === 'AUTHOR') {
    redirect('/admin/articles');
  }

  const { error } = await searchParams;
  const tags = await getCmsTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Topic Tags</h1>
        <p className="text-xs text-slate-400">Keyword tagging for article indexing and discovery</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <div key={t.id} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-2 text-xs">
                  <TagIcon className="w-3.5 h-3.5 text-brand-purple" />
                  <span className="font-bold text-white">#{t.name}</span>
                  <span className="text-[10px] font-mono text-brand-cyan bg-slate-950 px-1.5 py-0.5 rounded">{t.articleCount}</span>
                  <form action={deleteTagAction.bind(null, t.id)} className="inline">
                    <button type="submit" title="Delete tag" className="text-slate-500 hover:text-red-400 ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">Add New Tag</h3>
            <form action={createTagAction} className="space-y-3">
              <input name="name" required placeholder="Tag Name (e.g. Machine Learning)" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold shadow-glow-purple">
                <Plus className="w-4 h-4 inline mr-1" /> Add Tag
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

