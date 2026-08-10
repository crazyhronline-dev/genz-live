'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles, Flame, Cpu, Bot, Globe, Briefcase, TrendingUp, Film, Trophy, Palette,
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
  return (
    <nav aria-label="Category navigation" className="hidden lg:block border-t border-white/5 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <ul className="flex items-center gap-0.5 py-1.5" role="list">
          {NAV_CATEGORIES.map((cat) => {
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
                      ? 'bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-md shadow-purple-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-brand-purple'}`} />
                  {cat.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
