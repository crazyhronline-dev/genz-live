import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'World News',
  description: 'Latest world news and international events — GenZ Live. Stay informed with global coverage from our worldwide correspondents.',
});

export default function WorldPage() {
  return <CategoryPageClient category="world" />;
}
