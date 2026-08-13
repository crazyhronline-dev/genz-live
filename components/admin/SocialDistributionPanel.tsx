'use client';

// ================================================================
// GenZ Live — Social Media Distribution Panel Component
// Copy-ready posts for X, FB, IG, Telegram, WhatsApp with UTM tags.
// ================================================================

import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { SocialDistributionPackage } from '@/lib/growth/socialDistributionEngine';

interface SocialDistributionPanelProps {
  packageData: SocialDistributionPackage;
}

export default function SocialDistributionPanel({ packageData }: SocialDistributionPanelProps) {
  const [activeTab, setActiveTab] = useState<'x' | 'facebook' | 'instagram' | 'telegram' | 'whatsapp'>('x');
  const [copied, setCopied] = useState(false);

  const currentPlatform = packageData.platforms[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPlatform.copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-cyan-400" /> Social Media Distribution Package
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">UTM Campaign Ready</span>
      </div>

      <p className="text-xs font-bold text-white truncate">{packageData.articleTitle}</p>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800 pb-2 text-xs">
        {(['x', 'facebook', 'instagram', 'telegram', 'whatsapp'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-all ${
              activeTab === tab ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Copy Box */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-slate-300 relative whitespace-pre-wrap">
        {currentPlatform.copy}
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>

      <div className="text-[10px] text-slate-400 flex items-center justify-between">
        <span>Character Count: <strong>{currentPlatform.charCount} chars</strong></span>
        <span>UTM Link: <code className="text-cyan-400">{currentPlatform.utmUrl}</code></span>
      </div>
    </div>
  );
}
