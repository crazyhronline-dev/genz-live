// Navbar.tsx → delegates to the new canonical Header component.
// All existing imports of Navbar continue to work without change.
'use client';

import Header from '@/components/layout/Header';
import type { NavbarProps } from '@/types';

// Map old NavbarProps shape to new Header props shape
export default function Navbar({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  onOpenLiveStream,
  savedCount,
}: NavbarProps) {
  return (
    <Header
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onLiveClick={onOpenLiveStream}
      savedCount={savedCount}
      onSavedClick={() => setActiveCategory('saved')}
    />
  );
}
