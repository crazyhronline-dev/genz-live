import React from 'react';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import Logo from '@/components/ui/Logo';

export default function Loading() {
  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col justify-between">
      {/* Top Loading Indicator */}
      <div className="w-full h-1 bg-slate-900 overflow-hidden sticky top-0 z-50">
        <div className="w-full h-full bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-pink animate-pulse" />
      </div>

      {/* Header Placeholder */}
      <div className="border-b border-white/10 bg-slate-950/80 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>

      {/* Main Skeleton */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero Loading Skeleton */}
        <LoadingSkeleton variant="hero" />

        {/* Section Loading Skeleton */}
        <div className="space-y-4 pt-6">
          <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
          <LoadingSkeleton variant="grid" count={6} />
        </div>
      </main>

      {/* Footer Placeholder */}
      <div className="bg-slate-950 border-t border-white/5 py-6 px-4 text-center">
        <div className="h-3 w-40 bg-slate-900 rounded mx-auto animate-pulse" />
      </div>
    </div>
  );
}
