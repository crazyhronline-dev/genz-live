import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { Compass, Home, Search, Flame, Radio, ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* Minimal Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full text-center space-y-8">
          {/* Glowing 404 badge */}
          <div className="relative inline-block">
            <div className="text-8xl sm:text-9xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-pink tracking-tight select-none">
              404
            </div>
            <div className="absolute -top-3 -right-3 bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-glow-purple border border-red-400/30 flex items-center gap-1">
              <Compass className="w-3 h-3 animate-spin" /> Off the Radar
            </div>
          </div>

          {/* Heading & description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              This page has gone off-script.
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              The article or URL you are looking for may have been moved, renamed, or never existed in this dimension.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/" className="btn-primary text-xs py-3 px-6 shadow-glow-purple">
              <Home className="w-4 h-4" /> Go to Homepage
            </Link>
            <Link href="/search" className="btn-secondary text-xs py-3 px-6">
              <Search className="w-4 h-4" /> Search News
            </Link>
          </div>

          {/* Popular Destinations */}
          <div className="glass-panel p-6 space-y-3 text-left border border-white/10 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-brand-orange" /> Popular Destinations
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
              {[
                { name: '🔥 Trending', href: '/trending' },
                { name: '💻 Technology', href: '/technology' },
                { name: '🤖 AI', href: '/ai' },
                { name: '🌍 World', href: '/world' },
                { name: '🇮🇳 India', href: '/india' },
                { name: '💼 Business', href: '/business' },
                { name: '🎬 Entertainment', href: '/entertainment' },
                { name: '🔴 Watch Videos', href: '/videos' },
              ].map(cat => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="px-3 py-2 bg-slate-900/80 hover:bg-brand-purple/20 hover:text-purple-300 text-slate-300 rounded-xl border border-white/5 transition-all text-center"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-4 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. {SITE_CONFIG.tagline}.</p>
      </footer>
    </div>
  );
}
