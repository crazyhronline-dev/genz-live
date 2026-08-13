import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Inbox,
  Clock,
  CheckCircle2,
  FileEdit,
  AlertTriangle,
  Layers,
  FolderTree,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { getAiNewsroomMetrics } from '@/lib/aiNewsroomData';

import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'AI Newsroom Dashboard — GenZ Live Admin',
  robots: { index: false, follow: false },
};

export default async function AiNewsroomDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; triggerSuccess?: string; success?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role === 'AUTHOR') {
    redirect('/admin/articles');
  }
  const { success, error } = await searchParams;
  const metrics = await getAiNewsroomMetrics();

  const isAiConfigured = !!process.env.AI_API_KEY || process.env.AI_PROVIDER === 'mock' || !process.env.AI_PROVIDER;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-brand-purple uppercase tracking-widest bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> AI Newsroom Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading">
            AI-Assisted <span className="gradient-text">Newsroom Pipeline</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Assist human editors with automated RSS ingestion, duplicate detection, claim/fact analysis, and editorial draft generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/ai-newsroom/inbox" className="btn-primary text-xs py-2.5 px-4 shadow-glow-purple">
            <Inbox className="w-4 h-4" /> Ingestion Inbox ({metrics.unprocessedCount})
          </Link>
          <Link href="/admin/ai-newsroom/sources" className="btn-secondary text-xs py-2.5 px-4">
            <FolderTree className="w-4 h-4" /> Manage Sources
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Safety Warning Panel */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block mb-0.5">Editorial Control Policy:</strong>
          AI assists newsroom operations but NEVER automatically publishes stories. All AI-generated drafts enter <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">DRAFT</code> status and require human editorial review and authorization before publication.
        </div>
      </div>

      {/* Dashboard Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Incoming Stories</span>
            <Inbox className="w-4 h-4 text-brand-purple" />
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{metrics.incomingStories}</p>
          <p className="text-[11px] text-slate-400">{metrics.unprocessedCount} awaiting processing</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>AI Analyzed</span>
            <Sparkles className="w-4 h-4 text-brand-cyan" />
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{metrics.analyzedCount}</p>
          <p className="text-[11px] text-slate-400">Structured claim breakdown</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Drafts Generated</span>
            <FileEdit className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{metrics.draftsCreatedCount}</p>
          <p className="text-[11px] text-slate-400">{metrics.reviewCount} in review queue</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Duplicates / Failed</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{metrics.duplicateCount}</p>
          <p className="text-[11px] text-slate-400">{metrics.failedJobsCount} failed jobs</p>
        </div>
      </div>

      {/* Two Column Layout: Recent Activity & AI Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent AI Jobs */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-purple" /> Recent AI Pipeline Activity
          </h3>

          <div className="space-y-2">
            {metrics.recentJobs.map(job => (
              <div key={job.id} className="p-3 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-between gap-4 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{job.storyTitle}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{job.jobType} · {job.createdAt}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  job.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                  job.status === 'FAILED' ? 'bg-red-500/10 text-red-300 border-red-500/20' :
                  'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Engine Status Panel */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> AI Engine Status
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-white/5">
              <span className="text-slate-400">Provider:</span>
              <span className="font-bold text-white font-mono">{process.env.AI_PROVIDER || 'Mock Engine'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-white/5">
              <span className="text-slate-400">Status:</span>
              <span className={`font-bold flex items-center gap-1.5 ${isAiConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> {isAiConfigured ? 'Active & Ready' : 'Needs Config'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-white/5">
              <span className="text-slate-400">Active Sources:</span>
              <span className="font-bold text-white font-mono">{metrics.activeSources} / {metrics.totalSources}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-white/5">
              <span className="text-slate-400">Auto Publishing:</span>
              <span className="font-bold text-red-400 font-mono">DISABLED (Strict)</span>
            </div>
          </div>

          <Link href="/admin/ai-newsroom/settings" className="block text-center btn-secondary text-xs py-2 w-full mt-2">
            Configure AI Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
