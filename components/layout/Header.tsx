'use client';

import React, { useState, useEffect } from 'react';
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
  brandSettings?: {
    headerLogoUrl?: string;
    headerLogoHeight?: number;
    headerLogoWidth?: number;
    headerHeight?: number;
    headerTemplate?: string;
  };
}

export default function Header({
  activeCategory = 'all',
  onCategoryChange,
  savedCount = 0,
  onSavedClick,
  searchQuery = '',
  onSearchChange,
  onLiveClick,
  brandSettings,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [liveBrand, setLiveBrand] = useState(brandSettings);

  useEffect(() => {
    if (brandSettings) {
      setLiveBrand(brandSettings);
      return;
    }
    fetch('/api/brand')
      .then((res) => res.json())
      .then((data) => {
        if (data) setLiveBrand(data);
      })
      .catch(() => {});
  }, [brandSettings]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  const template = liveBrand?.headerTemplate || 'classic';
  const customHeaderHeight = liveBrand?.headerHeight && liveBrand.headerHeight > 0 ? Math.min(liveBrand.headerHeight, 64) : undefined;
  const headerBarStyle: React.CSSProperties = customHeaderHeight ? { minHeight: `${customHeaderHeight}px` } : {};

  // ── Render Template Components ──
  return (
    <>
      <div className="sticky top-0 z-[100]">
        <header className="bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-glass">

          {/* ── Top Utility Bar (Hidden in Slim mode) ── */}
          {template !== 'slim' && (
            <div className="border-b border-white/5 bg-slate-950/90 px-4 py-1 text-[10px] text-slate-400 font-mono">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-extrabold text-[9px] tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden md:inline">{currentDate}</span>
                  <div className="flex items-center gap-2">
                    <a href={SITE_CONFIG.youtube.url} target="_blank" rel="noreferrer" aria-label="YouTube">
                      <YoutubeIcon className="w-3 h-3 text-red-500 hover:text-red-400 transition-colors" />
                    </a>
                    <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                      <InstagramIcon className="w-3 h-3 text-pink-500 hover:text-pink-400 transition-colors" />
                    </a>
                    <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                      <FacebookIcon className="w-3 h-3 text-blue-500 hover:text-blue-400 transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TEMPLATE 4: Minimal Two-Tier Header ── */}
          {template === 'minimal' ? (
            <div className="space-y-1">
              {/* Tier 1: Centered Brand Logo */}
              <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="w-24 hidden sm:block" />
                <div className="flex items-center justify-center">
                  <Logo
                    size="lg"
                    src={liveBrand?.headerLogoUrl}
                    customHeight={liveBrand?.headerLogoHeight}
                    customWidth={liveBrand?.headerLogoWidth}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    aria-label="Toggle Search"
                    className="p-1.5 rounded-full bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle Menu"
                    className="md:hidden p-1.5 rounded-full bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Tier 2: Centered Category Navigation */}
              <div className="max-w-7xl mx-auto px-4 py-1 hidden md:flex items-center justify-center overflow-x-auto no-scrollbar">
                <Navigation activeCategory={activeCategory} onSelect={onCategoryChange ?? (() => {})} />
              </div>
            </div>
          ) : (
            /* ── TEMPLATES 1, 2, 3: Main Navigation Bar ── */
            <div
              style={headerBarStyle}
              className={`max-w-7xl mx-auto px-4 py-0.5 flex items-center justify-between gap-4 transition-all duration-200 ${
                template === 'slim' ? 'h-10' : ''
              }`}
            >
              {/* Logo on Left (Hidden in Newsroom overhang mode as it hangs below) */}
              {template !== 'newsroom' ? (
                <div className="flex items-center shrink-0 my-0 py-0">
                  <Logo
                    size={template === 'slim' ? 'md' : 'lg'}
                    src={liveBrand?.headerLogoUrl}
                    customHeight={liveBrand?.headerLogoHeight}
                    customWidth={liveBrand?.headerLogoWidth}
                  />
                </div>
              ) : (
                <div className="w-40 hidden md:block" />
              )}

              {/* Categories in Center */}
              <div className="hidden md:flex items-center flex-1 justify-center max-w-4xl mx-2 overflow-x-auto no-scrollbar">
                <Navigation activeCategory={activeCategory} onSelect={onCategoryChange ?? (() => {})} />
              </div>

              {/* Mobile spacer */}
              <div className="flex-1 md:hidden" />

              {/* Actions on Right */}
              <div className="flex items-center gap-2 shrink-0">
                {onLiveClick && (
                  <button
                    id="header-live-btn"
                    onClick={onLiveClick}
                    className="btn-live flex items-center gap-1.5 text-xs py-1 px-2.5"
                  >
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span className="hidden sm:inline text-xs">Live</span>
                  </button>
                )}

                {onSavedClick && (
                  <button
                    id="header-saved-btn"
                    onClick={onSavedClick}
                    aria-label={`Saved articles (${savedCount})`}
                    className={`relative p-1.5 rounded-full border transition-all ${
                      activeCategory === 'saved'
                        ? 'bg-brand-purple/20 border-brand-purple/50 text-brand-purple'
                        : 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:border-brand-purple/30'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {savedCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-cyan text-slate-950 font-extrabold text-[9px] rounded-full flex items-center justify-center">
                        {savedCount}
                      </span>
                    )}
                  </button>
                )}

                <button
                  id="header-search-toggle"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Toggle Search"
                  className={`p-1.5 rounded-full border transition-all ${
                    searchOpen
                      ? 'bg-brand-purple/20 border-brand-purple/50 text-brand-purple'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:border-brand-purple/30'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                </button>

                <button
                  id="header-mobile-menu-toggle"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle Navigation Menu"
                  className="md:hidden p-1.5 rounded-full bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Expandable Search Input Bar */}
          {searchOpen && (
            <div className="border-t border-white/10 bg-slate-900/90 p-3 animate-fadeIn">
              <div className="max-w-3xl mx-auto flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search breaking news, tech, AI, business..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange?.('')}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* ── TEMPLATE 3: Newsroom Overhang Floating Logo Card ── */}
        {template === 'newsroom' && (
          <div className="relative z-50 pointer-events-none">
            <div className="absolute left-4 -top-1 pointer-events-auto">
              <div className="bg-slate-950/95 backdrop-blur-xl rounded-b-xl border border-t-0 border-white/10 px-3 pb-1.5 shadow-lg shadow-black/40">
                <Logo
                  size="lg"
                  src={liveBrand?.headerLogoUrl}
                  customHeight={liveBrand?.headerLogoHeight}
                  customWidth={liveBrand?.headerLogoWidth}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeCategory={activeCategory}
        onSelect={(cat) => {
          onCategoryChange?.(cat);
          setMobileOpen(false);
        }}
      />
    </>
  );
}
