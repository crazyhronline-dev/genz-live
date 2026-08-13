'use client';

// ================================================================
// GenZ Live — Internal Link Recommendation Widget
// Interactive CMS widget suggesting relevant internal article links.
// ================================================================

import React from 'react';
import { Link2, ExternalLink } from 'lucide-react';

interface InternalLinkSuggesterProps {
  suggestions?: Array<{
    targetArticleId: string;
    targetTitle: string;
    targetUrl: string;
    recommendedAnchorText: string;
    relevanceScore: number;
    reason: string;
  }>;
}

export default function InternalLinkSuggester({ suggestions = [] }: InternalLinkSuggesterProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-xl">
      <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
        <Link2 className="w-4 h-4 text-violet-400" /> Recommended Internal Links
      </h3>
      <p className="text-[11px] text-slate-400">Add contextual internal links to related GenZ Live stories to boost SEO crawl depth and audience retention.</p>

      <div className="space-y-2">
        {suggestions.map((s, idx) => (
          <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded text-xs flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-white font-semibold truncate">{s.targetTitle}</p>
              <span className="text-[10px] text-slate-400">Reason: {s.reason}</span>
            </div>
            <a
              href={s.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold rounded flex items-center gap-1 shrink-0"
            >
              View <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
