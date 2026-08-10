'use client';

import React from 'react';
import { Bookmark, Clock, Eye, ArrowRight } from 'lucide-react';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  isSaved?: boolean;
  onToggleBookmark?: (id: string) => void;
  variant?: 'grid' | 'list' | 'compact';
}

export default function ArticleCard({
  article,
  onSelect,
  isSaved = false,
  onToggleBookmark,
  variant = 'grid',
}: ArticleCardProps) {
  if (variant === 'compact') {
    return (
      <button
        onClick={() => onSelect(article)}
        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 transition-all group text-left"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-14 h-14 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
        />
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-brand-purple uppercase">{article.categoryName}</span>
          <p className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-2 leading-snug mt-0.5">{article.title}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{article.publishedAt}</p>
        </div>
      </button>
    );
  }

  if (variant === 'list') {
    return (
      <div
        onClick={() => onSelect(article)}
        className="glass-panel flex gap-4 items-center p-4 group cursor-pointer hover:border-brand-purple/40 transition-all"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform border border-white/10"
        />
        <div className="flex-1 min-w-0 space-y-1.5">
          <span className="category-badge text-[10px]">{article.categoryName}</span>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-brand-purple transition-colors line-clamp-2">{article.title}</h3>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{article.author} · {article.publishedAt}</span>
            <span className="flex items-center gap-1 text-brand-cyan font-medium">
              Read <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default: grid variant
  return (
    <article className="glass-panel group overflow-hidden flex flex-col border border-white/10 hover:border-brand-purple/40 transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div onClick={() => onSelect(article)} className="relative h-48 overflow-hidden cursor-pointer">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Top overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="category-badge text-[10px]">{article.categoryName}</span>
          {onToggleBookmark && (
            <button
              id={`bookmark-${article.id}`}
              onClick={e => { e.stopPropagation(); onToggleBookmark(article.id); }}
              aria-label={isSaved ? 'Remove bookmark' : 'Save article'}
              className={`p-1.5 rounded-full backdrop-blur-md border transition-all ${
                isSaved
                  ? 'bg-brand-purple border-brand-purple/50 text-white shadow-glow-purple'
                  : 'bg-slate-900/70 border-white/20 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Published timestamp */}
        <div className="absolute bottom-3 left-3 text-[11px] text-slate-300 font-mono flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-md border border-white/10">
          <Clock className="w-3 h-3 text-brand-purple" /> {article.publishedAt}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <h3
          onClick={() => onSelect(article)}
          className="text-sm font-bold text-white group-hover:text-brand-purple transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {article.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span className="font-medium text-slate-300">{article.author}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-brand-cyan" /> {article.views}
            </span>
            <button
              onClick={() => onSelect(article)}
              className="flex items-center gap-1 text-brand-purple hover:text-purple-300 font-bold"
            >
              Read <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
