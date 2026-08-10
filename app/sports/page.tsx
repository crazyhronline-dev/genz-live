import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
export const metadata: Metadata = buildCategoryMetadata('sports');
export default function SportsPage() { return <CategoryPageClient category="sports" />; }
