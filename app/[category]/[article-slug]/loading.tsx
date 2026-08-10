import React from 'react';
import { BookOpen } from 'lucide-react';

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col justify-between">
      <div className="w-full h-1 bg-slate-900 overflow-hidden sticky top-0 z-50">
        <div className="w-full h-full bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-pink animate-pulse" />
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />

          <div className="space-y-3">
            <div className="h-4 w-20 bg-purple-900/40 rounded animate-pulse" />
            <div className="h-8 w-full bg-slate-800 rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-800/60 rounded animate-pulse" />
          </div>

          <div className="w-full aspect-video bg-navy-surface border border-white/10 rounded-2xl animate-pulse flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-slate-800" />
          </div>

          <div className="space-y-3 pt-4">
            <div className="h-4 w-full bg-slate-800/60 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-800/60 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-slate-800/60 rounded animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
