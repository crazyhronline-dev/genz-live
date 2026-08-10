import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getCategoryArticles, getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('entertainment');

export default async function EntertainmentPage() {
  const [articles, trending, breaking] = await Promise.all([
    getCategoryArticles('entertainment', 12),
    getTrendingArticles(5),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="entertainment" initialArticles={articles} initialTrending={trending} initialBreaking={breaking} />;
}
