import type { Metadata } from 'next';
import { Link2, ExternalLink } from 'lucide-react';
import { getCmsSources } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sources — GenZ Live CMS',
};

export default async function AdminSourcesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const sources = await getCmsSources();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Attribution Sources</h1>
        <p className="text-xs text-slate-400">External reporting references and citations</p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-4">Source Name</th>
              <th className="p-4">Domain</th>
              <th className="p-4">Attributed Articles</th>
              <th className="p-4">Reliability Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {sources.map(s => (
              <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-brand-purple" /> {s.name}
                </td>
                <td className="p-4">
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline inline-flex items-center gap-1">
                    {s.domain} <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="p-4 font-mono font-bold">{s.articleCount}</td>
                <td className="p-4">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/30">
                    Verified Reliable
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
