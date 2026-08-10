import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getCategoryArticles, getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('ai');

export default async function AIPage() {
  const [articles, trending, breaking] = await Promise.all([
    getCategoryArticles('ai', 12),
    getTrendingArticles(5),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="ai" initialArticles={articles} initialTrending={trending} initialBreaking={breaking} />;
}
