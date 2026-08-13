import type { Metadata } from 'next';
import { FolderTree, Plus, Check, Trash2 } from 'lucide-react';
import { getCmsCategories } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createCategoryAction, deleteCategoryAction } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'Categories — GenZ Live CMS',
};

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role === 'AUTHOR') {
    redirect('/admin/articles');
  }

  const { error } = await searchParams;
  const categories = await getCmsCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">News Categories</h1>
        <p className="text-xs text-slate-400">Primary editorial taxonomy for GenZ Live digital channels</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category List */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Articles</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-brand-purple" /> {cat.name}
                    </td>
                    <td className="p-4 font-mono text-slate-400">/{cat.slug}</td>
                    <td className="p-4 font-mono font-bold text-brand-cyan">{cat.articleCount}</td>
                    <td className="p-4">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <form action={deleteCategoryAction.bind(null, cat.id)}>
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

        {/* Add New Category Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">Add New Category</h3>
            <form action={createCategoryAction} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Category Name</label>
                <input name="name" required placeholder="e.g. Science" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Slug</label>
                <input name="slug" placeholder="science (optional)" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono" />
              </div>
              <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold shadow-glow-purple">
                <Plus className="w-4 h-4 inline mr-1" /> Add Category
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

