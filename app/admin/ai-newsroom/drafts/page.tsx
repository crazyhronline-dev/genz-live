import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileEdit, ArrowLeft, Eye, ShieldAlert } from 'lucide-react';
import { getCmsArticles } from '@/lib/cmsData';

export const metadata: Metadata = {
  title: 'AI Drafts Queue — GenZ Live Admin',
  robots: { index: false, follow: false },
};

export default async function AiDraftsPage() {
  // Fetch drafts
  const draftsData = await getCmsArticles({ status: 'DRAFT', limit: 20 });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/ai-newsroom" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2">
          <ArrowLeft className="w-3 h-3" /> Back to AI Newsroom
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading flex items-center gap-2">
          <FileEdit className="w-6 h-6 text-brand-purple" /> AI Drafts Review Queue
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review and edit AI-assisted article drafts before submitting for editorial review or publication.
        </p>
      </div>

      {/* Safety Reminder */}
      <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl flex items-center gap-3 text-xs text-purple-200">
        <ShieldAlert className="w-5 h-5 text-brand-purple shrink-0" />
        <span>
          <strong>Provenance Tracking:</strong> All AI-generated drafts maintain strict source attribution and internal AI job metadata. No AI draft can bypass human editorial review.
        </span>
      </div>

      {/* Drafts Section */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-4">
        <div className="p-4 bg-slate-900/60 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-emerald-400" /> Draft Articles ({draftsData.total})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="p-4">Title / Headline</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {draftsData.articles.map(art => (
                <tr key={art.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-white block text-sm mb-0.5">{art.title}</span>
                    <span className="text-[11px] text-slate-400">{art.excerpt?.slice(0, 80)}...</span>
                  </td>
                  <td className="p-4 capitalize text-slate-300 font-mono">{art.categoryName}</td>
                  <td className="p-4 text-slate-300">{art.authorName}</td>
                  <td className="p-4">
                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      DRAFT
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/articles`} className="btn-secondary text-[11px] py-1 px-3 inline-flex items-center gap-1">
                      <Eye className="w-3 h-3 text-brand-purple" /> Edit in CMS Editor
                    </Link>
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
