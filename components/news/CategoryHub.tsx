'use client';

import React from 'react';
import { Bookmark, Clock, Eye, ArrowRight, Sparkles, SearchX } from 'lucide-react';
import { NAV_CATEGORIES } from '@/config/site';
import type { CategoryHubProps } from '@/types';

export default function CategoryHub({
  articles, activeCategory, setActiveCategory,
  searchQuery, onSelectStory, savedIds, onToggleBookmark,
}: CategoryHubProps) {
  const activeLabel = activeCategory === 'saved'
    ? 'Saved Articles'
    : activeCategory === 'all'
    ? 'Latest News Feed'
    : NAV_CATEGORIES.find(c => c.id === activeCategory)?.name ?? 'Category';

  return (
    <section className="py-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h2 className="text-xl md:text-2xl font-extrabold text-white">{activeLabel}</h2>
            </div>
            <p className="text-xs text-slate-400">
              {searchQuery ? `Showing results for "${searchQuery}"` : 'Real-time coverage curated for digital natives'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {NAV_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto my-12">
            <SearchX className="w-12 h-12 text-slate-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">No articles found</h3>
            <p className="text-xs text-slate-400">
              {activeCategory === 'saved'
                ? "You haven't bookmarked any articles yet."
                : "Try adjusting your search query."}
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 bg-purple-600 text-white rounded-full text-xs font-bold hover:bg-purple-500 transition-colors"
            >
              Back to All Feed
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const isSaved = savedIds.includes(article.id);
              return (
                <article
                  key={article.id}
                  className="glass-panel group overflow-hidden flex flex-col justify-between border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div onClick={() => onSelectStory(article)} className="relative h-48 overflow-hidden cursor-pointer">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="category-badge text-[10px]">{article.categoryName}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleBookmark(article.id); }}
                          className={`p-2 rounded-full backdrop-blur-md border transition-all ${isSaved ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/50' : 'bg-slate-900/70 border-white/20 text-slate-300 hover:text-white'}`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 text-[11px] text-slate-300 font-mono flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-md border border-white/10">
                        <Clock className="w-3 h-3 text-purple-400" /> {article.publishedAt}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3
                        onClick={() => onSelectStory(article)}
                        className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {article.title}
                      </h3>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">{article.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-cyan-400" /> {article.views}</span>
                      <button onClick={() => onSelectStory(article)} className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
