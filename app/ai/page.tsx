import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'AI News & Artificial Intelligence',
  description: 'Artificial intelligence news, machine learning breakthroughs, and the future of AI — GenZ Live. Stay ahead of the AI revolution.',
});

export default function AIPage() {
  return <CategoryPageClient category="ai" />;
}
