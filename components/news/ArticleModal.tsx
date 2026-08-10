'use client';

import React, { useEffect } from 'react';
import {
  X, Bookmark, Share2, Clock, Eye, Sparkles, Check, BookOpen, User,
} from 'lucide-react';
import type { Article } from '@/types';
import { SITE_CONFIG } from '@/config/site';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  isSaved?: boolean;
  onToggleBookmark?: (id: string) => void;
  onSelectRelated?: (article: Article) => void;
  relatedArticles?: Article[];
}

export default function ArticleModal({
  article,
  onClose,
  isSaved = false,
  onToggleBookmark,
  onSelectRelated,
  relatedArticles = [],
}: ArticleModalProps) {
  const [copied, setCopied] = React.useState(false);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.subtitle ?? article.title, url });
      } catch {
        // Fallback to clipboard
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Modal Overlay */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-navy-surface border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10 my-auto">
        {/* Header Bar */}
        <div className="bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="category-badge text-[10px]">{article.categoryName}</span>
            <span className="hidden sm:inline text-xs text-slate-400 font-mono">• {article.readTime}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(article.id)}
                className={`p-2 rounded-full border transition-all ${
                  isSaved
                    ? 'bg-brand-purple border-brand-purple text-white shadow-glow-purple'
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
                }`}
                aria-label={isSaved ? 'Saved' : 'Save article'}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-xs px-3"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Article Header */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading leading-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                {article.authorAvatar ? (
                  <img src={article.authorAvatar} alt={article.author} className="w-9 h-9 rounded-full object-cover border border-brand-purple/50" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                )}
                <div>
                  <span className="font-bold text-white block">{article.author}</span>
                  <span className="text-[11px] text-brand-purple">{article.authorRole ?? 'Staff Writer'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-purple" /> {article.publishedAt}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-brand-cyan" /> {article.views} views</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
            <img
              src={article.image}
              alt={article.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Content */}
          <div
            className="prose-genz"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Author Box */}
          <div className="section-card flex items-center gap-4 bg-slate-950/60">
            <div className="w-12 h-12 rounded-full bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-brand-purple" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{SITE_CONFIG.name} Desk</h4>
              <p className="text-xs text-slate-400 mt-0.5">Independent journalism covering World, Tech, AI, India & Culture for GenZ.</p>
            </div>
          </div>

          {/* Related Stories */}
          {relatedArticles.length > 0 && onSelectRelated && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
                <BookOpen className="w-4 h-4 text-brand-purple" /> Related Stories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.slice(0, 2).map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="glass-panel p-3 flex gap-3 items-center text-left group hover:border-brand-purple/40 transition-all"
                  >
                    <img src={rel.image} alt={rel.title} className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-brand-purple uppercase">{rel.categoryName}</span>
                      <p className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-2 leading-snug">{rel.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
