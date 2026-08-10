'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleModal from '@/components/news/ArticleModal';
import { ARTICLES } from '@/lib/newsData';
import { NAV_CATEGORIES } from '@/config/site';
import type { Article } from '@/types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('search_term_string') || searchParams.get('query') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [selectedStory, setSelectedStory] = useState<Article | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const results = useMemo(() => {
    if (!query.trim() && filterCategory === 'all') return [];
    return ARTICLES.filter(a => {
      const q = query.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q) || a.categoryName.toLowerCase().includes(q);
      const matchCat = filterCategory === 'all' || a.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [query, filterCategory]);

  const relatedArticles = useMemo(() => {
    if (!selectedStory) return [];
    return ARTICLES.filter(a => a.id !== selectedStory.id && a.category === selectedStory.category);
  }, [selectedStory]);

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <Header activeCategory="all" searchQuery={query} onSearchChange={setQuery} />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Search Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading">Search <span className="gradient-text">GenZ Live</span></h1>
            <p className="text-slate-400 text-sm">Search across articles, topics, and author profiles</p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="search-main"
              type="text"
              autoFocus
              placeholder="Search articles, topics, authors..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-navy-surface border border-white/10 rounded-2xl pl-14 pr-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 text-base transition-all shadow-lg"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
            </div>
            {NAV_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filterCategory === cat.id
                    ? 'bg-brand-purple text-white shadow-glow-purple'
                    : 'bg-navy-surface border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results */}
          {query.trim() || filterCategory !== 'all' ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                {results.length === 0 ? 'No results found' : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
                {query && <span> for <strong className="text-white">&quot;{query}&quot;</strong></span>}
              </p>

              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map(article => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedStory(article)}
                      className="w-full glass-panel p-4 text-left flex items-center gap-4 group hover:border-brand-purple/40 transition-all"
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        width="80"
                        height="80"
                        className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="category-badge text-[10px] mb-1">{article.categoryName}</span>
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">{article.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{article.author} · {article.publishedAt} · {article.readTime}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-12 text-center space-y-3">
                  <SearchIcon className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-slate-400 font-medium">No articles match your search</p>
                  <p className="text-slate-600 text-sm">Try different keywords or browse a category</p>
                  <Link href="/" className="inline-block mt-2 btn-primary text-xs">Browse All News</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center space-y-3">
              <SearchIcon className="w-12 h-12 text-slate-700 mx-auto animate-pulse" />
              <p className="text-slate-400">Start typing to search articles, topics, and authors</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedStory && (
        <ArticleModal
          article={selectedStory}
          onClose={() => setSelectedStory(null)}
          isSaved={savedIds.includes(selectedStory.id)}
          onToggleBookmark={id => setSavedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])}
          onSelectRelated={setSelectedStory}
          relatedArticles={relatedArticles}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy-main text-slate-100 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading search...</div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
