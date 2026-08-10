import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
import { getCategoryArticles, getTrendingArticles, getBreakingNews } from '@/lib/dataAccess';

export const metadata: Metadata = buildCategoryMetadata('culture');

export default async function CulturePage() {
  const [articles, trending, breaking] = await Promise.all([
    getCategoryArticles('culture', 12),
    getTrendingArticles(5),
    getBreakingNews(),
  ]);

  return <CategoryPageClient category="culture" initialArticles={articles} initialTrending={trending} initialBreaking={breaking} />;
}
