'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ChevronRight } from 'lucide-react';
import type { BreakingHeadline } from '@/types';
import { BREAKING_HEADLINES } from '@/lib/newsData';

interface BreakingNewsProps {
  headlines?: BreakingHeadline[];
  onSelectHeadline?: (headline: BreakingHeadline) => void;
}

function getHeadlineHref(item: BreakingHeadline): string {
  if (item.url) return item.url;
  const rawCat = item.category || 'all';
  const catSlug = rawCat.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (item.slug) return `/${catSlug}/${item.slug}`;
  return `/${catSlug}`;
}

export default function BreakingNews({
  headlines = BREAKING_HEADLINES,
  onSelectHeadline,
}: BreakingNewsProps) {
  // Triple headlines array for a 100% seamless, continuous 3-set infinite marquee loop
  const displayHeadlines = [...headlines, ...headlines, ...headlines];

  return (
    <div className="bg-slate-900/95 border-b border-brand-purple/20 py-2 sm:py-2.5 overflow-hidden" role="marquee" aria-label="Breaking news ticker">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center gap-2 sm:gap-3">
        {/* Label */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-red-600/25 border border-red-500/50 text-red-400 font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider rounded-md shrink-0 z-10 shadow-md">
          <Flame className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-pulse text-red-500" />
          BREAKING
        </div>

        {/* Ticker */}
        <div className="ticker-wrap flex-1 overflow-hidden relative">
          <div className="ticker-move flex items-center gap-5 sm:gap-8">
            {displayHeadlines.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={getHeadlineHref(item)}
                onClick={() => onSelectHeadline?.(item)}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-200 hover:text-brand-purple active:text-brand-purple transition-colors group cursor-pointer whitespace-nowrap shrink-0"
              >
                <span className="text-brand-purple font-mono text-[9px] sm:text-[10px] uppercase px-1.5 py-0.5 bg-purple-950/70 border border-purple-800/50 rounded shrink-0">
                  {item.category}
                </span>
                <span>{item.text}</span>
                <span className="text-slate-500 text-[9px] sm:text-[10px]">({item.time})</span>
                <ChevronRight className="w-3 h-3 text-brand-purple group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
