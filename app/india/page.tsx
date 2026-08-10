import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getCategoryArticles, getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('india');

export default async function IndiaPage() {
  const [articles, trending, breaking] = await Promise.all([
    getCategoryArticles('india', 12),
    getTrendingArticles(5),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="india" initialArticles={articles} initialTrending={trending} initialBreaking={breaking} />;
}
