import type { Metadata } from 'next';
import { Link2, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { getCmsSources } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createSourceAction, deleteSourceAction } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'News Sources — GenZ Live CMS',
};

export default async function AdminSourcesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role === 'AUTHOR') {
    redirect('/admin/articles');
  }

  const { error } = await searchParams;
  const sources = await getCmsSources();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">News & Reference Sources</h1>
        <p className="text-xs text-slate-400">Trusted press agencies and syndicate publication partners</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Source Name</th>
                  <th className="p-4">Domain</th>
                  <th className="p-4">Articles Count</th>
                  <th className="p-4">Trust Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {sources.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-brand-purple" /> {s.name}
                    </td>
                    <td className="p-4 font-mono text-slate-400">{s.domain}</td>
                    <td className="p-4 font-mono font-bold text-brand-cyan">{s.articleCount}</td>
                    <td className="p-4">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <form action={deleteSourceAction.bind(null, s.id)}>
                        <button type="submit" className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Source Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">Add News Source</h3>
            <form action={createSourceAction} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Source Name</label>
                <input name="name" required placeholder="e.g. Associated Press" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Website URL</label>
                <input name="url" placeholder="https://apnews.com" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold shadow-glow-purple">
                <Plus className="w-4 h-4 inline mr-1" /> Add Source
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
