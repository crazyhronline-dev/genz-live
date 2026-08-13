// ================================================================
// GenZ Live — Today's Newsroom Daily Brief (/admin/newsroom)
// Answers: What should we publish, update, and promote today?
// ================================================================

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { fetchNewsroomDailyBriefAction } from '@/app/admin/growth-actions';
import { Newspaper, Sparkles, Clock, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NewsroomDailyBriefPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const brief = await fetchNewsroomDailyBriefAction();
  if (!brief) redirect('/admin');

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Newspaper className="w-7 h-7 text-cyan-400" />
              Today&apos;s Newsroom Daily Brief
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Editorial roadmap for {brief.todayDate} — What to publish, update, and distribute today
            </p>
          </div>
        </div>

        {/* Top 4 Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-slate-400">Published Stories</div>
            <div className="text-2xl font-black text-white mt-1">{brief.publishedCount}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Discover Eligible</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{brief.discoverEligibleCount}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-cyan-400">Google News Ready</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">{brief.newsEligibleCount}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-violet-400">AdSense Readiness</div>
            <div className="text-2xl font-black text-violet-400 mt-1">{brief.revenueReport.score}/100</div>
          </div>
        </div>

        {/* Optimal Publishing Window Card */}
        <div className="p-5 bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Clock className="w-4 h-4" /> Recommended Publishing Window Today
          </div>
          <h3 className="text-lg font-black text-white">{brief.optimalTime.recommendedWindow}</h3>
          <p className="text-xs text-slate-400">💡 Reason: {brief.optimalTime.reason}</p>
        </div>

        {/* 2-Column Grid: Content Opportunities & Revenue Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Opportunities */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Today&apos;s Editorial Opportunities
            </h3>
            <div className="space-y-2.5">
              {brief.opportunities.map((opp, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">{opp.title}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-mono text-[9px] rounded">{opp.sourceSignal}</span>
                  </div>
                  <p className="text-slate-300">{opp.description}</p>
                  <p className="text-emerald-400 text-[11px]">👉 Action: {opp.recommendedAction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue & AdSense Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Revenue & AdSense Readiness Audit
            </h3>
            <div className="space-y-2 text-xs">
              {brief.revenueReport.checklist.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
                  <span className="text-white font-medium">{item.item}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
