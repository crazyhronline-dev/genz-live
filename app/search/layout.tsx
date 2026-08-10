// app/search/layout.tsx
// Search results pages must be noindex to prevent internal search
// result pages from polluting Google's index (per Phase 5 spec)

import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Search Articles — GenZ Live',
  description: 'Search across published articles, topics, and editorial content on GenZ Live.',
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
