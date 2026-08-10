import React from 'react';
import Image from 'next/image';
import { BRAND_ASSETS, SITE_CONFIG } from '@/config/site';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { height: 32, src: BRAND_ASSETS.logoSmall },
  md: { height: 40, src: BRAND_ASSETS.logoMedium },
  lg: { height: 52, src: BRAND_ASSETS.logoLarge },
} as const;

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const { height, src } = SIZES[size];

  return (
    <a href="/" className={`group flex items-center shrink-0 ${className}`} aria-label={SITE_CONFIG.name}>
      <img
        src={src}
        alt={`${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`}
        style={{ height }}
        className="w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        onError={(e) => { (e.target as HTMLImageElement).src = BRAND_ASSETS.logoMedium; }}
      />
    </a>
  );
}
