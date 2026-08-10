import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
export const metadata: Metadata = buildCategoryMetadata('markets');
export default function MarketsPage() { return <CategoryPageClient category="markets" />; }
