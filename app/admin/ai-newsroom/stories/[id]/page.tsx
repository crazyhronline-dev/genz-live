import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  CheckSquare,
  FileEdit,
  FolderTree,
  User,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { getIngestedStoryDetail, runAiStoryAnalysis } from '@/lib/aiNewsroomData';
import { analyzeStoryAction, createCmsDraftFromAiAction } from '@/app/admin/ai-newsroom/actions';
import { getAIProvider } from '@/lib/ai/provider';

export const metadata: Metadata = {
  title: 'Story Analysis & Draft Editor — AI Newsroom',
  robots: { index: false, follow: false },
};

export default async function StoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { id } = await params;
  const { success, error } = await searchParams;

  const story = await getIngestedStoryDetail(id);
  if (!story) {
    notFound();
  }

  // Run AI analysis if not already performed
  const analysis = story.analysis || (await runAiStoryAnalysis(id));

  // Generate initial editorial draft preview
  const ai = getAIProvider();
  const draftPreview = await ai.generateDraft(story.title, story.description, analysis.suggestedCategory);

  return (
    <div className="space-y-8">
      {/* Top Header & Breadcrumbs */}
      <div>
        <Link href="/admin/ai-newsroom/inbox" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2">
          <ArrowLeft className="w-3 h-3" /> Back to Ingestion Inbox
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="category-badge text-[10px] uppercase mb-1">{story.category}</span>
            <h1 className="text-xl md:text-3xl font-extrabold text-white font-heading">{story.title}</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              Source: <strong className="text-brand-purple">{story.sourceName}</strong> · Published: {story.publishedAt}
              <a href={story.sourceUrl} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline inline-flex items-center gap-1 ml-2">
                Original Wire <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <form action={analyzeStoryAction}>
            <input type="hidden" name="storyId" value={story.id} />
            <button type="submit" className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-purple" /> Re-run AI Analysis
            </button>
          </form>
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

      {/* Prominent Mandatory Editorial Warning Banner */}
      <div className="bg-amber-500/10 border-2 border-amber-500/40 p-5 rounded-2xl flex items-start gap-4 text-xs text-amber-200">
        <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-300 font-heading uppercase tracking-wider">
            Mandatory Editorial Verification Required
          </h4>
          <p className="leading-relaxed text-amber-200/90">
            This is an AI-assisted draft. Editors MUST verify all facts, quotes, numbers, dates, names, and source attributions before submitting for review or publishing.
          </p>
        </div>
      </div>

      {/* Grid: Left Column (AI Story Analysis), Right Column (Draft Generator & Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Structured AI Fact Analysis */}
        <div className="lg:col-span-5 space-y-6">
          {/* Summary & Key Facts */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-cyan" /> Structured AI Analysis
            </h3>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Executive Summary</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-white/5">
                {analysis.summary}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Extracted Key Facts</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysis.keyFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-white/5">
                    <span className="text-brand-purple font-mono font-bold">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Factual Claims & Confidence */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Extracted Claims & Confidence
            </h3>
            <p className="text-[11px] text-slate-400 italic">
              AI-generated claim assessment — verify against source material before publication.
            </p>

            <div className="space-y-2">
              {analysis.claims.map((claimObj, idx) => (
                <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-white">{claimObj.claim}</strong>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      claimObj.confidence === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {claimObj.confidence}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Support: {claimObj.sourceSupport}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Flags */}
          {analysis.riskFlags && analysis.riskFlags.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Potential Editorial Risk Flags
              </h3>
              <ul className="space-y-1 text-xs text-amber-200">
                {analysis.riskFlags.map((flag, idx) => (
                  <li key={idx}>⚠️ {flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: AI Draft Generation & CMS Save Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-brand-purple" /> AI-Assisted Article Draft Editor
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Status: DRAFT Only
              </span>
            </div>

            <form action={createCmsDraftFromAiAction} className="space-y-4">
              <input type="hidden" name="storyId" value={story.id} />

              <div className="space-y-1">
                <label htmlFor="article-title" className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  Article Headline *
                </label>
                <input
                  id="article-title"
                  name="title"
                  type="text"
                  required
                  defaultValue={draftPreview.title}
                  className="w-full bg-navy-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="article-subtitle" className="text-xs text-slate-300 font-semibold">Subtitle / Dek</label>
                <input
                  id="article-subtitle"
                  name="subtitle"
                  type="text"
                  defaultValue={draftPreview.subtitle}
                  className="w-full bg-navy-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="article-category" className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                    <FolderTree className="w-3.5 h-3.5 text-brand-cyan" /> Category
                  </label>
                  <select
                    id="article-category"
                    name="categoryId"
                    defaultValue={draftPreview.suggestedCategory}
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
                    <option value="trending">Trending</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="article-author" className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-brand-purple" /> Assigned Author
                  </label>
                  <select
                    id="article-author"
                    name="authorId"
                    className="w-full bg-navy-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-purple focus:outline-none"
                  >
                    <option value="author-1">GenZ Live Editorial Staff</option>
                    <option value="author-2">Senior Tech Writer</option>
                    <option value="author-3">Global News Desk</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="article-excerpt" className="text-xs text-slate-300 font-semibold">Excerpt / SEO Summary</label>
                <textarea
                  id="article-excerpt"
                  name="excerpt"
                  rows={2}
                  defaultValue={draftPreview.excerpt}
                  className="w-full bg-navy-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-purple focus:outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="article-content" className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" /> Article Content (Editorial HTML) *
                </label>
                <textarea
                  id="article-content"
                  name="content"
                  rows={10}
                  required
                  defaultValue={draftPreview.content}
                  className="w-full bg-navy-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono leading-relaxed focus:border-brand-purple focus:outline-none"
                />
              </div>

              {/* Pre-submission Verification Checklist */}
              <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Pre-Submission Verification Checklist</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <label className="flex items-center gap-2"><input type="checkbox" required defaultChecked className="rounded accent-purple-600" /> Facts & figures verified</label>
                  <label className="flex items-center gap-2"><input type="checkbox" required defaultChecked className="rounded accent-purple-600" /> Direct quotes checked</label>
                  <label className="flex items-center gap-2"><input type="checkbox" required defaultChecked className="rounded accent-purple-600" /> Source URL attributed</label>
                  <label className="flex items-center gap-2"><input type="checkbox" required defaultChecked className="rounded accent-purple-600" /> Images rights confirmed</label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="submit" className="btn-primary text-xs py-3 px-8 shadow-glow-purple flex items-center gap-2">
                  <FileEdit className="w-4 h-4" /> Save as CMS Article Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
