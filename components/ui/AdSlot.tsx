import React from 'react';

type AdSize = 'leaderboard' | 'banner' | 'rectangle' | 'square' | 'sidebar';

const AD_DIMENSIONS: Record<AdSize, { w: number; h: number; label: string }> = {
  leaderboard: { w: 728, h: 90,  label: 'Leaderboard — 728×90' },
  banner:      { w: 468, h: 60,  label: 'Banner — 468×60' },
  rectangle:   { w: 336, h: 280, label: 'Large Rectangle — 336×280' },
  square:      { w: 250, h: 250, label: 'Square — 250×250' },
  sidebar:     { w: 300, h: 250, label: 'Medium Rectangle — 300×250' },
};

interface AdSlotProps {
  size?: AdSize;
  /** Google AdSense or custom slot ID — wired up at deployment */
  slotId?: string;
  className?: string;
}

export default function AdSlot({ size = 'rectangle', slotId, className = '' }: AdSlotProps) {
  const { w, h, label } = AD_DIMENSIONS[size];

  return (
    <div
      className={`flex flex-col items-center justify-center bg-navy-surface border border-dashed border-white/10 rounded-xl text-slate-600 select-none overflow-hidden ${className}`}
      style={{ maxWidth: w, height: h }}
      aria-label="Advertisement slot"
      data-slot-id={slotId}
    >
      <span className="text-[10px] uppercase tracking-widest font-bold mb-1">Advertisement</span>
      <span className="text-[10px] font-mono opacity-50">{label}</span>
    </div>
  );
}
