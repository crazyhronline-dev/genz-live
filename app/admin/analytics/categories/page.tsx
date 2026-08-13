// ================================================================
// GenZ Live — Category Performance Analytics Page (/admin/analytics/categories)
// Category audience distribution, total views, and story performance.
// ================================================================

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { fetchCategoryAnalyticsAction } from '@/app/admin/analytics-actions';
import { FolderTree } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CategoryAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const categories = (await fetchCategoryAnalyticsAction()) || [];

  return (
    <div className="space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderTree className="w-7 h-7 text-cyan-400" />
            Category Performance Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audience distribution and view velocity per news category
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-center">Published Stories</th>
                <th className="p-4 text-center">Total Audience Views</th>
                <th className="p-4 text-center">Avg Views/Story</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-cyan-400" /> {c.name}
                  </td>
                  <td className="p-4 font-mono text-slate-400">/{c.slug}</td>
                  <td className="p-4 text-center font-bold text-white">{c.articleCount}</td>
                  <td className="p-4 text-center font-bold text-cyan-400">{c.totalViews}</td>
                  <td className="p-4 text-center font-bold text-emerald-400">{c.avgViews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}
