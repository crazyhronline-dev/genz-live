'use client';

import React from 'react';
import { Clock, Eye, ArrowUpRight, Sparkles } from 'lucide-react';
import type { Article } from '@/types';

interface HeroStoryProps {
  article: Article;
  onSelect: (article: Article) => void;
  variant?: 'large' | 'small';
}

export default function HeroStory({ article, onSelect, variant = 'large' }: HeroStoryProps) {
  if (variant === 'small') {
    return (
      <div
        onClick={() => onSelect(article)}
        className="glass-panel p-4 flex gap-4 items-center group cursor-pointer hover:bg-slate-800/80 transition-all"
      >
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          decoding="async"
          width="96"
          height="96"
          className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform border border-white/10"
        />
        <div className="flex-1 space-y-1.5 min-w-0">
          <span className="category-badge text-[10px] py-0.5 px-2">{article.categoryName}</span>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-brand-purple transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
            <span>{article.publishedAt}</span>
            <span className="flex items-center gap-1 text-brand-purple font-medium">
              Read <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Large featured hero — LCP target element
  return (
    <div
      onClick={() => onSelect(article)}
      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-navy-surface shadow-glass cursor-pointer hover:border-brand-purple/50 transition-all duration-300 min-h-[460px] flex flex-col justify-end p-6 md:p-8"
    >
      {/* Background Image — fetchpriority="high" & loading="eager" for maximum LCP score */}
      <div className="absolute inset-0 z-0">
        <img
          src={article.image}
          alt={article.title}
          loading="eager"
          // @ts-expect-error React 19 fetchPriority attribute support
          fetchpriority="high"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      {/* Badges */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="live-pulse"><Sparkles className="w-3 h-3 text-white" /> SPOTLIGHT</span>
          <span className="category-badge">{article.categoryName}</span>
        </div>
        <span className="text-xs text-slate-300 font-mono bg-slate-900/80 px-3 py-1 rounded-full border border-white/10">
          {article.publishedAt}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-3">
        <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight group-hover:text-purple-200 transition-colors font-heading">
          {article.title}
        </h2>
        {article.subtitle && (
          <p className="text-sm md:text-base text-slate-300 line-clamp-2 max-w-3xl">{article.subtitle}</p>
        )}

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            {article.authorAvatar && (
              <img
                src={article.authorAvatar}
                alt={article.author}
                loading="lazy"
                decoding="async"
                width="32"
                height="32"
                className="w-8 h-8 rounded-full border border-brand-purple/50 object-cover"
              />
            )}
            <div>
              <span className="font-bold text-white block">{article.author}</span>
              {article.authorRole && <span className="text-[11px] text-brand-purple">{article.authorRole}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-purple" /> {article.readTime}</span>
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-brand-cyan" /> {article.views}</span>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-purple group-hover:bg-purple-500 text-white font-bold text-xs shadow-glow-purple transition-all">
              Read Story <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
