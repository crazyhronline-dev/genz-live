import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Technology News',
  description: 'Latest technology news, gadgets, software, and digital trends — GenZ Live. The tech pulse for the next generation.',
});

export default function TechnologyPage() {
  return <CategoryPageClient category="tech" />;
}
