// ================================================================
// GenZ Live — Editorial Dashboard Page (/admin/editorial-checks)
// Master queue for reviewing article fact-checks, source dependency,
// and unverified quotes across the newsroom.
// ================================================================

import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { fetchEditorialDashboardAction } from '@/app/admin/editorial-actions';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EditorialDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const data = await fetchEditorialDashboardAction();
  const checks = data?.checks || [];
  const counts = data?.counts || { total: 0, passed: 0, reviewRequired: 0, failed: 0, highDependency: 0, unverifiedQuotes: 0 };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminSidebar user={{ id: user.id, email: user.email, name: user.name, role: user.role }} />

      <main className="flex-1 p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-violet-400" />
              Editorial Dashboard & Fact-Check Queue
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Editorial risk assessment, originality analysis, and source attribution management
            </p>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Checked</div>
            <div className="text-2xl font-black text-white mt-1">{counts.total}</div>
          </div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Passed</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{counts.passed}</div>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-amber-400">Review Req.</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{counts.reviewRequired}</div>
          </div>
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-rose-400">Failed</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{counts.failed}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-amber-400">High Dependency</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{counts.highDependency}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-violet-400">Unverified Quotes</div>
            <div className="text-2xl font-black text-violet-400 mt-1">{counts.unverifiedQuotes}</div>
          </div>
        </div>

        {/* Checks Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Overall</th>
                <th className="p-4 text-center">Fact</th>
                <th className="p-4 text-center">Originality</th>
                <th className="p-4 text-center">Dependency</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {checks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No editorial checks executed yet. Open an article in the CMS to run a check.
                  </td>
                </tr>
              ) : (
                checks.map(check => (
                  <tr key={check.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-white max-w-xs truncate">
                      {check.article?.title}
                    </td>
                    <td className="p-4">{check.article?.category?.name}</td>
                    <td className="p-4 text-slate-400">{check.article?.author?.name}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        check.status === 'PASSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : check.status === 'REVIEW_REQUIRED'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {check.status}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-white">{check.overallScore}</td>
                    <td className="p-4 text-center font-bold text-emerald-400">{check.factScore}%</td>
                    <td className="p-4 text-center font-bold text-cyan-400">{check.originalityScore}%</td>
                    <td className="p-4 text-center font-bold text-amber-400">{check.sourceDependencyScore}%</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/articles/new?id=${check.articleId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded text-[11px] font-bold transition-all"
                      >
                        Review <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
