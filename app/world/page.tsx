import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
export const metadata: Metadata = buildCategoryMetadata('world');
export default function WorldPage() { return <CategoryPageClient category="world" />; }
