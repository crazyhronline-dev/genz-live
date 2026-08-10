import type { Metadata } from 'next';
import { User, ExternalLink } from 'lucide-react';
import { getCmsAuthors } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Authors — GenZ Live CMS',
};

export default async function AdminAuthorsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const authors = await getCmsAuthors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Editorial Authors</h1>
        <p className="text-xs text-slate-400">Writer profiles and staff journalist attributions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {authors.map(a => (
          <div key={a.id} className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-800 border border-brand-purple/40 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-brand-purple" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">{a.name}</h3>
                <span className="text-[10px] font-mono text-brand-cyan bg-slate-900 px-2 py-0.5 rounded border border-white/5">{a.articleCount} articles</span>
              </div>
              <p className="text-xs text-brand-purple font-medium">{a.designation}</p>
              <p className="text-xs text-slate-400 line-clamp-2">{a.bio}</p>
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span>{a.email}</span>
                {a.twitter && <span className="flex items-center gap-1 text-slate-400"><ExternalLink className="w-3 h-3 text-sky-400" /> {a.twitter}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
