import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Entertainment News',
  description: 'Entertainment, movies, music, streaming, and pop culture news — GenZ Live. Your front-row seat to everything that matters.',
});

export default function EntertainmentPage() {
  return <CategoryPageClient category="entertainment" />;
}
