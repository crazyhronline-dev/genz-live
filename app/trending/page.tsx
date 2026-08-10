import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('trending');

export default async function TrendingPage() {
  const [trending, breaking] = await Promise.all([
    getTrendingArticles(12),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="trending" initialArticles={trending} initialTrending={trending} initialBreaking={breaking} />;
}
