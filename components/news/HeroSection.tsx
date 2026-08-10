'use client';

import React from 'react';
import { Clock, Eye, ArrowUpRight, Sparkles, BookOpen } from 'lucide-react';
import type { HeroSectionProps } from '@/types';

export default function HeroSection({ featuredStory, secondaryStories, onSelectStory }: HeroSectionProps) {
  if (!featuredStory) return null;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hero */}
        <div className="lg:col-span-8">
          <div
            onClick={() => onSelectStory(featuredStory)}
            className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl cursor-pointer hover:border-purple-500/50 transition-all duration-300 min-h-[460px] flex flex-col justify-end p-6 md:p-8"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="live-pulse"><Sparkles className="w-3 h-3 text-white" /> SPOTLIGHT</span>
                <span className="category-badge">{featuredStory.categoryName}</span>
              </div>
              <span className="text-xs text-slate-300 font-mono bg-slate-900/80 px-3 py-1 rounded-full border border-white/10">
                {featuredStory.publishedAt}
              </span>
            </div>

            <div className="relative z-10 space-y-3">
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight group-hover:text-purple-200 transition-colors">
                {featuredStory.title}
              </h1>
              {featuredStory.subtitle && (
                <p className="text-sm md:text-base text-slate-300 line-clamp-2 max-w-3xl">{featuredStory.subtitle}</p>
              )}

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  {featuredStory.authorAvatar && (
                    <img src={featuredStory.authorAvatar} alt={featuredStory.author} className="w-8 h-8 rounded-full border border-purple-500/50 object-cover" />
                  )}
                  <div>
                    <span className="font-bold text-white block">{featuredStory.author}</span>
                    {featuredStory.authorRole && <span className="text-[11px] text-purple-400">{featuredStory.authorRole}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-400" /> {featuredStory.readTime}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-cyan-400" /> {featuredStory.views}</span>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 group-hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-all">
                    Read Story <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stories */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" /> Top Headlines
            </h2>
            <span className="text-[11px] text-cyan-400 font-mono">Live Feed</span>
          </div>

          {secondaryStories.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="glass-panel p-4 flex gap-4 items-center group cursor-pointer hover:bg-slate-800/80 transition-all"
            >
              <img src={story.image} alt={story.title} className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform border border-white/10" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <span className="category-badge text-[10px] py-0.5 px-2">{story.categoryName}</span>
                <h3 className="text-xs md:text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-2">{story.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{story.publishedAt}</span>
                  <span className="flex items-center gap-1 text-purple-400 font-medium">Read <ArrowUpRight className="w-3 h-3" /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
