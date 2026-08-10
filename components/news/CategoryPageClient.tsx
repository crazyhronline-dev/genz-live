'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, BookOpen, Layers } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakingNews from '@/components/news/BreakingNews';
import ArticleCard, { LargeArticleCard } from '@/components/news/ArticleCard';
import Trending from '@/components/news/Trending';
import ArticleModal from '@/components/news/ArticleModal';
import AdSlot from '@/components/ui/AdSlot';
import { ARTICLES, BREAKING_HEADLINES } from '@/lib/newsData';
import { NAV_CATEGORIES, SITE_CONFIG } from '@/config/site';
import type { Article } from '@/types';

interface CategoryPageClientProps {
  category: string;
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<Article | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const catMeta = NAV_CATEGORIES.find(c => c.id === category);
  const catName = catMeta?.name.replace(/^[\p{Emoji}\s]+/u, '').trim() ?? category;

  const categoryArticles = useMemo(() => {
    return ARTICLES.filter(a => {
      const matchCat = category === 'all' || a.category === category;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, searchQuery]);

  const featuredStory = categoryArticles[0];
  const remainingArticles = categoryArticles.slice(1);
  const trendingArticles = ARTICLES.slice(0, 5);

  const relatedArticles = useMemo(() => {
    if (!selectedStory) return [];
    return ARTICLES.filter(a => a.id !== selectedStory.id && a.category === selectedStory.category);
  }, [selectedStory]);

  const handleToggleBookmark = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <Header activeCategory={category} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <BreakingNews headlines={BREAKING_HEADLINES} />

      {/* Category Hero Banner */}
      <div className="bg-navy-surface border-b border-white/5 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-brand-purple font-bold">{catName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-brand-cyan uppercase tracking-widest mb-1">{SITE_CONFIG.name} / Category Coverage</p>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading">{catName}</h1>
              <p className="text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
                Real-time coverage, in-depth reports, and live analysis on {catName} curated for digital natives.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/10 shrink-0">
              <Layers className="w-4 h-4 text-brand-purple" />
              <span>{categoryArticles.length} Stories Available</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-10">
        {/* Category Featured Large Story */}
        {featuredStory && (
          <section aria-label="Featured category story">
            <LargeArticleCard
              article={featuredStory}
              onSelect={setSelectedStory}
              isSaved={savedIds.includes(featuredStory.id)}
              onToggleBookmark={handleToggleBookmark}
            />
          </section>
        )}

        {/* Ad Placeholder */}
        <div className="flex justify-center my-4">
          <AdSlot size="leaderboard" slotId={`cat-${category}-top`} />
        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white font-heading">Latest in {catName}</h2>
              <span className="text-xs font-mono text-slate-400">Sorted by Date</span>
            </div>

            {remainingArticles.length === 0 ? (
              <div className="glass-panel p-12 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No more stories in this category</h3>
                <p className="text-xs text-slate-400">Check back soon for new updates.</p>
                <Link href="/" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {remainingArticles.map(article => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onSelect={setSelectedStory}
                    isSaved={savedIds.includes(article.id)}
                    onToggleBookmark={handleToggleBookmark}
                    variant="grid"
                  />
                ))}
              </div>
            )}

            {/* Pagination-ready control bar */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <button disabled className="btn-secondary text-xs opacity-50 cursor-not-allowed">Previous Page</button>
              <span className="font-mono">Page 1 of 1</span>
              <button disabled className="btn-secondary text-xs opacity-50 cursor-not-allowed">Next Page</button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <Trending articles={trendingArticles} onSelect={setSelectedStory} />
            <AdSlot size="sidebar" slotId={`cat-${category}-sidebar`} className="w-full" />
          </aside>
        </div>
      </main>

      <Footer />

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
