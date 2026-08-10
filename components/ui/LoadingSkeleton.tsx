import React from 'react';

// Reusable animated skeleton shimmer
function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`bg-navy-elevated rounded animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton Variants                                                    */
/* ------------------------------------------------------------------ */

/** Skeleton for ArticleCard (grid variant) */
export function ArticleCardSkeleton() {
  return (
    <div className="glass-panel overflow-hidden" aria-busy="true" aria-label="Loading article">
      <Shimmer className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-4/5" />
        <div className="flex items-center justify-between pt-2">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for HeroStory (large variant) */
export function HeroStorySkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden min-h-[460px] relative bg-navy-surface border border-white/10" aria-busy="true" aria-label="Loading featured story">
      <Shimmer className="absolute inset-0 rounded-none" />
      <div className="absolute bottom-8 left-8 right-8 space-y-3">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-8 w-3/4" />
        <Shimmer className="h-8 w-1/2" />
        <Shimmer className="h-4 w-40 mt-4" />
      </div>
    </div>
  );
}

/** Skeleton for list item (compact article row) */
export function ArticleListSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 glass-panel" aria-busy="true" aria-label="Loading article">
      <Shimmer className="w-20 h-20 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-3 w-32" />
      </div>
    </div>
  );
}

/** Skeleton for Trending sidebar item */
export function TrendingItemSkeleton() {
  return (
    <div className="flex items-start gap-3" aria-busy="true">
      <Shimmer className="h-6 w-6 rounded shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-3/4" />
        <Shimmer className="h-2.5 w-16 mt-1" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Composite Skeletons                                                  */
/* ------------------------------------------------------------------ */

interface LoadingSkeletonProps {
  variant?: 'grid' | 'hero' | 'list' | 'trending';
  count?: number;
}

/** Convenience component — renders `count` skeletons of the given variant */
export default function LoadingSkeleton({ variant = 'grid', count = 6 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === 'hero') {
    return <HeroStorySkeleton />;
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {items.map((_, i) => <ArticleListSkeleton key={i} />)}
      </div>
    );
  }

  if (variant === 'trending') {
    return (
      <div className="card-glass p-4 space-y-4">
        <Shimmer className="h-4 w-32" />
        <div className="space-y-4">
          {items.map((_, i) => <TrendingItemSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // Default: grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((_, i) => <ArticleCardSkeleton key={i} />)}
    </div>
  );
}
