'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '../src/components/Navbar';
import BreakingTicker from '../src/components/BreakingTicker';
import HeroSection from '../src/components/HeroSection';
import CategoryHub from '../src/components/CategoryHub';
import YouTubeLiveHub from '../src/components/YouTubeLiveHub';
import ArticleModal from '../src/components/ArticleModal';
import Newsletter from '../src/components/Newsletter';
import Footer from '../src/components/Footer';
import { ARTICLES, FEATURED_STORIES, YOUTUBE_VIDEOS } from '../src/data/newsData';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<string[]>(['f1', 'a1']);
  const [showLiveStreamModal, setShowLiveStreamModal] = useState(false);

  // Filter articles based on category and search query
  const filteredArticles = useMemo<any[]>(() => {
    return ARTICLES.filter((article: any) => {
      // Category Filter
      let matchesCategory = true;
      if (activeCategory === 'saved') {
        matchesCategory = savedIds.includes(article.id);
      } else if (activeCategory !== 'all') {
        matchesCategory = article.category === activeCategory;
      }

      // Search Query Filter
      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        matchesSearch =
          article.title.toLowerCase().includes(query) ||
          article.categoryName.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          (Boolean(article.subtitle) && String(article.subtitle).toLowerCase().includes(query));
      }

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, savedIds]);

  // Featured and secondary hero stories
  const featuredStory = FEATURED_STORIES[0];
  const secondaryStories = FEATURED_STORIES.slice(1, 4);

  // Related articles for open modal
  const relatedArticles = useMemo<any[]>(() => {
    if (!selectedStory) return [];
    return ARTICLES.filter((a: any) => a.id !== selectedStory.id && a.category === selectedStory.category);
  }, [selectedStory]);

  const handleToggleBookmark = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectHeadline = (headline: any) => {
    const match = ARTICLES.find((a: any) => a.id === headline.id) || {
      id: headline.id,
      title: headline.text,
      categoryName: headline.category,
      publishedAt: headline.time,
      author: 'GenZ Live Desk',
      readTime: '2 min read',
      views: '12.4k',
      likes: 890,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      content: `<p class="lead">${headline.text}</p><p>Stay tuned to GenZ Live for continuous live updates on this breaking news story.</p>`
    };
    setSelectedStory(match);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenLiveStream={() => setShowLiveStreamModal(true)}
        savedCount={savedIds.length}
      />

      {/* Real-time Breaking Ticker */}
      <BreakingTicker onSelectHeadline={handleSelectHeadline} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Spotlight Hero Section (shown when on All Feed and no active search) */}
        {activeCategory === 'all' && !searchQuery && (
          <HeroSection
            featuredStory={featuredStory}
            secondaryStories={secondaryStories}
            onSelectStory={setSelectedStory}
          />
        )}

        {/* Category News Grid */}
        <CategoryHub
          articles={filteredArticles}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSelectStory={setSelectedStory}
          savedIds={savedIds}
          onToggleBookmark={handleToggleBookmark}
        />

        {/* YouTube Channel & Live Media Section */}
        <YouTubeLiveHub />

        {/* Newsletter Subscription */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer setActiveCategory={setActiveCategory} />

      {/* Article Reader Modal */}
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

      {/* Live Stream Quick Modal */}
      {showLiveStreamModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="live-pulse">LIVE BROADCAST</span>
                <h3 className="text-sm font-bold text-white">GenZ Live — 24/7 Global Stream</h3>
              </div>
              <button
                onClick={() => setShowLiveStreamModal(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
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
