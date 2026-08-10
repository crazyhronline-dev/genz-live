'use client';

import React from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import type { Article } from '@/types';

interface TrendingProps {
  articles: Article[];
  onSelect: (article: Article) => void;
  maxItems?: number;
  title?: string;
}

export default function Trending({
  articles,
  onSelect,
  maxItems = 5,
  title = 'Trending Now',
}: TrendingProps) {
  const displayed = articles.slice(0, maxItems);

  return (
    <aside className="card-glass p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/8">
        <Flame className="w-4 h-4 text-brand-orange" />
        <h3 className="text-sm font-extrabold text-white font-heading">{title}</h3>
        <span className="ml-auto badge-live text-[10px] py-0.5 px-2">HOT</span>
      </div>

      {/* Article List */}
      <ol className="space-y-3">
        {displayed.map((article, idx) => (
          <li key={article.id}>
            <button
              onClick={() => onSelect(article)}
              className="w-full flex items-start gap-3 text-left group"
            >
              {/* Rank Number */}
              <span className={`text-xl font-extrabold shrink-0 mt-0.5 w-7 text-right leading-none ${
                idx === 0 ? 'text-brand-orange' :
                idx === 1 ? 'text-brand-purple' :
                idx === 2 ? 'text-brand-cyan' :
                'text-slate-600'
              }`}>
                {idx + 1}
              </span>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{article.categoryName}</span>
                <p className="text-xs font-bold text-slate-200 group-hover:text-brand-purple transition-colors line-clamp-2 leading-snug mt-0.5">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <TrendingUp className="w-3 h-3 text-brand-cyan" />
                  <span>{article.views} views</span>
                </div>
              </div>
            </button>

            {idx < displayed.length - 1 && (
              <div className="mt-3 h-px bg-white/5" />
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}
