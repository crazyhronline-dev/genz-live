import React, { useState } from 'react';
import { 
  Search, 
  Radio, 
  Menu, 
  X, 
  Sparkles, 
  Bookmark, 
  TrendingUp, 
  Globe, 
  Cpu, 
  Bot, 
  Briefcase, 
  Film, 
  Trophy, 
  Palette,
  Flame
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';
import { CATEGORIES, SOCIAL_LINKS } from '../data/newsData';

const iconMap = {
  Sparkles: Sparkles,
  Flame: Flame,
  Cpu: Cpu,
  Bot: Bot,
  Globe: Globe,
  Globe2: Globe,
  Briefcase: Briefcase,
  TrendingUp: TrendingUp,
  Film: Film,
  Trophy: Trophy,
  Palette: Palette
};

export default function Navbar({ 
  activeCategory, 
  setActiveCategory, 
  searchQuery, 
  setSearchQuery, 
  onOpenLiveStream,
  savedCount
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-cyan-900/60 border-b border-white/5 py-1.5 px-4 text-xs font-medium">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="live-pulse">
              <span className="live-pulse-dot"></span> LIVE
            </span>
            <span className="hidden sm:inline text-slate-300">
              Official YouTube: <strong className="text-purple-400">GenZ Live ({SOCIAL_LINKS.handle})</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden md:inline">{currentDate}</span>
            <div className="flex items-center gap-3">
              <a 
                href={SOCIAL_LINKS.youtube} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-red-400 transition-colors flex items-center gap-1"
                title="GenZ Live YouTube Channel"
              >
                <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden lg:inline text-[11px]">YouTube</span>
              </a>
              <a 
                href={SOCIAL_LINKS.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-pink-400 transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
              </a>
              <a 
                href={SOCIAL_LINKS.facebook} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-blue-400 transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5 text-blue-500" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="container py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <img 
            src="/brand/06_Website_Logo_1200x400.png" 
            alt="GenZ Live Logo" 
            className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/brand/08_Website_Logo_300x100.png';
            }}
          />
        </a>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Search Input */}
          <div className="relative hidden md:block w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search AI, Tech, World, Trending news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Watch Live Button */}
          <button
            onClick={onOpenLiveStream}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-900/30 transition-all transform hover:scale-105 active:scale-95"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Watch Live</span>
          </button>

          {/* Bookmarks Counter */}
          <button
            onClick={() => setActiveCategory('saved')}
            className={`relative p-2.5 rounded-full border transition-all ${
              activeCategory === 'saved'
                ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                : 'bg-slate-900 border-white/10 text-slate-300 hover:border-purple-500/50'
            }`}
            title="Saved Articles"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-full bg-slate-900 border border-white/10 text-slate-300"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-slate-900 border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {searchOpen && (
        <div className="md:hidden px-4 py-2 bg-slate-900 border-b border-white/10">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Categories Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-white/5 bg-slate-950/50">
        <div className="container overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-1 py-2">
            {CATEGORIES.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Sparkles;
              const isActive = activeCategory === cat.id;

              return (
                <li key={cat.id}>
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-purple-900/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-white/10 px-4 py-4 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Sparkles;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className="w-4 h-4 text-purple-400" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
