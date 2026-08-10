import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getCategoryArticles, getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('technology');

export default async function TechnologyPage() {
  const [articles, trending, breaking] = await Promise.all([
    getCategoryArticles('technology', 12),
    getTrendingArticles(5),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="technology" initialArticles={articles} initialTrending={trending} initialBreaking={breaking} />;
}
