import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/config/site';

interface StaticPageProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

// Server-friendly static page layout (no client hooks needed)
export default function StaticPage({ title, subtitle, lastUpdated, children }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col">
      {/* Minimal header for static pages */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/">
            <img
              src="/brand/06_Website_Logo_1200x400.png"
              alt="GenZ Live Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Page Banner */}
      <div className="bg-navy-surface border-b border-white/5 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-mono text-brand-purple uppercase tracking-widest mb-2">{SITE_CONFIG.name}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-heading">{title}</h1>
          {subtitle && <p className="text-slate-400 mt-2 text-sm">{subtitle}</p>}
          {lastUpdated && (
            <p className="text-slate-500 text-xs mt-3 font-mono">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose-genz">
            {children}
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-6 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved. · <Link href="/privacy-policy" className="hover:text-purple-400">Privacy</Link> · <Link href="/terms" className="hover:text-purple-400">Terms</Link></p>
      </footer>
    </div>
  );
}
