import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Business News',
  description: 'Business news, startups, entrepreneurship, and the global economy — GenZ Live. Built for the next generation of entrepreneurs.',
});

export default function BusinessPage() {
  return <CategoryPageClient category="business" />;
}
