// ================================================================
// GenZ Live — Master Newsroom Growth & Analytics Dashboard
// Route: /admin/analytics
// Overview performance, traffic velocity, content decay, and GSC status.
// ================================================================

import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { fetchOverviewAnalyticsAction } from '@/app/admin/analytics-actions';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { BarChart3, TrendingUp, AlertTriangle, FileText, Globe, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const data = await fetchOverviewAnalyticsAction();
  const overview = data?.overview || { totalArticles: 0, publishedToday: 0, totalViews: 0, topArticle: null };
  const articles = data?.articles || [];
  const trendingRecommendations = data?.trendingRecommendations || [];
  const decayedArticles = data?.decayedArticles || [];
  const gscData = data?.gscData || { isConnected: false, statusMessage: '' };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminSidebar user={{ id: user.id, email: user.email, name: user.name, role: user.role }} />

      <main className="flex-1 p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-cyan-400" />
              Newsroom Growth & Editorial Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time story performance, traffic velocity, topic trends, and content decay intelligence
            </p>
          </div>
        </div>

        {/* Counter Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Published</div>
            <div className="text-2xl font-black text-white mt-1">{overview.totalArticles}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Published Today</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{overview.publishedToday}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-cyan-400">Total Audience Views</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">{overview.totalViews}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-violet-400">Top Performing Category</div>
            <div className="text-sm font-bold text-white mt-2 truncate">
              {overview.topArticle ? overview.topArticle.categoryName : 'N/A'}
            </div>
          </div>
        </div>

        {/* Search Console Status Banner */}
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          gscData.isConnected
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 shrink-0" />
            <span><strong>Google Search Console API:</strong> {gscData.statusMessage}</span>
          </div>
        </div>

        {/* 2-Column Section: Trending Recommendations & Content Decay */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Recommendations */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Trending Story Recommendations
            </h3>
            <p className="text-xs text-slate-400">Articles with high traffic velocity recommended for homepage Trending or Breaking status.</p>

            <div className="space-y-2.5">
              {trendingRecommendations.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs">No current traffic velocity spikes detected.</div>
              ) : (
                trendingRecommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400">{rec.categoryName}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] rounded font-bold">{rec.velocityScore} views/hr</span>
                    </div>
                    <p className="text-white font-semibold">{rec.title}</p>
                    <p className="text-slate-400 text-[11px]">💡 Reason: {rec.reason}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Content Decay Detection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Content Decay Intelligence
            </h3>
            <p className="text-xs text-slate-400">Evergreen stories experiencing traffic decline that should be refreshed with new facts/links.</p>

            <div className="space-y-2.5">
              {decayedArticles.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs">No decayed articles detected.</div>
              ) : (
                decayedArticles.map((decay, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400">Decay Score: {decay.decayScore}/100</span>
                      <span className="text-slate-500 text-[10px]">{decay.daysOld} days old</span>
                    </div>
                    <p className="text-white font-semibold">{decay.title}</p>
                    <p className="text-cyan-400 text-[11px]">💡 {decay.recommendation}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Top 20 Articles Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" /> Article Performance Table
            </h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4 text-center">Views</th>
                <th className="p-4 text-center">Performance Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {articles.map(art => (
                <tr key={art.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-semibold text-white max-w-xs truncate">{art.title}</td>
                  <td className="p-4">{art.categoryName}</td>
                  <td className="p-4 text-slate-400">{art.authorName}</td>
                  <td className="p-4 text-center font-bold text-white">{art.views}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      art.performanceStatus === 'PERFORMING_WELL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : art.performanceStatus === 'NORMAL'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {art.performanceStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/articles/new?id=${art.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold"
                    >
                      Edit <ArrowUpRight className="w-3 h-3" />
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
