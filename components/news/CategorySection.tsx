'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import ArticleCard from '@/components/news/ArticleCard';
import type { Article } from '@/types';

interface CategorySectionProps {
  title: string;
  articles: Article[];
  onSelect: (article: Article) => void;
  savedIds?: string[];
  onToggleBookmark?: (id: string) => void;
  maxItems?: number;
  viewAllHref?: string;
  layout?: 'grid' | 'list';
}

export default function CategorySection({
  title,
  articles,
  onSelect,
  savedIds = [],
  onToggleBookmark,
  maxItems = 6,
  viewAllHref,
  layout = 'grid',
}: CategorySectionProps) {
  const displayed = articles.slice(0, maxItems);

  if (displayed.length === 0) return null;

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-brand-purple to-brand-cyan rounded-full" />
          <h2 className="text-lg md:text-xl font-extrabold text-white font-heading">{title}</h2>
        </div>
        {viewAllHref && (
          <a
            href={viewAllHref}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:text-purple-300 transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Article Grid / List */}
      {layout === 'list' ? (
        <div className="space-y-3">
          {displayed.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelect={onSelect}
              isSaved={savedIds.includes(article.id)}
              onToggleBookmark={onToggleBookmark}
              variant="list"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelect={onSelect}
              isSaved={savedIds.includes(article.id)}
              onToggleBookmark={onToggleBookmark}
              variant="grid"
            />
          ))}
        </div>
      )}
    </section>
  );
}
