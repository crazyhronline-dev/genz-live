'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_ASSETS, SITE_CONFIG } from '@/config/site';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const HEIGHT_CLASSES = {
  sm: 'h-10 md:h-11',
  md: 'h-12 md:h-14',
  lg: 'h-14 md:h-16 lg:h-18',
  xl: 'h-20 md:h-24 lg:h-28',
} as const;

export default function Logo({ size = 'lg', className = '', priority = true }: LogoProps) {
  const heightClass = HEIGHT_CLASSES[size];

  return (
    <Link href="/" className={`group flex items-center shrink-0 ${className}`} aria-label={SITE_CONFIG.name}>
      <img
        src={BRAND_ASSETS.logoLarge}
        alt={`${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`${heightClass} w-auto object-contain logo-animated`}
        onError={(e) => { (e.target as HTMLImageElement).src = BRAND_ASSETS.logoLarge; }}
      />
    </Link>
  );
}

