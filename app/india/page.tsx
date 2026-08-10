import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'India News',
  description: 'Breaking India news, politics, economy, and culture — GenZ Live. Your go-to source for everything happening across India.',
});

export default function IndiaPage() {
  return <CategoryPageClient category="india" />;
}
