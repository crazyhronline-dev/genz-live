'use client';

import React from 'react';
import Link from 'next/link';
import { X, Sparkles, Flame, Cpu, Bot, Globe, Briefcase, TrendingUp, Film, Trophy, Palette } from 'lucide-react';
import { NAV_CATEGORIES, SITE_CONFIG } from '@/config/site';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Flame, Cpu, Bot, Globe, Globe2: Globe,
  Briefcase, TrendingUp, Film, Trophy, Palette,
};

// Category slug to URL mapping
const CAT_HREF: Record<string, string> = {
  all: '/', tech: '/technology',
};
const getCatHref = (id: string) => CAT_HREF[id] ?? `/${id}`;

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory?: string;
  onSelect?: (id: string) => void;
}

export default function MobileNavigation({
  isOpen, onClose, activeCategory, onSelect,
}: MobileNavigationProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-navy-surface border-r border-white/10 flex flex-col lg:hidden overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <span className="text-sm font-extrabold text-white font-heading">{SITE_CONFIG.name}</span>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category List */}
        <nav aria-label="Mobile navigation" className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">Categories</p>
          {NAV_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Sparkles;
            const isActive = activeCategory === cat.id;

            // If onSelect provided (home page SPA), call it; else navigate
            if (onSelect) {
              return (
                <button
                  key={cat.id}
                  onClick={() => { onSelect(cat.id); onClose(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-purple shrink-0" />
                  {cat.name}
                </button>
              );
            }

            return (
              <Link
                key={cat.id}
                href={getCatHref(cat.id)}
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-300 hover:bg-slate-800/60 hover:text-white"
              >
                <Icon className="w-4 h-4 text-brand-purple shrink-0" />
                {cat.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick Links */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">More</p>
          {[['About', '/about'], ['Contact', '/contact'], ['Videos', '/videos'], ['Search', '/search']].map(([label, href]) => (
            <Link key={href} href={href} onClick={onClose} className="block px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/40">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
