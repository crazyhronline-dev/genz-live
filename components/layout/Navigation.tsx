'use client';

import React from 'react';
import {
  Sparkles, Flame, Cpu, Bot, Globe, Briefcase, TrendingUp, Film, Trophy, Palette,
} from 'lucide-react';
import { NAV_CATEGORIES } from '@/config/site';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Flame, Cpu, Bot, Globe, Globe2: Globe,
  Briefcase, TrendingUp, Film, Trophy, Palette,
};

interface NavigationProps {
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function Navigation({ activeCategory, onSelect }: NavigationProps) {
  return (
    <nav aria-label="Category navigation" className="hidden lg:block border-t border-white/5 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <ul className="flex items-center gap-1 py-2" role="list">
          {NAV_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Sparkles;
            const isActive = activeCategory === cat.id;
            return (
              <li key={cat.id}>
                <button
                  id={`nav-${cat.id}`}
                  onClick={() => onSelect(cat.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-md shadow-purple-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-brand-purple'}`} />
                  {cat.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
