'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[GenZ Live Global Error]:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between font-sans antialiased">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-14 h-14 bg-red-950/60 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white">Application Error</h1>
              <p className="text-slate-400 text-xs leading-relaxed">
                A critical error occurred while rendering the platform. Click below to reload.
              </p>
            </div>

            {error.digest && (
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg text-[11px] font-mono text-purple-400 border border-white/5">
                Ref: {error.digest}
              </div>
            )}

            <button
              onClick={() => reset()}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/50 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reload Application
            </button>
          </div>
        </main>

        <footer className="py-4 text-center text-[11px] text-slate-600">
          © {new Date().getFullYear()} {SITE_CONFIG.name}
        </footer>
      </body>
    </html>
  );
}
