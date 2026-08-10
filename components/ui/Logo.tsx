'use client';

import React from 'react';
import { BRAND_ASSETS, SITE_CONFIG } from '@/config/site';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
}

const SIZES = {
  sm: { height: 32, width: 96, src: BRAND_ASSETS.logoSmall },
  md: { height: 40, width: 120, src: BRAND_ASSETS.logoMedium },
  lg: { height: 52, width: 156, src: BRAND_ASSETS.logoLarge },
} as const;

export default function Logo({ size = 'md', className = '', priority = true }: LogoProps) {
  const { height, width, src } = SIZES[size];

  return (
    <a href="/" className={`group flex items-center shrink-0 ${className}`} aria-label={SITE_CONFIG.name}>
      <img
        src={src}
        alt={`${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ height }}
        className="w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        onError={(e) => { (e.target as HTMLImageElement).src = BRAND_ASSETS.logoMedium; }}
      />
    </a>
  );
}
