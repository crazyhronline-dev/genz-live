'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BreakingTicker from '@/components/news/BreakingTicker';
import CategoryHub from '@/components/news/CategoryHub';
import ArticleModal from '@/components/news/ArticleModal';
import { ARTICLES } from '@/lib/newsData';
import { NAV_CATEGORIES } from '@/config/site';
import type { Article } from '@/types';

interface CategoryPageClientProps {
  category: string;
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const [activeCategory, setActiveCategory] = useState(category);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<Article | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const catMeta = NAV_CATEGORIES.find(c => c.id === category);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(a => {
      const matchCat = activeCategory === 'all' || a.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const relatedArticles = useMemo(() => {
    if (!selectedStory) return [];
    return ARTICLES.filter(a => a.id !== selectedStory.id && a.category === selectedStory.category);
  }, [selectedStory]);

  const handleToggleBookmark = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col">
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenLiveStream={() => {}}
        savedCount={savedIds.length}
      />

      <BreakingTicker />

      {/* Category Hero Banner */}
      <div className="bg-navy-surface border-b border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{catMeta?.icon ? '' : '📰'}</span>
            <div>
              <p className="text-xs font-mono text-brand-purple uppercase tracking-widest mb-1">GenZ Live / Category</p>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading">{catMeta?.name ?? category}</h1>
              <p className="text-slate-400 mt-1 text-sm">Live coverage • Real-time updates • Unfiltered perspective</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <CategoryHub
          articles={filteredArticles}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSelectStory={setSelectedStory}
          savedIds={savedIds}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>

      <Footer setActiveCategory={setActiveCategory} />

      {selectedStory && (
        <ArticleModal
          article={selectedStory}
          onClose={() => setSelectedStory(null)}
          isSaved={savedIds.includes(selectedStory.id)}
          onToggleBookmark={handleToggleBookmark}
          onSelectRelated={setSelectedStory}
          relatedArticles={relatedArticles}
        />
      )}
    </div>
  );
}
