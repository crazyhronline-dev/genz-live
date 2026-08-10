import React from 'react';
import nextDynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakingNews from '@/components/news/BreakingNews';
import HeroSection from '@/components/news/HeroSection';
import CategoryHub from '@/components/news/CategoryHub';
import CategorySection from '@/components/news/CategorySection';
import Trending from '@/components/news/Trending';
import AdSlot from '@/components/ui/AdSlot';
import { buildPageMetadata } from '@/lib/seo';
import {
  getBreakingNews,
  getFeaturedArticles,
  getLatestArticles,
  getCategoryArticles,
  getTrendingArticles,
} from '@/lib/dataAccess';

// Lazy-load heavy below-the-fold components to reduce initial JS bundle
const YouTubeLiveHub = nextDynamic(() => import('@/components/media/YouTubeLiveHub'), {
  loading: () => <div className="h-64 animate-pulse bg-slate-900/50 rounded-2xl mx-4" />,
});
const Newsletter = nextDynamic(() => import('@/components/ui/Newsletter'), {
  loading: () => <div className="h-32 animate-pulse bg-slate-900/50 rounded-2xl mx-4" />,
});


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = buildPageMetadata({
  title: 'GenZ Live — The Voice of GenZ',
  description: 'GenZ Live is a global digital news platform covering World, India, Technology, AI, Business, Markets, Entertainment, Sports and Culture news. Stay informed with the stories that matter to your generation.',
  canonicalPath: '',
});

export default async function HomePage() {
  // Server-side data access engine
  const [
    breakingHeadlines,
    heroData,
    latestArticles,
    worldArticles,
    indiaArticles,
    techArticles,
    aiArticles,
    trendingArticles,
  ] = await Promise.all([
    getBreakingNews(),
    getFeaturedArticles(),
    getLatestArticles(6),
    getCategoryArticles('world', 3),
    getCategoryArticles('india', 3),
    getCategoryArticles('technology', 3),
    getCategoryArticles('ai', 3),
    getTrendingArticles(5),
  ]);

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Header */}
      <Header activeCategory="all" />

      {/* Breaking News Ticker */}
      <BreakingNews headlines={breakingHeadlines} />

      {/* Top Leaderboard Ad Placeholder */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex justify-center">
        <AdSlot size="leaderboard" slotId="home-top-leaderboard" />
      </div>

      <main className="flex-1">
        {/* Editorial Hero Section */}
        <HeroSection
          featuredStory={heroData.featuredStory}
          secondaryStories={heroData.secondaryStories}
        />

        {/* Latest News Feed + Sidebar (Trending + Ad) */}
        <section className="py-8 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-8">
              <CategoryHub
                articles={latestArticles}
                activeCategory="all"
              />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6 pt-8">
              {/* Numbered Trending Section (01..05) */}
              <Trending articles={trendingArticles} />

              {/* Sidebar Ad Placeholder */}
              <AdSlot size="sidebar" slotId="home-sidebar-rect" className="w-full mx-auto" />
            </aside>
          </div>
        </section>

        {/* Category Sections Grid */}
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          {/* World Section */}
          <CategorySection
            title="🌍 World News"
            articles={worldArticles}
            viewAllHref="/world"
            maxItems={3}
          />

          {/* Ad Slot between sections */}
          <div className="my-6 flex justify-center">
            <AdSlot size="banner" slotId="home-mid-banner" />
          </div>

          {/* India Section */}
          <CategorySection
            title="🇮🇳 India News"
            articles={indiaArticles}
            viewAllHref="/india"
            maxItems={3}
          />

          {/* Technology Section */}
          <CategorySection
            title="💻 Technology"
            articles={techArticles}
            viewAllHref="/technology"
            maxItems={3}
          />

          {/* AI Section */}
          <CategorySection
            title="🤖 Artificial Intelligence"
            articles={aiArticles}
            viewAllHref="/ai"
            maxItems={3}
          />
        </div>

        {/* GenZ Live Videos Section */}
        <YouTubeLiveHub />

        {/* Newsletter CTA ("Stay ahead of the story.") */}
        <Newsletter />
      </main>

      {/* Global News Footer */}
      <Footer />
    </div>
  );
}
