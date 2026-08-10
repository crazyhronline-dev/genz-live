import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getCategoryArticles, getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('world');

export default async function WorldPage() {
  const [articles, trending, breaking] = await Promise.all([
    getCategoryArticles('world', 12),
    getTrendingArticles(5),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="world" initialArticles={articles} initialTrending={trending} initialBreaking={breaking} />;
}
