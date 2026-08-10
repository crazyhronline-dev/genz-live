'use client';

import React, { useState } from 'react';
import { Radio, Bookmark, Search, Menu } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '@/components/ui/SocialIcons';
import Navigation from '@/components/layout/Navigation';
import MobileNavigation from '@/components/layout/MobileNavigation';
import { SITE_CONFIG } from '@/config/site';

interface HeaderProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  savedCount?: number;
  onSavedClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onLiveClick?: () => void;
}

export default function Header({
  activeCategory = 'all',
  onCategoryChange,
  savedCount = 0,
  onSavedClick,
  searchQuery = '',
  onSearchChange,
  onLiveClick,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-glass">
        {/* Top Info Bar */}
        <div className="border-b border-white/5 bg-slate-950/80 py-1 px-4 text-[11px] text-slate-400 font-mono">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> LIVE
              </span>
              <span className="hidden sm:inline text-slate-300">
                YouTube:{' '}
                <a
                  href={SITE_CONFIG.youtube.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-purple hover:underline"
                >
                  {SITE_CONFIG.youtube.handle}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden md:inline">{currentDate}</span>
              <div className="flex items-center gap-3">
                <a href={SITE_CONFIG.youtube.url} target="_blank" rel="noreferrer" aria-label="YouTube">
                  <YoutubeIcon className="w-3.5 h-3.5 text-red-500 hover:text-red-400 transition-colors" />
                </a>
                <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-500 hover:text-pink-400 transition-colors" />
                </a>
                <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FacebookIcon className="w-3.5 h-3.5 text-blue-500 hover:text-blue-400 transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Single Line Header Row — Logo on Left, 10 Categories in Middle/Right, Actions on Far Right */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Logo on Left */}
          <Logo size="lg" />

          {/* 10 Categories in Desktop View — SAME LINE, NO LINE BREAK */}
          <div className="hidden lg:flex items-center flex-1 justify-end max-w-4xl mx-2">
            <Navigation activeCategory={activeCategory} onSelect={onCategoryChange ?? (() => {})} />
          </div>

          {/* Actions on Far Right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Search Toggle */}
            {onSearchChange && (
              <div className="relative hidden xl:block w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  id="header-search"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-purple transition-all"
                />
              </div>
            )}

            {/* Live Button */}
            {onLiveClick && (
              <button
                id="header-live-btn"
                onClick={onLiveClick}
                className="btn-live flex items-center gap-1.5 text-xs py-1.5 px-3"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Live</span>
              </button>
            )}

            {/* Saved / Bookmarks */}
            {onSavedClick && (
              <button
                id="header-saved-btn"
                onClick={onSavedClick}
                aria-label={`Saved articles (${savedCount})`}
                className={`relative p-2 rounded-full border transition-all ${
                  activeCategory === 'saved'
                    ? 'bg-brand-purple/20 border-brand-purple/50 text-brand-purple'
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:border-brand-purple/40'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-purple text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Search Toggle */}
            {onSearchChange && (
              <button
                onClick={() => setSearchOpen(p => !p)}
                className="xl:hidden p-2 rounded-full bg-slate-900 border border-white/10 text-slate-300"
                aria-label="Toggle search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Toggle — Opens Mobile Drawer with all categories */}
            <button
              id="header-menu-btn"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-full bg-slate-900 border border-white/10 text-slate-300"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Input Dropdown */}
        {searchOpen && onSearchChange && (
          <div className="xl:hidden px-4 py-2 bg-slate-900 border-t border-white/5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search news..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full bg-navy-surface border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer with All Categories */}
      <MobileNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeCategory={activeCategory}
        onSelect={onCategoryChange}
      />
    </>
  );
}
