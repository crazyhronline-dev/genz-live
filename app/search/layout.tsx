import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Search News',
  description: 'Search breaking news, in-depth reports, and category topics across GenZ Live.',
  noIndex: true, // Search results must remain noindex to prevent indexing query variations
  canonicalPath: '/search',
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
