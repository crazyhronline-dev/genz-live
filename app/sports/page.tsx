import type { Metadata } from 'next';
import CategoryPageClient from '@/components/news/CategoryPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Sports News',
  description: 'Sports news, esports, cricket, football, and athlete stories — GenZ Live. Beyond the scoreboard for the next generation fan.',
});

export default function SportsPage() {
  return <CategoryPageClient category="sports" />;
}
