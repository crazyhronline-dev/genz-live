// ================================================================
// GenZ Live — Author Performance Analytics Page (/admin/analytics/authors)
// Professional newsroom author publication counts, total views, and averages.
// ================================================================

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { fetchAuthorAnalyticsAction } from '@/app/admin/analytics-actions';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AuthorAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const authors = (await fetchAuthorAnalyticsAction()) || [];

  return (
    <div className="space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-violet-400" />
            Author Performance Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publication metrics, audience engagement, and story contribution per author
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Author Name</th>
                <th className="p-4">Designation</th>
                <th className="p-4 text-center">Published Stories</th>
                <th className="p-4 text-center">Total Views</th>
                <th className="p-4 text-center">Avg Views/Story</th>
                <th className="p-4">Top Story</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {authors.map(a => (
                <tr key={a.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-400" /> {a.name}
                  </td>
                  <td className="p-4 text-slate-400">{a.designation}</td>
                  <td className="p-4 text-center font-bold text-white">{a.articleCount}</td>
                  <td className="p-4 text-center font-bold text-cyan-400">{a.totalViews}</td>
                  <td className="p-4 text-center font-bold text-emerald-400">{a.avgViews}</td>
                  <td className="p-4 max-w-xs truncate text-slate-300">{a.topArticleTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}
