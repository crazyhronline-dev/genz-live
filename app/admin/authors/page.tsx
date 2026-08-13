import type { Metadata } from 'next';
import { User, Plus, Trash2 } from 'lucide-react';
import { getCmsAuthors } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createAuthorAction, deleteAuthorAction } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'Authors — GenZ Live CMS',
};

export default async function AdminAuthorsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role === 'AUTHOR') {
    redirect('/admin/articles');
  }

  const { error } = await searchParams;
  const authors = await getCmsAuthors();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Editorial Authors</h1>
          <p className="text-xs text-slate-400">Writer profiles and staff journalist attributions</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authors.map(a => (
              <div key={a.id} className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start gap-4 relative group">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-brand-purple/40 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-brand-purple" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">{a.name}</h3>
                    <span className="text-[10px] font-mono text-brand-cyan bg-slate-900 px-2 py-0.5 rounded border border-white/5">{a.articleCount} articles</span>
                  </div>
                  <p className="text-xs text-brand-purple font-medium">{a.designation}</p>
                  <p className="text-xs text-slate-400 line-clamp-2">{a.bio}</p>
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="truncate max-w-[150px]">{a.email}</span>
                    <form action={deleteAuthorAction.bind(null, a.id)}>
                      <button type="submit" title="Delete author" className="text-slate-500 hover:text-red-400 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Author Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">Add New Author</h3>
            <form action={createAuthorAction} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Author Name</label>
                <input name="name" required placeholder="Full Name" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Designation</label>
                <input name="designation" placeholder="Senior Editor" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Email</label>
                <input name="email" type="email" placeholder="author@genz-live.com" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Bio</label>
                <textarea name="bio" rows={2} placeholder="Short bio..." className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold shadow-glow-purple">
                <Plus className="w-4 h-4 inline mr-1" /> Create Author
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

