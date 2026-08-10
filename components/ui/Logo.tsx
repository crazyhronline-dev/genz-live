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
  sm: 'h-9 md:h-10',
  md: 'h-11 md:h-12',
  lg: 'h-12 md:h-14 lg:h-16',
  xl: 'h-14 md:h-16 lg:h-18',
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
        className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(139,92,246,0.35)]`}
        onError={(e) => { (e.target as HTMLImageElement).src = BRAND_ASSETS.logoLarge; }}
      />
    </Link>
  );
}

