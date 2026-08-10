'use client';

import React from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import type { BreakingHeadline } from '@/types';
import { BREAKING_HEADLINES } from '@/lib/newsData';

interface BreakingNewsProps {
  headlines?: BreakingHeadline[];
  onSelectHeadline?: (headline: BreakingHeadline) => void;
}

export default function BreakingNews({
  headlines = BREAKING_HEADLINES,
  onSelectHeadline,
}: BreakingNewsProps) {
  return (
    <div className="bg-slate-900/90 border-b border-brand-purple/20 py-2.5 overflow-hidden" role="marquee" aria-label="Breaking news ticker">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Label */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600/20 border border-red-500/40 text-red-400 font-extrabold text-[11px] uppercase tracking-wider rounded-md shrink-0">
          <Flame className="w-3.5 h-3.5 animate-pulse text-red-500" />
          BREAKING
        </div>

        {/* Ticker */}
        <div className="ticker-wrap flex-1 overflow-hidden">
          <div className="ticker-move flex items-center gap-8">
            {headlines.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHeadline?.(item)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-brand-purple transition-colors group cursor-pointer whitespace-nowrap"
              >
                <span className="text-brand-purple font-mono text-[10px] uppercase px-1.5 py-0.5 bg-purple-950/60 border border-purple-800/40 rounded">
                  {item.category}
                </span>
                {item.text}
                <span className="text-slate-500 text-[10px]">({item.time})</span>
                <ChevronRight className="w-3 h-3 text-brand-purple group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
