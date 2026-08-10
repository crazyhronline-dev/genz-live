'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Clock, Eye, ArrowRight, Play, TrendingUp } from 'lucide-react';
import type { Article, YouTubeVideo } from '@/types';

export interface ArticleCardProps {
  article: Article;
  onSelect?: (article: Article) => void;
  isSaved?: boolean;
  onToggleBookmark?: (id: string) => void;
  variant?: 'grid' | 'list' | 'compact' | 'large' | 'medium' | 'small';
}

/** Standard ArticleCard with variant switching */
export default function ArticleCard({
  article,
  onSelect,
  isSaved = false,
  onToggleBookmark,
  variant = 'grid',
}: ArticleCardProps) {
  if (variant === 'compact' || variant === 'small') {
    return <SmallArticleCard article={article} onSelect={onSelect} />;
  }

  if (variant === 'list' || variant === 'medium') {
    return <MediumArticleCard article={article} onSelect={onSelect} />;
  }

  if (variant === 'large') {
    return <LargeArticleCard article={article} onSelect={onSelect} isSaved={isSaved} onToggleBookmark={onToggleBookmark} />;
  }

  const href = `/${article.category}/${article.id}`;
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(article);
    }
  };

  // Default: Grid Card
  return (
    <article className="glass-panel group overflow-hidden flex flex-col border border-white/10 hover:border-brand-purple/40 transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <Link href={href} onClick={handleClick} className="relative h-48 overflow-hidden cursor-pointer block">
        <Image
          src={article.image}
          alt={article.title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Top overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="category-badge text-[10px]">{article.categoryName}</span>
          {onToggleBookmark && (
            <button
              id={`bookmark-${article.id}`}
              onClick={e => { e.stopPropagation(); e.preventDefault(); onToggleBookmark(article.id); }}
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
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <h3 className="text-sm font-bold text-white group-hover:text-brand-purple transition-colors line-clamp-2 cursor-pointer leading-snug">
          <Link href={href} onClick={handleClick}>{article.title}</Link>
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span className="font-medium text-slate-300">{article.author}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-brand-cyan" /> {article.views}
            </span>
            <Link href={href} onClick={handleClick} className="flex items-center gap-1 text-brand-purple hover:text-purple-300 font-bold">
              Read <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/** 1. LargeArticleCard — Prominent card with subtitle & large thumbnail */
export function LargeArticleCard({ article, onSelect }: ArticleCardProps) {
  const href = `/${article.category}/${article.id}`;
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(article);
    }
  };

  return (
    <article className="glass-panel group overflow-hidden border border-white/10 hover:border-brand-purple/40 transition-all duration-300 flex flex-col md:flex-row gap-6 p-6">
      <Link href={href} onClick={handleClick} className="relative md:w-1/2 h-64 md:h-auto rounded-xl overflow-hidden cursor-pointer shrink-0 block">
        <Image
          src={article.image}
          alt={article.title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 category-badge text-[10px]">{article.categoryName}</span>
      </Link>
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{article.author}</span>
            <span>{article.publishedAt}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white group-hover:text-brand-purple transition-colors cursor-pointer leading-snug font-heading">
            <Link href={href} onClick={handleClick}>{article.title}</Link>
          </h2>
          {article.subtitle && (
            <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">{article.subtitle}</p>
          )}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
          <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3.5 h-3.5 text-brand-purple" /> {article.readTime}</span>
          <Link href={href} onClick={handleClick} className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
            Read Full Article <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** 2. MediumArticleCard — Row layout card */
export function MediumArticleCard({ article, onSelect }: ArticleCardProps) {
  const href = `/${article.category}/${article.id}`;
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(article);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="glass-panel flex gap-4 items-center p-4 group cursor-pointer hover:border-brand-purple/40 transition-all block"
    >
      <div className="relative w-24 h-24 shrink-0">
        <Image
          src={article.image}
          alt={article.title}
          fill
          loading="lazy"
          sizes="96px"
          className="rounded-xl object-cover group-hover:scale-105 transition-transform border border-white/10"
        />
      </div>
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
    </Link>
  );
}

/** 3. SmallArticleCard / CompactArticleCard — Compact thumbnail + headline button */
export function SmallArticleCard({ article, onSelect }: ArticleCardProps) {
  const href = `/${article.category}/${article.id}`;
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(article);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 transition-all group text-left block"
    >
      <div className="relative w-14 h-14 shrink-0">
        <Image
          src={article.image}
          alt={article.title}
          fill
          loading="lazy"
          sizes="56px"
          className="rounded-lg object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-brand-purple uppercase">{article.categoryName}</span>
        <p className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-2 leading-snug mt-0.5">{article.title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{article.publishedAt}</p>
      </div>
    </Link>
  );
}

export const CompactArticleCard = SmallArticleCard;

/** 4. TrendingCard — Numbered rank card (01, 02, etc.) */
export function TrendingCard({ article, rank, onSelect }: { article: Article; rank: number; onSelect?: (article: Article) => void }) {
  const href = `/${article.category}/${article.id}`;
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(article);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="w-full flex items-start gap-3 text-left group p-2 rounded-xl hover:bg-slate-800/40 transition-colors block"
    >
      <span className={`text-xl font-extrabold shrink-0 mt-0.5 w-7 text-right leading-none ${
        rank === 1 ? 'text-brand-orange' :
        rank === 2 ? 'text-brand-purple' :
        rank === 3 ? 'text-brand-cyan' :
        'text-slate-600'
      }`}>
        {rank < 10 ? `0${rank}` : rank}
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
    </Link>
  );
}

/** 5. VideoCard — Lightweight video card with play icon */
export function VideoCard({ video, onSelect }: { video: YouTubeVideo; onSelect?: (video: YouTubeVideo) => void }) {
  return (
    <div
      onClick={() => onSelect?.(video)}
      className="glass-panel group overflow-hidden cursor-pointer border border-white/10 hover:border-red-500/40 transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden bg-slate-900">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
        <div className="absolute top-3 left-3">
          {video.isLive
            ? <span className="live-pulse">LIVE</span>
            : <span className="px-2.5 py-1 bg-slate-900/80 text-[10px] font-bold text-white rounded-md border border-white/10">{video.duration}</span>
          }
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">{video.title}</h4>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{video.views}</span>
          <span>{video.published}</span>
        </div>
      </div>
    </div>
  );
}
