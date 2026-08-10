'use client';

import React from 'react';
import { Sparkles, SearchX } from 'lucide-react';
import ArticleCard from '@/components/news/ArticleCard';
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
    <section className="py-8 border-t border-white/5" aria-label={activeLabel}>
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <h2 className="text-xl md:text-2xl font-extrabold text-white font-heading">{activeLabel}</h2>
            </div>
            <p className="text-xs text-slate-400">
              {searchQuery ? `Results for "${searchQuery}"` : 'Real-time coverage curated for digital natives'}
            </p>
          </div>

          {/* Inline Category Filters (mobile/tablet) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar lg:hidden">
            {NAV_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-brand-purple text-white shadow-glow-purple'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {articles.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto my-12">
            <SearchX className="w-12 h-12 text-slate-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">No articles found</h3>
            <p className="text-xs text-slate-400">
              {activeCategory === 'saved'
                ? "You haven't bookmarked any articles yet."
                : 'Try adjusting your search or browse a different category.'}
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="btn-primary text-xs"
            >
              Back to All Feed
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelect={onSelectStory}
                isSaved={savedIds.includes(article.id)}
                onToggleBookmark={onToggleBookmark}
                variant="grid"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
