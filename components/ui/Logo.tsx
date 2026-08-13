'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND_ASSETS, SITE_CONFIG } from '@/config/site';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
  src?: string;
  customHeight?: number;
  customWidth?: number;
}

const HEIGHT_CLASSES = {
  sm: 'h-7 md:h-8',
  md: 'h-9 md:h-10',
  lg: 'h-12 md:h-14 lg:h-16',
  xl: 'h-16 md:h-20',
} as const;

export default function Logo({
  size = 'lg',
  className = '',
  priority = true,
  src,
  customHeight,
  customWidth,
}: LogoProps) {
  const [liveBrand, setLiveBrand] = useState<{ src?: string; height?: number; width?: number }>({
    src,
    height: customHeight,
    width: customWidth,
  });

  useEffect(() => {
    if (src || customHeight) {
      setLiveBrand({ src, height: customHeight, width: customWidth });
      return;
    }

    fetch('/api/brand')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.headerLogoUrl) {
          setLiveBrand({
            src: data.headerLogoUrl,
            height: data.headerLogoHeight,
            width: data.headerLogoWidth,
          });
        }
      })
      .catch(() => {});
  }, [src, customHeight, customWidth]);

  const heightClass = HEIGHT_CLASSES[size];
  const logoSrc = liveBrand.src || src || BRAND_ASSETS.logoLarge;
  const activeHeight = liveBrand.height ?? customHeight;
  const activeWidth = liveBrand.width ?? customWidth;

  const imageStyle: React.CSSProperties = {};
  if (activeHeight && activeHeight > 0) {
    // Clamp height to max 52px to maintain sleek header design
    const clampedHeight = Math.min(activeHeight, 52);
    imageStyle.height = `${clampedHeight}px`;
  }
  if (activeWidth && activeWidth > 0) {
    imageStyle.maxWidth = `${activeWidth}px`;
  }

  return (
    <Link href="/" className={`group flex items-center shrink-0 ${className}`} aria-label={SITE_CONFIG.name}>
      <img
        src={logoSrc}
        alt={`${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`}
        width={activeWidth || 300}
        height={activeHeight || 100}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={Object.keys(imageStyle).length > 0 ? imageStyle : undefined}
        className={`${Object.keys(imageStyle).length > 0 ? '' : heightClass} w-auto object-contain logo-animated`}
        onError={(e) => { (e.target as HTMLImageElement).src = BRAND_ASSETS.logoLarge; }}
      />
    </Link>
  );
}
