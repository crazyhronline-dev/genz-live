'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import HeroStory from '@/components/news/HeroStory';
import type { HeroSectionProps } from '@/types';

export default function HeroSection({ featuredStory, secondaryStories, onSelectStory }: HeroSectionProps) {
  if (!featuredStory) return null;

  return (
    <section className="py-8" aria-label="Featured stories">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hero — large variant */}
        <div className="lg:col-span-8">
          <HeroStory article={featuredStory} onSelect={onSelectStory} variant="large" />
        </div>

        {/* Secondary Stories — small variant */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-purple" /> Top Headlines
            </h2>
            <span className="text-[11px] text-brand-cyan font-mono">Live Feed</span>
          </div>
          {secondaryStories.map((story) => (
            <HeroStory key={story.id} article={story} onSelect={onSelectStory} variant="small" />
          ))}
        </div>
      </div>
    </section>
  );
}
