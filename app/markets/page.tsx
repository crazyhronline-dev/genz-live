import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Markets & Finance News',
  description: 'Stock markets, crypto, investments, and financial news — GenZ Live. Real-time market insights for the digital generation.',
});

export default function MarketsPage() {
  return <CategoryPageClient category="markets" />;
}
