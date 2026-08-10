import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getCategoryArticles, getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('markets');

export default async function MarketsPage() {
  const [articles, trending, breaking] = await Promise.all([
    getCategoryArticles('markets', 12),
    getTrendingArticles(5),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="markets" initialArticles={articles} initialTrending={trending} initialBreaking={breaking} />;
}
