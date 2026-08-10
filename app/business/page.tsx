import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getCategoryArticles, getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('business');

export default async function BusinessPage() {
  const [articles, trending, breaking] = await Promise.all([
    getCategoryArticles('business', 12),
    getTrendingArticles(5),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="business" initialArticles={articles} initialTrending={trending} initialBreaking={breaking} />;
}
