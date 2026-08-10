import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
export const metadata: Metadata = buildCategoryMetadata('trending');
export default function TrendingPage() { return <CategoryPageClient category="trending" />; }
