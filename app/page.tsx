'use client';

import React, { useState, useMemo } from 'react';

// Layout components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// News components
import BreakingTicker from '@/components/news/BreakingTicker';
import HeroSection from '@/components/news/HeroSection';
import CategoryHub from '@/components/news/CategoryHub';

// Media components
import YouTubeLiveHub from '@/components/media/YouTubeLiveHub';

// UI components
import Newsletter from '@/components/ui/Newsletter';

// Article reader (self-contained, includes modal logic)
import ArticleModal from '@/components/news/ArticleModal';

// Data & types
import { ARTICLES, FEATURED_STORIES, YOUTUBE_VIDEOS } from '@/lib/newsData';
import type { Article, BreakingHeadline } from '@/types';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<Article | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(['f1', 'a1']);
  const [showLiveStreamModal, setShowLiveStreamModal] = useState(false);

  const filteredArticles = useMemo<Article[]>(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        activeCategory === 'saved' ? savedIds.includes(article.id) :
        activeCategory === 'all'   ? true :
        article.category === activeCategory;

      const matchesSearch = searchQuery.trim() === '' || (() => {
        const q = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(q) ||
          article.categoryName.toLowerCase().includes(q) ||
          article.author.toLowerCase().includes(q) ||
          Boolean(article.subtitle?.toLowerCase().includes(q))
        );
      })();

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, savedIds]);

  const featuredStory = FEATURED_STORIES[0];
  const secondaryStories = FEATURED_STORIES.slice(1, 4);

  const relatedArticles = useMemo<Article[]>(() => {
    if (!selectedStory) return [];
    return ARTICLES.filter(a => a.id !== selectedStory.id && a.category === selectedStory.category);
  }, [selectedStory]);

  const handleToggleBookmark = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectHeadline = (headline: BreakingHeadline) => {
    const match = ARTICLES.find(a => a.id === headline.id) ?? {
      id: headline.id,
      title: headline.text,
      categoryName: headline.category,
      category: headline.category.toLowerCase(),
      publishedAt: headline.time,
      author: 'GenZ Live Desk',
      readTime: '2 min read',
      views: '12.4k',
      likes: 890,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      content: `<p>${headline.text}</p><p>Stay tuned to GenZ Live for continuous live updates on this breaking news story.</p>`,
    };
    setSelectedStory(match);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenLiveStream={() => setShowLiveStreamModal(true)}
        savedCount={savedIds.length}
      />

      <BreakingTicker onSelectHeadline={handleSelectHeadline} />

      <main className="flex-1">
        {activeCategory === 'all' && !searchQuery && (
          <HeroSection
            featuredStory={featuredStory}
            secondaryStories={secondaryStories}
            onSelectStory={setSelectedStory}
          />
        )}

        <CategoryHub
          articles={filteredArticles}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSelectStory={setSelectedStory}
          savedIds={savedIds}
          onToggleBookmark={handleToggleBookmark}
        />

        <YouTubeLiveHub />

        <Newsletter />
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

      {showLiveStreamModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="live-pulse">LIVE BROADCAST</span>
                <h3 className="text-sm font-bold text-white">GenZ Live — 24/7 Global Stream</h3>
              </div>
              <button onClick={() => setShowLiveStreamModal(false)} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEOS[0].embedId}?autoplay=1`}
                title="GenZ Live Broadcast"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
