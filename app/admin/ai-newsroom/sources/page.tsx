import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FolderTree, Plus, RefreshCw, Globe, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { getNewsSources } from '@/lib/aiNewsroomData';
import { addSourceAction, toggleSourceAction, fetchSourceNowAction } from '@/app/admin/ai-newsroom/actions';

export const metadata: Metadata = {
  title: 'Manage AI News Sources — GenZ Live Admin',
  robots: { index: false, follow: false },
};

export default async function AiSourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;
  const sources = await getNewsSources();

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/ai-newsroom" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-3 h-3" /> Back to AI Newsroom
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-brand-purple" /> Approved News Feed Sources
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure permitted RSS wire feeds for newsroom ingestion. All external fetches use SSRF Guard.
          </p>
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

      {/* Add New Source Form */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-purple" /> Add Approved RSS Feed Source
        </h3>

        <form action={addSourceAction} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-1">
            <label htmlFor="source-name" className="text-xs text-slate-300 font-semibold">Source Name *</label>
            <input
              id="source-name"
              name="name"
              type="text"
              required
              placeholder="e.g. TechCrunch Wire"
              className="w-full bg-navy-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-purple focus:outline-none"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label htmlFor="source-website" className="text-xs text-slate-300 font-semibold">Website URL *</label>
            <input
              id="source-website"
              name="websiteUrl"
              type="url"
              required
              placeholder="https://techcrunch.com"
              className="w-full bg-navy-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-purple focus:outline-none"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label htmlFor="source-feed" className="text-xs text-slate-300 font-semibold">RSS Feed URL *</label>
            <input
              id="source-feed"
              name="feedUrl"
              type="url"
              required
              placeholder="https://techcrunch.com/feed/"
              className="w-full bg-navy-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-purple focus:outline-none"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label htmlFor="source-category" className="text-xs text-slate-300 font-semibold">Default Category</label>
            <select
              id="source-category"
              name="category"
              className="w-full bg-navy-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-purple focus:outline-none"
            >
              <option value="technology">Technology</option>
              <option value="ai">Artificial Intelligence</option>
              <option value="world">World News</option>
              <option value="india">India News</option>
              <option value="business">Business</option>
              <option value="markets">Markets</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="culture">Culture</option>
            </select>
          </div>

          <div className="md:col-span-4 space-y-1">
            <label htmlFor="source-trust" className="text-xs text-slate-300 font-semibold">Trust Priority Level</label>
            <select
              id="source-trust"
              name="trustLevel"
              className="w-full bg-navy-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-purple focus:outline-none"
            >
              <option value="HIGH">HIGH (Verified Outlet)</option>
              <option value="MEDIUM">MEDIUM (Standard Wire)</option>
              <option value="LOW">LOW (Community Feed)</option>
            </select>
          </div>

          <div className="md:col-span-4 flex items-end">
            <button type="submit" className="btn-primary text-xs py-2.5 px-6 w-full shadow-glow-purple">
              Add Source
            </button>
          </div>
        </form>
      </div>

      {/* Sources List Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 bg-slate-900/60 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active News Sources ({sources.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="p-4">Source Name</th>
                <th className="p-4">Default Category</th>
                <th className="p-4">Trust Level</th>
                <th className="p-4">Last Fetched</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sources.map(src => (
                <tr key={src.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-brand-purple" /> {src.name}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block truncate max-w-xs">{src.feedUrl}</span>
                  </td>
                  <td className="p-4 text-slate-300 capitalize">{src.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      src.trustLevel === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {src.trustLevel}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{src.lastFetchedAt}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${src.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {src.isActive ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {src.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <form action={fetchSourceNowAction}>
                        <input type="hidden" name="sourceId" value={src.id} />
                        <button type="submit" className="btn-secondary text-[11px] py-1 px-3 flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 text-brand-cyan" /> Fetch Now
                        </button>
                      </form>

                      <form action={toggleSourceAction}>
                        <input type="hidden" name="sourceId" value={src.id} />
                        <input type="hidden" name="isActive" value={(!src.isActive).toString()} />
                        <button type="submit" className="text-[11px] text-slate-400 hover:text-white px-2 py-1">
                          {src.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
