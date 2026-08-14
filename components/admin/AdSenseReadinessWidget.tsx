'use client';

// ================================================================
// GenZ Live — Pre-Publish AdSense Quality Widget Component
// Displays AdSense quality signals inside the CMS Article Editor.
// ================================================================

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface WidgetProps {
  wordCount: number;
  hasAuthor: boolean;
  hasFeaturedImage: boolean;
  similarityScore?: number;
}

export default function AdSenseReadinessWidget({ wordCount, hasAuthor, hasFeaturedImage, similarityScore = 0 }: WidgetProps) {
  const warnings: string[] = [];

  if (wordCount < 250) {
    warnings.push(`Short word count (${wordCount} words). Expand content for better depth.`);
  }
  if (!hasAuthor) {
    warnings.push('Missing staff author profile assignment (E-E-A-T policy).');
  }
  if (!hasFeaturedImage) {
    warnings.push('Missing featured image (Discover & News requirement).');
  }
  if (similarityScore > 40) {
    warnings.push(`High source similarity (${similarityScore}%). Ensure unique commentary.`);
  }

  const isGreen = warnings.length === 0;

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> AdSense & Quality Gate Status
        </h3>
        <Link
          href="/admin/adsense-readiness"
          target="_blank"
          className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
        >
          View Full Audit <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isGreen ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
          <span className="text-xs font-bold text-white">
            {isGreen ? 'GREEN — Pre-Publish Quality Check Passed' : 'YELLOW — Improvements Recommended'}
          </span>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-amber-400">Quality Recommendations</span>
          <ul className="space-y-1 text-xs text-slate-300">
            {warnings.map((w, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
