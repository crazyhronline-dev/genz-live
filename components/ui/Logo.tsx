'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_ASSETS, SITE_CONFIG } from '@/config/site';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

// Square logo — height drives size, width is auto
const HEIGHTS = {
  sm: 48,
  md: 64,
  lg: 80,
  xl: 100,
} as const;

export default function Logo({ size = 'md', className = '', priority = true }: LogoProps) {
  const h = HEIGHTS[size];

  return (
    <Link href="/" className={`group flex items-center shrink-0 ${className}`} aria-label={SITE_CONFIG.name}>
      <img
        src={BRAND_ASSETS.logoLarge}
        alt={`${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`}
        width={h}
        height={h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ height: h, width: 'auto' }}
        className="object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(139,92,246,0.4)]"
        onError={(e) => { (e.target as HTMLImageElement).src = BRAND_ASSETS.logoLarge; }}
      />
    </Link>
  );
}
