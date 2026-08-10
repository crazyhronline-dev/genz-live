'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_ASSETS, SITE_CONFIG } from '@/config/site';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const SIZES = {
  sm: { height: 44, width: 132, src: BRAND_ASSETS.logoMedium },
  md: { height: 56, width: 168, src: BRAND_ASSETS.logoLarge },
  lg: { height: 72, width: 216, src: BRAND_ASSETS.logoLarge },
  xl: { height: 90, width: 270, src: BRAND_ASSETS.logoLarge },
} as const;

export default function Logo({ size = 'md', className = '', priority = true }: LogoProps) {
  const { height, width, src } = SIZES[size];

  return (
    <Link href="/" className={`group flex items-center shrink-0 ${className}`} aria-label={SITE_CONFIG.name}>
      <img
        src={src}
        alt={`${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-11 sm:h-14 md:h-16 lg:h-18 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        onError={(e) => { (e.target as HTMLImageElement).src = BRAND_ASSETS.logoLarge; }}
      />
    </Link>
  );
}
