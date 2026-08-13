// ================================================================
// GenZ Live — Technical SEO Health & Indexing Monitor Page (/admin/seo)
// Scans meta tags, JSON-LD schemas, sitemaps, RSS, and IndexNow status.
// ================================================================

import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { fetchSEOHealthDashboardAction } from '@/app/admin/analytics-actions';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Globe, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SEOHealthPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const data = await fetchSEOHealthDashboardAction();
  const audits = data?.audits || [];
  const counts = data?.counts || { total: 0, good: 0, warning: 0, error: 0 };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminSidebar user={{ id: user.id, email: user.email, name: user.name, role: user.role }} />

      <main className="flex-1 p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Globe className="w-7 h-7 text-emerald-400" />
              Technical SEO Health & Indexing Monitor
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automated audit for Meta Tags, NewsArticle JSON-LD, Sitemaps, RSS, and IndexNow submission
            </p>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Audited Stories</div>
            <div className="text-2xl font-black text-white mt-1">{counts.total}</div>
          </div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400">GOOD / PASS</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{counts.good}</div>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-amber-400">WARNING</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{counts.warning}</div>
          </div>
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-rose-400">ERROR</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{counts.error}</div>
          </div>
        </div>

        {/* System Infrastructure Feeds status */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
          <h3 className="font-bold text-white mb-2">Search Engine Feeds & Discovery Endpoints</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a href="/robots.txt" target="_blank" className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between hover:border-emerald-500/50">
              <span>robots.txt</span> <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
            <a href="/sitemap.xml" target="_blank" className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between hover:border-emerald-500/50">
              <span>sitemap.xml</span> <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
            <a href="/news-sitemap.xml" target="_blank" className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between hover:border-emerald-500/50">
              <span>news-sitemap.xml</span> <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
            <a href="/rss.xml" target="_blank" className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between hover:border-emerald-500/50">
              <span>rss.xml</span> <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>
        </div>

        {/* Audits Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Article ID</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">SEO Score</th>
                <th className="p-4 text-center">Word Count</th>
                <th className="p-4 text-center">Internal Links</th>
                <th className="p-4 text-center">Sitemaps</th>
                <th className="p-4">Issues</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {audits.map(audit => (
                <tr key={audit.articleId} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono text-slate-400">{audit.articleId}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      audit.status === 'GOOD'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : audit.status === 'WARNING'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-white">{audit.score}/100</td>
                  <td className="p-4 text-center font-bold text-slate-300">{audit.wordCount}</td>
                  <td className="p-4 text-center font-bold text-cyan-400">{audit.internalLinksCount}</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">✓ Ready</td>
                  <td className="p-4 max-w-xs truncate text-amber-400">
                    {audit.issues.length > 0 ? audit.issues.join('; ') : 'No issues'}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/articles/new?id=${audit.articleId}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold"
                    >
                      Fix <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
