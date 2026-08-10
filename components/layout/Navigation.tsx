'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, Flame, Cpu, Bot, Globe, Briefcase, TrendingUp, Film, Trophy, Palette, ChevronDown,
} from 'lucide-react';
import { NAV_CATEGORIES } from '@/config/site';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Flame, Cpu, Bot, Globe, Globe2: Globe,
  Briefcase, TrendingUp, Film, Trophy, Palette,
};

// Route map: category id → page path
const ROUTES: Record<string, string> = {
  all:           '/',
  trending:      '/trending',
  tech:          '/technology',
  ai:            '/ai',
  india:         '/india',
  world:         '/world',
  business:      '/business',
  markets:       '/markets',
  entertainment: '/entertainment',
  sports:        '/sports',
  culture:       '/culture',
};

interface NavigationProps {
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function Navigation({ activeCategory, onSelect }: NavigationProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Top 6 items (All Feed + Top 5 Categories: Trending, Tech, AI, India, World)
  const mainCategories = NAV_CATEGORIES.slice(0, 6);
  // Remaining categories for the "More" dropdown
  const moreCategories = NAV_CATEGORIES.slice(6);

  const isMoreActive = moreCategories.some((cat) => cat.id === activeCategory);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav aria-label="Category navigation" className="block w-full border-t border-white/5 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <ul className="flex items-center gap-1.5 py-2 min-w-max" role="list">
          {/* Top 5 Primary Categories + All Feed */}
          {mainCategories.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Sparkles;
            const isActive = activeCategory === cat.id;
            const href = ROUTES[cat.id] ?? '/';
            return (
              <li key={cat.id}>
                <Link
                  href={href}
                  id={`nav-${cat.id}`}
                  onClick={() => onSelect(cat.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-md shadow-purple-900/40 scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-brand-purple'}`} />
                  {cat.name}
                </Link>
              </li>
            );
          })}

          {/* More Dropdown Button */}
          <li key="more-dropdown" className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setMoreOpen((prev) => !prev)}
              onMouseEnter={() => setMoreOpen(true)}
              aria-expanded={moreOpen}
              aria-label="More categories"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isMoreActive
                  ? 'bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-md shadow-purple-900/40'
                  : 'bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-brand-purple/40'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180 text-white' : 'text-brand-cyan'}`} />
            </button>

            {/* Dropdown Menu */}
            {moreOpen && (
              <div
                onMouseLeave={() => setMoreOpen(false)}
                className="absolute left-0 mt-2 w-52 rounded-2xl bg-navy-surface/95 border border-white/10 shadow-glass backdrop-blur-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-white/5 mb-1 flex items-center justify-between">
                  <span>Explore More</span>
                  <span className="text-[9px] text-brand-purple font-mono">5 Categories</span>
                </div>
                <div className="space-y-0.5">
                  {moreCategories.map((cat) => {
                    const Icon = iconMap[cat.icon] ?? Sparkles;
                    const isActive = activeCategory === cat.id;
                    const href = ROUTES[cat.id] ?? '/';
                    return (
                      <Link
                        key={cat.id}
                        href={href}
                        id={`nav-more-${cat.id}`}
                        onClick={() => {
                          onSelect(cat.id);
                          setMoreOpen(false);
                        }}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-brand-purple/20 text-brand-purple font-bold border border-brand-purple/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-purple' : 'text-brand-cyan'}`} />
                        <span>{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
