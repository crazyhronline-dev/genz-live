'use client';

import React, { useState } from 'react';
import { Radio, Search, Bookmark, Menu } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Navigation from '@/components/layout/Navigation';
import MobileNavigation from '@/components/layout/MobileNavigation';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '@/components/ui/SocialIcons';
import { SITE_CONFIG } from '@/config/site';

interface HeaderProps {
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onLiveClick?: () => void;
  savedCount?: number;
  onSavedClick?: () => void;
}

export default function Header({
  activeCategory = 'all',
  onCategoryChange,
  searchQuery = '',
  onSearchChange,
  onLiveClick,
  savedCount = 0,
  onSavedClick,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-purple-900/50 via-slate-900 to-cyan-900/50 border-b border-white/5 py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="live-pulse"><span className="live-pulse-dot" /> LIVE</span>
              <span className="hidden sm:inline text-slate-300">
                YouTube: <strong className="text-brand-purple">{SITE_CONFIG.youtube.handle}</strong>
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-xs">
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

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Logo size="md" />

          <div className="flex items-center gap-2.5">
            {/* Desktop Search */}
            {onSearchChange && (
              <div className="relative hidden md:block w-60 lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="header-search"
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-all"
                />
              </div>
            )}

            {/* Live Button */}
            {onLiveClick && (
              <button
                id="header-live-btn"
                onClick={onLiveClick}
                className="btn-live flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Watch Live</span>
              </button>
            )}

            {/* Saved / Bookmarks */}
            {onSavedClick && (
              <button
                id="header-saved-btn"
                onClick={onSavedClick}
                aria-label={`Saved articles (${savedCount})`}
                className={`relative p-2.5 rounded-full border transition-all ${
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
                className="md:hidden p-2.5 rounded-full bg-slate-900 border border-white/10 text-slate-300"
                aria-label="Toggle search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="header-menu-btn"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-full bg-slate-900 border border-white/10 text-slate-300"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && onSearchChange && (
          <div className="md:hidden px-4 py-2.5 bg-slate-900 border-t border-white/5">
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

        {/* Desktop Category Navigation */}
        {onCategoryChange && (
          <Navigation activeCategory={activeCategory} onSelect={onCategoryChange} />
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeCategory={activeCategory}
        onSelect={onCategoryChange}
      />
    </>
  );
}
