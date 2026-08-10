'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to internal console safely in non-production environments
    if (process.env.NODE_ENV === 'development') {
      console.error('[GenZ Live App Error]:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* Minimal Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <span className="text-xs font-mono text-red-400 bg-red-950/50 border border-red-800/40 px-2.5 py-1 rounded-full">
            System Alert
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full text-center space-y-6">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-red-950/60 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-glow-purple">
            <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Something went wrong
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              We encountered an unexpected issue while loading this page. Our technical team has been notified.
            </p>
          </div>

          {/* Error Reference (digest code only — NO stack traces or DB details) */}
          {error.digest && (
            <div className="bg-slate-900/90 border border-white/10 rounded-xl py-2 px-4 inline-block text-xs font-mono text-slate-400">
              Reference Code: <span className="text-purple-400 font-bold">{error.digest}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="btn-primary text-xs py-3 px-6 shadow-glow-purple"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <Link href="/" className="btn-secondary text-xs py-3 px-6">
              <Home className="w-4 h-4" /> Go to Homepage
            </Link>
          </div>

          {/* Support Link */}
          <p className="text-xs text-slate-500 pt-4">
            If this issue persists, contact us at{' '}
            <a href="mailto:hello@genz-live.com" className="text-purple-400 hover:underline inline-flex items-center gap-1">
              <Mail className="w-3 h-3" /> hello@genz-live.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-4 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
