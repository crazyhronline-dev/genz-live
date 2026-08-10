import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getCategoryArticles, getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('sports');

export default async function SportsPage() {
  const [articles, trending, breaking] = await Promise.all([
    getCategoryArticles('sports', 12),
    getTrendingArticles(5),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="sports" initialArticles={articles} initialTrending={trending} initialBreaking={breaking} />;
}
