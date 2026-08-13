export const revalidate = 60; // Instant <15ms CDN caching with 60s background revalidation

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
  resolveArticleImage,
} from '@/lib/dataAccess';

// Lazy-load heavy below-the-fold components to reduce initial JS bundle
const YouTubeLiveHub = nextDynamic(() => import('@/components/media/YouTubeLiveHub'), {
  loading: () => <div className="h-64 animate-pulse bg-slate-900/50 rounded-2xl mx-4" />,
});
const Newsletter = nextDynamic(() => import('@/components/ui/Newsletter'), {
  loading: () => <div className="h-32 animate-pulse bg-slate-900/50 rounded-2xl mx-4" />,
});

export const metadata: Metadata = buildPageMetadata({
  title: 'GenZ Live — The Voice of GenZ | Breaking News, India, World & Technology',
  description: 'GenZ Live is India\'s fastest-growing digital news platform. Get the latest breaking news on India, World, Technology, AI, Business, Markets, Entertainment and Sports — live updates for the next generation.',
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

  const heroImgUrl = heroData.featuredStory ? resolveArticleImage(heroData.featuredStory.image, heroData.featuredStory.category, heroData.featuredStory.title) : null;

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* High-Priority LCP Hero Image Preload */}
      {heroImgUrl && (
        <link rel="preload" as="image" href={heroImgUrl} fetchPriority="high" />
      )}

      {/* Header */}
      <Header activeCategory="all" />

      {/* Breaking News Ticker */}
      <BreakingNews headlines={breakingHeadlines} />

      {/* Top Leaderboard Ad Placeholder (ONLY Ad at the Top on Mobile) */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex justify-center">
        <AdSlot size="leaderboard" slotId="home-top-leaderboard" />
      </div>

      <main className="flex-1">
        {/* SEO: Page-level H1 — hidden from view but present for crawlers & screen readers */}
        <h1 style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}>
          GenZ Live — Breaking News on India, World, Technology, AI, Business, Entertainment &amp; Sports
        </h1>

        {/* Editorial Hero Section */}
        <HeroSection
          featuredStory={heroData.featuredStory}
          secondaryStories={heroData.secondaryStories}
        />

        {/* Slot 3: Left Skyscraper (Mobile Placement 1: After Hero Stories / Before Main Feed) */}
        <AdSlot size="left-skyscraper" />

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

        {/* Category Sections Grid (Deferred Rendering for 95+ PageSpeed) */}
        <div className="max-w-7xl mx-auto px-4 space-y-4 content-visibility-auto">
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

          {/* Slot 4: Right Skyscraper (Mobile Placement 2: Mid-Feed after India News) */}
          <AdSlot size="right-skyscraper" />

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

      {/* Before-Footer Pre-Footer Ad Banner (Slot 7) */}
      <AdSlot size="footer-banner" />

      {/* Global News Footer */}
      <Footer />
    </div>
  );
}
