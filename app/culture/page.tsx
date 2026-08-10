import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Culture & Lifestyle',
  description: 'Culture, art, fashion, identity, and lifestyle news — GenZ Live. The stories that define how we live and who we are.',
});

export default function CulturePage() {
  return <CategoryPageClient category="culture" />;
}
