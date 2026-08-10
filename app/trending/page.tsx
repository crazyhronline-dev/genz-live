import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Trending Now',
  description: "What's trending right now — GenZ Live. The most viral, most shared, most talked-about stories from around the world.",
});

export default function TrendingPage() {
  return <CategoryPageClient category="trending" />;
}
