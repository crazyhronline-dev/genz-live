import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Inbox, Sparkles, ArrowLeft, ExternalLink, Search, Eye } from 'lucide-react';
import { getIngestedStories } from '@/lib/aiNewsroomData';
import { analyzeStoryAction } from '@/app/admin/ai-newsroom/actions';

export const metadata: Metadata = {
  title: 'Ingestion Inbox — AI Newsroom — GenZ Live Admin',
  robots: { index: false, follow: false },
};

export default async function AiInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string; success?: string; error?: string }>;
}) {
  const { status, search, page, success, error } = await searchParams;
  const pageNum = parseInt(page || '1', 10);
  const data = await getIngestedStories({ status, search, page: pageNum, limit: 15 });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/ai-newsroom" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-3 h-3" /> Back to AI Newsroom
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading flex items-center gap-2">
            <Inbox className="w-6 h-6 text-brand-purple" /> Ingestion Inbox ({data.total})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming wire stories, perform AI fact extraction, and trigger editorial draft creation.
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

      {/* Status Filter Bar & Search */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {['ALL', 'NEW', 'ANALYZED', 'DRAFT_CREATED', 'DUPLICATE'].map(st => (
            <Link
              key={st}
              href={`/admin/ai-newsroom/inbox?status=${st}`}
              className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                (status || 'ALL') === st
                  ? 'bg-brand-purple text-white shadow-glow-purple'
                  : 'bg-navy-surface border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </Link>
          ))}
        </div>

        <form className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="search"
            defaultValue={search || ''}
            placeholder="Search stories..."
            className="w-full bg-navy-surface border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-brand-purple focus:outline-none"
          />
        </form>
      </div>

      {/* Ingested Stories Feed Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="p-4">Headline / Source</th>
                <th className="p-4">Category</th>
                <th className="p-4">Received</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.stories.map(story => (
                <tr key={story.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/ai-newsroom/stories/${story.id}`} className="font-bold text-white hover:text-purple-300 transition-colors block text-sm mb-1">
                      {story.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="text-brand-purple font-medium">{story.sourceName}</span>
                      <span>·</span>
                      <a href={story.sourceUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                        Source Link <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </td>

                  <td className="p-4 capitalize text-slate-300">
                    <span className="bg-slate-900 border border-white/10 px-2.5 py-1 rounded-full font-mono text-[10px]">
                      {story.category}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400 font-mono">{story.publishedAt}</td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      story.status === 'NEW' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                      story.status === 'ANALYZED' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' :
                      story.status === 'DRAFT_CREATED' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                      story.status === 'DUPLICATE' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {story.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/ai-newsroom/stories/${story.id}`} className="btn-secondary text-[11px] py-1 px-3 flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-300" /> Inspect
                      </Link>

                      {!story.hasAnalysis ? (
                        <form action={analyzeStoryAction}>
                          <input type="hidden" name="storyId" value={story.id} />
                          <button type="submit" className="btn-primary text-[11px] py-1 px-3 flex items-center gap-1 shadow-glow-purple">
                            <Sparkles className="w-3 h-3" /> Analyze AI
                          </button>
                        </form>
                      ) : (
                        <Link href={`/admin/ai-newsroom/stories/${story.id}`} className="btn-primary text-[11px] py-1 px-3 flex items-center gap-1 shadow-glow-purple">
                          <Sparkles className="w-3 h-3 text-brand-cyan" /> View Analysis
                        </Link>
                      )}
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
