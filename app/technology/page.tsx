import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildCategoryMetadata } from '@/lib/seo';
export const metadata: Metadata = buildCategoryMetadata('tech');
export default function TechnologyPage() { return <CategoryPageClient category="tech" />; }
