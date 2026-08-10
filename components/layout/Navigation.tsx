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
  // Display top 10 categories in header
  const desktopCategories = NAV_CATEGORIES.slice(0, 10);

  return (
    <nav aria-label="Header category navigation" className="w-full">
      <ul className="flex items-center justify-end gap-1 overflow-x-auto no-scrollbar" role="list">
        {desktopCategories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Sparkles;
          const isActive = activeCategory === cat.id;
          const href = ROUTES[cat.id] ?? '/';
          return (
            <li key={cat.id}>
              <Link
                href={href}
                id={`header-nav-${cat.id}`}
                onClick={() => onSelect(cat.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-sm shadow-purple-900/40 font-bold scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-brand-purple'}`} />
                {cat.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
