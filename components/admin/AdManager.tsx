'use client';

import { useState } from 'react';
import { AdSettings } from '@/lib/adSettings';
import { saveAdSettingsAction } from '@/app/admin/actions';
import {
  Megaphone,
  Save,
  Upload,
  Code,
  Image as ImageIcon,
  Sparkles,
  Eye,
  ExternalLink,
  Maximize2,
  Sliders,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';

interface AdManagerProps {
  initialSettings: AdSettings;
}

export default function AdManager({ initialSettings }: AdManagerProps) {
  const [activeTab, setActiveTab] = useState<'canvas' | 'form'>('canvas');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Leaderboard
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(initialSettings.leaderboardEnabled);
  const [leaderboardType, setLeaderboardType] = useState<'image' | 'script'>(initialSettings.leaderboardType);
  const [leaderboardImage, setLeaderboardImage] = useState(initialSettings.leaderboardImage);
  const [leaderboardLink, setLeaderboardLink] = useState(initialSettings.leaderboardLink);
  const [leaderboardTitle, setLeaderboardTitle] = useState(initialSettings.leaderboardTitle || 'Sponsored Partner');
  const [leaderboardScript, setLeaderboardScript] = useState(initialSettings.leaderboardScript);

  // Sidebar
  const [sidebarEnabled, setSidebarEnabled] = useState(initialSettings.sidebarEnabled);
  const [sidebarType, setSidebarType] = useState<'image' | 'script'>(initialSettings.sidebarType);
  const [sidebarImage, setSidebarImage] = useState(initialSettings.sidebarImage);
  const [sidebarLink, setSidebarLink] = useState(initialSettings.sidebarLink);
  const [sidebarTitle, setSidebarTitle] = useState(initialSettings.sidebarTitle || 'Sponsored Partner');
  const [sidebarScript, setSidebarScript] = useState(initialSettings.sidebarScript);

  // Mid Banner
  const [midBannerEnabled, setMidBannerEnabled] = useState(initialSettings.midBannerEnabled);
  const [midBannerType, setMidBannerType] = useState<'image' | 'script'>(initialSettings.midBannerType);
  const [midBannerImage, setMidBannerImage] = useState(initialSettings.midBannerImage);
  const [midBannerLink, setMidBannerLink] = useState(initialSettings.midBannerLink);
  const [midBannerTitle, setMidBannerTitle] = useState(initialSettings.midBannerTitle || 'Sponsored Partner');
  const [midBannerScript, setMidBannerScript] = useState(initialSettings.midBannerScript);

  // In-Article
  const [inArticleEnabled, setInArticleEnabled] = useState(initialSettings.inArticleEnabled);
  const [inArticleType, setInArticleType] = useState<'image' | 'script'>(initialSettings.inArticleType);
  const [inArticleImage, setInArticleImage] = useState(initialSettings.inArticleImage);
  const [inArticleLink, setInArticleLink] = useState(initialSettings.inArticleLink);
  const [inArticleTitle, setInArticleTitle] = useState(initialSettings.inArticleTitle || 'Sponsored Partner');
  const [inArticleScript, setInArticleScript] = useState(initialSettings.inArticleScript);

  // Left Skyscraper
  const [leftSkyscraperEnabled, setLeftSkyscraperEnabled] = useState(initialSettings.leftSkyscraperEnabled);
  const [leftSkyscraperType, setLeftSkyscraperType] = useState<'image' | 'script'>(initialSettings.leftSkyscraperType);
  const [leftSkyscraperImage, setLeftSkyscraperImage] = useState(initialSettings.leftSkyscraperImage);
  const [leftSkyscraperLink, setLeftSkyscraperLink] = useState(initialSettings.leftSkyscraperLink);
  const [leftSkyscraperTitle, setLeftSkyscraperTitle] = useState(initialSettings.leftSkyscraperTitle || 'Sponsored Partner');
  const [leftSkyscraperScript, setLeftSkyscraperScript] = useState(initialSettings.leftSkyscraperScript);

  // Right Skyscraper
  const [rightSkyscraperEnabled, setRightSkyscraperEnabled] = useState(initialSettings.rightSkyscraperEnabled);
  const [rightSkyscraperType, setRightSkyscraperType] = useState<'image' | 'script'>(initialSettings.rightSkyscraperType);
  const [rightSkyscraperImage, setRightSkyscraperImage] = useState(initialSettings.rightSkyscraperImage);
  const [rightSkyscraperLink, setRightSkyscraperLink] = useState(initialSettings.rightSkyscraperLink);
  const [rightSkyscraperTitle, setRightSkyscraperTitle] = useState(initialSettings.rightSkyscraperTitle || 'Sponsored Partner');
  const [rightSkyscraperScript, setRightSkyscraperScript] = useState(initialSettings.rightSkyscraperScript);

  // Before-Footer Pre-Footer Banner (Slot 7)
  const [footerBannerEnabled, setFooterBannerEnabled] = useState(initialSettings.footerBannerEnabled);
  const [footerBannerType, setFooterBannerType] = useState<'image' | 'script'>(initialSettings.footerBannerType);
  const [footerBannerImage, setFooterBannerImage] = useState(initialSettings.footerBannerImage);
  const [footerBannerLink, setFooterBannerLink] = useState(initialSettings.footerBannerLink);
  const [footerBannerTitle, setFooterBannerTitle] = useState(initialSettings.footerBannerTitle || 'Sponsored Pre-Footer Partner');
  const [footerBannerScript, setFooterBannerScript] = useState(initialSettings.footerBannerScript);

  const [adsenseId, setAdsenseId] = useState(initialSettings.adsenseId);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // File Upload Helper
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
    inputName: string,
    slotName: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(slotName);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setter(data.url);
          const textInput = document.querySelector(`input[name="${inputName}"]`) as HTMLInputElement;
          if (textInput) textInput.value = data.url;
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(null);
    }
  };

  return (
    <form action={saveAdSettingsAction} className="space-y-8">
      {/* Hidden inputs for ad mode types */}
      <input type="hidden" name="leaderboardType" value={leaderboardType} />
      <input type="hidden" name="sidebarType" value={sidebarType} />
      <input type="hidden" name="midBannerType" value={midBannerType} />
      <input type="hidden" name="inArticleType" value={inArticleType} />
      <input type="hidden" name="leftSkyscraperType" value={leftSkyscraperType} />
      <input type="hidden" name="rightSkyscraperType" value={rightSkyscraperType} />
      <input type="hidden" name="footerBannerType" value={footerBannerType} />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
              <Megaphone className="w-3 h-3 text-amber-400" /> Revenue & Sponsorship Control
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading mt-2">
            Sponsored Advertisements & Ad Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure sponsored brand campaigns, in-article content ads, skyscraper column ads, or Google AdSense with exact dimension previews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'canvas'
                  ? 'bg-brand-purple text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" /> Exact Ads Canvas & Dimensions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-brand-purple text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Ad Settings Form
            </button>
          </div>

          <button type="submit" className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-glow-purple shrink-0">
            <Save className="w-4 h-4" /> Save Ad Configuration
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* EXACT ADS-ONLY SPATIAL CANVAS (ADS ONLY WITH EXACT DIMENSIONS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
              <Maximize2 className="w-4.5 h-4.5 text-brand-purple" /> Exact Website Ad Placements & Dimensions Canvas
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact spatial layout map displaying ONLY your active ad slots at their exact pixel aspect ratios and rendered sizes across Desktop, Tablet & Mobile viewports.
            </p>
          </div>

          {/* Live Device Viewport Switcher Controls */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                previewDevice === 'desktop' ? 'bg-brand-purple text-white shadow-glow-purple' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop (1440px)
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                previewDevice === 'tablet' ? 'bg-brand-purple text-white shadow-glow-purple' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" /> Tablet (834px)
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                previewDevice === 'mobile' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-glow-amber' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile View (390px)
            </button>
          </div>
        </div>

        {/* 1:1 Scale Screen Grid (Ads Only Layout Map) */}
        <div className="bg-slate-950/95 border-2 border-dashed border-white/15 rounded-2xl p-6 relative space-y-6">
          {/* Section Tag */}
          <div className="absolute top-2 left-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse"></span> EXACT PLACEMENT GRID ({previewDevice.toUpperCase()} CANVAS)
          </div>

          {previewDevice === 'mobile' ? (
            /* 📱 MOBILE VIEWPORT SPATIAL CANVAS (390px FRAME SIMULATION) */
            <div className="max-w-[400px] mx-auto border-4 border-slate-800 rounded-[36px] p-5 bg-slate-950 shadow-2xl space-y-4 relative font-sans mt-4">
              {/* Mobile Phone Notch */}
              <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>
              <div className="text-[10px] font-mono font-bold text-amber-400 text-center uppercase tracking-widest bg-amber-500/10 py-1.5 rounded-full border border-amber-500/20 flex items-center justify-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" /> Mobile Screen Layout (390px)
              </div>

              {/* 1. Header Top Ad (Only 1 Ad on Top) */}
              <div className="border border-amber-500/40 bg-amber-500/5 p-3 rounded-2xl text-center space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-amber-400">
                  <span>HEADER TOP AD (SLOT 1)</span>
                  <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[8px]">ONLY 1 AD AT TOP</span>
                </div>
                <div className="h-14 bg-amber-500/20 rounded-xl flex items-center justify-center font-bold text-amber-300 text-xs border border-amber-500/30">
                  {leaderboardEnabled ? (leaderboardTitle || 'Top Leaderboard Banner Active') : 'Header Top Ad Disabled'}
                </div>
              </div>

              {/* Hero Stories Section */}
              <div className="h-20 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center justify-center text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">
                📰 EDITORIAL HERO STORIES SECTION
              </div>

              {/* 2. Slot 3: Left Skyscraper Ad (Mobile Placement 1: After Hero) */}
              <div className="border border-purple-500/40 bg-purple-500/5 p-3 rounded-2xl text-center space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-purple-300">
                  <span>MOBILE AD 1 (SLOT 3: LEFT SKYSCRAPER)</span>
                  <span className="bg-purple-500/20 px-2 py-0.5 rounded text-[8px]">AFTER HERO STORIES</span>
                </div>
                <div className="h-16 bg-purple-500/20 rounded-xl flex items-center justify-center font-bold text-purple-300 text-xs border border-purple-500/30">
                  {leftSkyscraperEnabled ? (leftSkyscraperTitle || 'Left Skyscraper Mobile Ad Active') : 'Left Skyscraper Disabled'}
                </div>
              </div>

              {/* News Feed Block */}
              <div className="h-24 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center justify-center text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">
                🗞️ CATEGORY NEWS FEED & ARTICLES
              </div>

              {/* 3. Slot 5: Sidebar Box Ad */}
              <div className="border border-pink-500/40 bg-pink-500/5 p-3 rounded-2xl text-center space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-pink-400">
                  <span>SIDEBAR RECTANGLE AD (SLOT 5)</span>
                  <span className="bg-pink-500/20 px-2 py-0.5 rounded text-[8px]">300 × 250 BOX</span>
                </div>
                <div className="h-20 bg-pink-500/20 rounded-xl flex items-center justify-center font-bold text-pink-300 text-xs border border-pink-500/30">
                  {sidebarEnabled ? (sidebarTitle || '300x250 Rectangle Box Active') : 'Sidebar Box Ad Disabled'}
                </div>
              </div>

              {/* 4. Slot 4: Right Skyscraper Ad (Mobile Placement 2: Mid-Feed) */}
              <div className="border border-cyan-500/40 bg-cyan-500/5 p-3 rounded-2xl text-center space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-cyan-300">
                  <span>MOBILE AD 2 (SLOT 4: RIGHT SKYSCRAPER)</span>
                  <span className="bg-cyan-500/20 px-2 py-0.5 rounded text-[8px]">MID-FEED AFTER INDIA NEWS</span>
                </div>
                <div className="h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center font-bold text-cyan-300 text-xs border border-cyan-500/30">
                  {rightSkyscraperEnabled ? (rightSkyscraperTitle || 'Right Skyscraper Mobile Ad Active') : 'Right Skyscraper Disabled'}
                </div>
              </div>

              {/* 5. Slot 7: Pre-Footer Banner Ad */}
              <div className="border border-purple-500/40 bg-purple-500/5 p-3 rounded-2xl text-center space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-purple-400">
                  <span>PRE-FOOTER BANNER (SLOT 7)</span>
                  <span className="bg-purple-500/20 px-2 py-0.5 rounded text-[8px]">BEFORE FOOTER</span>
                </div>
                <div className="h-14 bg-purple-500/20 rounded-xl flex items-center justify-center font-bold text-purple-300 text-xs border border-purple-500/30">
                  {footerBannerEnabled ? (footerBannerTitle || 'Pre-Footer Banner Active') : 'Pre-Footer Banner Disabled'}
                </div>
              </div>
            </div>
          ) : (
            /* 💻 DESKTOP & TABLET VIEWPORT SPATIAL CANVAS */
            <>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* PLACEMENT 1: TOP HEADER LEADERBOARD BANNER (970 x 90 px) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="pt-4">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1.5 text-amber-400 uppercase tracking-wider">
              <span>Slot 1: Top Leaderboard Banner (Header Top)</span>
              <span className="bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">Exact Size: 970 × 90 px</span>
            </div>

            <div className={`relative rounded-xl border-2 transition-all p-2 ${
              leaderboardEnabled ? 'border-amber-500/50 bg-amber-500/5 shadow-lg shadow-amber-500/5' : 'border-slate-800 bg-slate-900/40 opacity-60'
            }`}>
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 bg-slate-950/90 rounded-t-lg border-b border-white/10">
                <span className="text-amber-400 font-extrabold flex items-center gap-1">
                  ✨ {leaderboardTitle || 'Sponsored Partner'}
                </span>
                <span className="text-slate-400 font-mono text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                  LEADERBOARD 970x90
                </span>
              </div>

              {leaderboardEnabled ? (
                leaderboardType === 'image' && leaderboardImage ? (
                  <div className="relative mt-1.5 rounded-lg overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={leaderboardImage} alt="Leaderboard Ad" className="w-full h-24 md:h-28 object-cover" />
                    {leaderboardLink && (
                      <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/80 text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
                        <span>Visit Sponsor</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-24 bg-slate-900/80 rounded-lg flex items-center justify-center font-mono text-xs text-slate-300 p-2 border border-dashed border-amber-500/30">
                    {leaderboardScript || 'AdSense / Script Code Active (970x90)'}
                  </div>
                )
              ) : (
                <div className="h-20 rounded-lg flex items-center justify-center font-mono text-xs text-slate-600 bg-slate-900/30">
                  SLOT DISABLED (Toggle active in form below)
                </div>
              )}
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* THREE-COLUMN SPATIAL LAYOUT (LEFT GUTTER | MAIN CONTENT | RIGHT GUTTER) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-12 gap-6 items-stretch">
            {/* ───────────────────────────────────────────────────────────── */}
            {/* PLACEMENT 3: LEFT SKYSCRAPER COLUMN (160 x 600 px - TALL VERTICAL DIMENSION) */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="col-span-12 md:col-span-3 space-y-2 flex flex-col">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                <span>Slot 3: Left Outer Column</span>
                <span className="bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30 font-extrabold">160 × 600 px (Tall Skyscraper)</span>
              </div>

              <div className={`relative rounded-xl border-2 transition-all p-2.5 flex-1 flex flex-col justify-between min-h-[580px] ${
                leftSkyscraperEnabled ? 'border-purple-500/50 bg-purple-500/5 shadow-lg shadow-purple-500/5' : 'border-slate-800 bg-slate-900/40 opacity-60'
              }`}>
                <div className="text-[10px] font-bold text-purple-300 bg-slate-950/90 px-2 py-1.5 rounded-t-lg text-center border-b border-white/10 uppercase tracking-wider truncate flex items-center justify-between">
                  <span>{leftSkyscraperTitle || 'Left Skyscraper'}</span>
                  <span className="text-[8px] font-mono text-purple-400 bg-purple-500/20 px-1 py-0.5 rounded">160x600</span>
                </div>

                {leftSkyscraperEnabled ? (
                  leftSkyscraperType === 'image' && leftSkyscraperImage ? (
                    <div className="relative my-3 rounded-xl overflow-hidden flex-1 border border-white/15 bg-slate-950 flex flex-col">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={leftSkyscraperImage} alt="Left Skyscraper" className="w-full h-full object-cover rounded-lg" />
                      {leftSkyscraperLink && (
                        <div className="absolute bottom-3 left-2 right-2 px-2 py-1 rounded-lg bg-black/90 text-[9px] font-mono text-white text-center truncate border border-white/20 shadow-lg">
                          {leftSkyscraperLink}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="my-3 flex-1 bg-slate-900/80 rounded-xl flex items-center justify-center font-mono text-xs text-slate-300 p-3 text-center border border-dashed border-purple-500/30">
                      {leftSkyscraperScript || 'Skyscraper Script (160x600)'}
                    </div>
                  )
                ) : (
                  <div className="flex-1 rounded-xl flex items-center justify-center font-mono text-xs text-slate-600 bg-slate-900/30 text-center p-3">
                    LEFT SKYSCRAPER DISABLED (160 × 600)
                  </div>
                )}

                <div className="text-[9px] font-mono font-bold text-purple-400 text-center uppercase tracking-widest bg-slate-950/90 py-1.5 rounded-b-lg border-t border-white/10">
                  ↕ 160 × 600 TALL GUTTER SKYSCRAPER
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* MAIN CENTER COLUMN (IN-ARTICLE 728x90 & MID-FEED 728x90) */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="col-span-12 md:col-span-6 space-y-6 flex flex-col justify-between">
              {/* PLACEMENT 2: IN-ARTICLE CONTENT AD (728 x 90 px) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <span>Slot 2: In-Article Content Ad (Inside Paragraphs)</span>
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">728 × 90 px</span>
                </div>

                <div className={`relative rounded-xl border-2 transition-all p-2 ${
                  inArticleEnabled ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' : 'border-slate-800 bg-slate-900/40 opacity-60'
                }`}>
                  <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 bg-slate-950/90 rounded-t-lg border-b border-white/10">
                    <span className="text-amber-400 font-extrabold flex items-center gap-1">
                      ✨ {inArticleTitle || 'Sponsored Article Partner'}
                    </span>
                    <span className="text-slate-400 font-mono text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                      IN-ARTICLE 728x90
                    </span>
                  </div>

                  {inArticleEnabled ? (
                    inArticleType === 'image' && inArticleImage ? (
                      <div className="relative mt-1.5 rounded-lg overflow-hidden border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={inArticleImage} alt="In-Article Ad" className="w-full h-28 object-cover" />
                        {inArticleLink && (
                          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/80 text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
                            <span>Visit Sponsor</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-28 bg-slate-900/80 rounded-lg flex items-center justify-center font-mono text-xs text-slate-300 p-2 border border-dashed border-emerald-500/30">
                        {inArticleScript || 'In-Article Script Code Active (728x90)'}
                      </div>
                    )
                  ) : (
                    <div className="h-20 rounded-lg flex items-center justify-center font-mono text-xs text-slate-600 bg-slate-900/30">
                      IN-ARTICLE AD DISABLED
                    </div>
                  )}
                </div>
              </div>

              {/* PLACEMENT 5: SIDEBAR RECTANGLE BOX (300 x 250 px EXACT RECTANGLE DIMENSION) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                  <span>Slot 5: Sidebar Rectangle Box (Right Sidebar)</span>
                  <span className="bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30 font-extrabold">300 × 250 px (Medium Rectangle)</span>
                </div>

                <div className={`relative rounded-xl border-2 transition-all p-2.5 ${
                  sidebarEnabled ? 'border-purple-500/50 bg-purple-500/5 shadow-lg shadow-purple-500/5' : 'border-slate-800 bg-slate-900/40 opacity-60'
                }`}>
                  <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-400 bg-slate-950/90 rounded-t-lg border-b border-white/10">
                    <span className="text-amber-400 font-extrabold flex items-center gap-1 truncate">
                      ✨ {sidebarTitle || 'Sponsored Sidebar Partner'}
                    </span>
                    <span className="text-purple-300 font-mono text-[9px] bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                      300 × 250 BOX
                    </span>
                  </div>

                  {sidebarEnabled ? (
                    sidebarType === 'image' && sidebarImage ? (
                      <div className="relative mt-2 rounded-lg overflow-hidden border border-white/10 aspect-[300/250] min-h-[240px] flex items-center justify-center bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sidebarImage} alt="Sidebar Box Ad" className="w-full h-full object-cover rounded-lg" />
                        {sidebarLink && (
                          <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 shadow-xl">
                            <span>Visit Sponsor</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="min-h-[240px] aspect-[300/250] bg-slate-900/80 rounded-lg flex flex-col items-center justify-center font-mono text-xs text-slate-300 p-4 text-center border border-dashed border-purple-500/40 my-2">
                        <span className="text-purple-400 font-bold mb-1">300 × 250 RECTANGLE BOX</span>
                        <span>{sidebarScript || 'Sidebar AdSense / Custom Script Active'}</span>
                      </div>
                    )
                  ) : (
                    <div className="min-h-[200px] aspect-[300/250] rounded-lg flex items-center justify-center font-mono text-xs text-slate-600 bg-slate-900/30 text-center p-4 my-2">
                      SIDEBAR BOX DISABLED (300 × 250 PX)
                    </div>
                  )}

                  <div className="text-[9px] font-mono font-bold text-purple-400 text-center uppercase tracking-widest bg-slate-950/90 py-1 rounded-b-lg border-t border-white/10 mt-1">
                    📐 300 × 250 PX MEDIUM RECTANGLE BOX
                  </div>
                </div>
              </div>

              {/* PLACEMENT 6: MID-PAGE FEED BANNER (728 x 90 px) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <span>Slot 6: Mid-Page Feed Banner (In-Feed Homepage)</span>
                  <span className="bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">728 × 90 px</span>
                </div>

                <div className={`relative rounded-xl border-2 transition-all p-2 ${
                  midBannerEnabled ? 'border-cyan-500/50 bg-cyan-500/5 shadow-lg shadow-cyan-500/5' : 'border-slate-800 bg-slate-900/40 opacity-60'
                }`}>
                  <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 bg-slate-950/90 rounded-t-lg border-b border-white/10">
                    <span className="text-amber-400 font-extrabold flex items-center gap-1">
                      ✨ {midBannerTitle || 'Sponsored Partner'}
                    </span>
                    <span className="text-slate-400 font-mono text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                      IN-FEED 728x90
                    </span>
                  </div>

                  {midBannerEnabled ? (
                    midBannerType === 'image' && midBannerImage ? (
                      <div className="relative mt-1.5 rounded-lg overflow-hidden border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={midBannerImage} alt="Mid Banner" className="w-full h-24 object-cover" />
                        {midBannerLink && (
                          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/80 text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
                            <span>Learn More</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-24 bg-slate-900/80 rounded-lg flex items-center justify-center font-mono text-xs text-slate-300 p-2 border border-dashed border-cyan-500/30">
                        {midBannerScript || 'Mid Feed Script Code Active (728x90)'}
                      </div>
                    )
                  ) : (
                    <div className="h-20 rounded-lg flex items-center justify-center font-mono text-xs text-slate-600 bg-slate-900/30">
                      MID FEED BANNER DISABLED
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* PLACEMENT 4: RIGHT SKYSCRAPER COLUMN (160 x 600 px - TALL VERTICAL DIMENSION) */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="col-span-12 md:col-span-3 space-y-2 flex flex-col">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <span>Slot 4: Right Outer Column</span>
                <span className="bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30 font-extrabold">160 × 600 px (Tall Skyscraper)</span>
              </div>

              <div className={`relative rounded-xl border-2 transition-all p-2.5 flex-1 flex flex-col justify-between min-h-[580px] ${
                rightSkyscraperEnabled ? 'border-cyan-500/50 bg-cyan-500/5 shadow-lg shadow-cyan-500/5' : 'border-slate-800 bg-slate-900/40 opacity-60'
              }`}>
                <div className="text-[10px] font-bold text-cyan-300 bg-slate-950/90 px-2 py-1.5 rounded-t-lg text-center border-b border-white/10 uppercase tracking-wider truncate flex items-center justify-between">
                  <span>{rightSkyscraperTitle || 'Right Skyscraper'}</span>
                  <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/20 px-1 py-0.5 rounded">160x600</span>
                </div>

                {rightSkyscraperEnabled ? (
                  rightSkyscraperType === 'image' && rightSkyscraperImage ? (
                    <div className="relative my-3 rounded-xl overflow-hidden flex-1 border border-white/15 bg-slate-950 flex flex-col">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rightSkyscraperImage} alt="Right Skyscraper" className="w-full h-full object-cover rounded-lg" />
                      {rightSkyscraperLink && (
                        <div className="absolute bottom-3 left-2 right-2 px-2 py-1 rounded-lg bg-black/90 text-[9px] font-mono text-white text-center truncate border border-white/20 shadow-lg">
                          {rightSkyscraperLink}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="my-3 flex-1 bg-slate-900/80 rounded-xl flex items-center justify-center font-mono text-xs text-slate-300 p-3 text-center border border-dashed border-cyan-500/30">
                      {rightSkyscraperScript || 'Right Skyscraper Script (160x600)'}
                    </div>
                  )
                ) : (
                  <div className="flex-1 rounded-xl flex items-center justify-center font-mono text-xs text-slate-600 bg-slate-900/30 text-center p-3">
                    RIGHT SKYSCRAPER DISABLED (160 × 600)
                  </div>
                )}

                <div className="text-[9px] font-mono font-bold text-cyan-400 text-center uppercase tracking-widest bg-slate-950/90 py-1.5 rounded-b-lg border-t border-white/10">
                  ↕ 160 × 600 TALL GUTTER SKYSCRAPER
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* PLACEMENT 7: BEFORE-FOOTER PRE-FOOTER BANNER (970 x 90 px) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="pt-4 border-t border-dashed border-white/15">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1.5 text-purple-400 uppercase tracking-wider">
              <span>Slot 7: Before-Footer Pre-Footer Banner (Pre-Footer Ad)</span>
              <span className="bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">Exact Size: 970 × 90 px</span>
            </div>

            <div className={`relative rounded-xl border-2 transition-all p-2 ${
              footerBannerEnabled ? 'border-purple-500/50 bg-purple-500/5 shadow-lg shadow-purple-500/5 anim-ad-footerbanner' : 'border-slate-800 bg-slate-900/40 opacity-60'
            }`}>
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 bg-slate-950/90 rounded-t-lg border-b border-white/10">
                <span className="text-purple-300 font-extrabold flex items-center gap-1">
                  ✨ {footerBannerTitle || 'Sponsored Pre-Footer Partner'}
                </span>
                <span className="text-slate-400 font-mono text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                  PRE-FOOTER 970x90
                </span>
              </div>

              {footerBannerEnabled ? (
                footerBannerType === 'image' && footerBannerImage ? (
                  <div className="relative mt-1.5 rounded-lg overflow-hidden border border-white/10 group">
                    <div className="flash-overlay-footerbanner"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={footerBannerImage} alt="Footer Banner Ad" className="w-full h-24 md:h-28 object-cover" />
                    {footerBannerLink && (
                      <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/80 text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
                        <span>Explore Partner</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-24 bg-slate-900/80 rounded-lg flex items-center justify-center font-mono text-xs text-slate-300 p-2 border border-dashed border-purple-500/30">
                    {footerBannerScript || 'Pre-Footer Script / AdSense Code Active (970x90)'}
                  </div>
                )
              ) : (
                <div className="h-20 rounded-lg flex items-center justify-center font-mono text-xs text-slate-600 bg-slate-900/30">
                  PRE-FOOTER BANNER DISABLED (Toggle active in form below)
                </div>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FORM CONFIGURATION PANEL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={activeTab === 'form' ? 'space-y-8' : 'space-y-8'}>
        {/* SLOT 1: TOP HEADER LEADERBOARD AD BANNER */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-cyan" /> 1. Top Leaderboard Banner (Header Top Ad)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">High-visibility banner displayed at the top of Homepage & Category pages (Recommended size: 970x90 or 728x90)</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="leaderboardEnabled"
                defaultChecked={initialSettings.leaderboardEnabled}
                onChange={(e) => setLeaderboardEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">{leaderboardEnabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>

          <div className={leaderboardEnabled ? 'space-y-5' : 'hidden space-y-5'}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLeaderboardType('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  leaderboardType === 'image' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Sponsored Banner Image
              </button>
              <button
                type="button"
                onClick={() => setLeaderboardType('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  leaderboardType === 'script' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> HTML / AdSense Script Code
              </button>
            </div>

            {leaderboardType === 'image' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Banner Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="leaderboardImage"
                      defaultValue={initialSettings.leaderboardImage}
                      onChange={(e) => setLeaderboardImage(e.target.value)}
                      placeholder="Paste image URL or click Upload..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                    />
                    <label className="btn-secondary text-xs py-2 px-3 shrink-0 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> {isUploading === 'leaderboard' ? '...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setLeaderboardImage, 'leaderboardImage', 'leaderboard')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Target Link URL</label>
                  <input
                    type="url"
                    name="leaderboardLink"
                    defaultValue={initialSettings.leaderboardLink}
                    onChange={(e) => setLeaderboardLink(e.target.value)}
                    placeholder="https://advertiser-website.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Sponsorship Badge Label</label>
                  <input
                    type="text"
                    name="leaderboardTitle"
                    defaultValue={initialSettings.leaderboardTitle || 'Sponsored Partner'}
                    onChange={(e) => setLeaderboardTitle(e.target.value)}
                    placeholder="Sponsored Partner"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">AdSense / Script Code Snippet</label>
                <textarea
                  name="leaderboardScript"
                  rows={4}
                  defaultValue={initialSettings.leaderboardScript}
                  onChange={(e) => setLeaderboardScript(e.target.value)}
                  placeholder="<script async src='https://pagead2.googlesyndication.com/...'></script>"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* SLOT 2: IN-ARTICLE BODY CONTENT AD BANNER */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> 2. In-Article Content Ad (Inside Article Text)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">High-engagement banner automatically embedded inside the article body content paragraphs (Recommended size: 728x90 or 750x200)</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="inArticleEnabled"
                defaultChecked={initialSettings.inArticleEnabled}
                onChange={(e) => setInArticleEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">{inArticleEnabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>

          <div className={inArticleEnabled ? 'space-y-5' : 'hidden space-y-5'}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInArticleType('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  inArticleType === 'image' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Sponsored Banner Image
              </button>
              <button
                type="button"
                onClick={() => setInArticleType('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  inArticleType === 'script' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> HTML / AdSense Script Code
              </button>
            </div>

            {inArticleType === 'image' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Banner Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="inArticleImage"
                      data-testid="inArticleImageInput"
                      defaultValue={initialSettings.inArticleImage}
                      onChange={(e) => setInArticleImage(e.target.value)}
                      placeholder="Paste image URL or click Upload..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                    />
                    <label className="btn-secondary text-xs py-2 px-3 shrink-0 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> {isUploading === 'inArticle' ? '...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setInArticleImage, 'inArticleImage', 'inArticle')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Target Link URL</label>
                  <input
                    type="url"
                    name="inArticleLink"
                    defaultValue={initialSettings.inArticleLink}
                    onChange={(e) => setInArticleLink(e.target.value)}
                    placeholder="https://advertiser-website.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Sponsorship Badge Label</label>
                  <input
                    type="text"
                    name="inArticleTitle"
                    defaultValue={initialSettings.inArticleTitle || 'Sponsored Partner'}
                    onChange={(e) => setInArticleTitle(e.target.value)}
                    placeholder="Sponsored Partner"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">AdSense / Script Code Snippet</label>
                <textarea
                  name="inArticleScript"
                  rows={4}
                  defaultValue={initialSettings.inArticleScript}
                  onChange={(e) => setInArticleScript(e.target.value)}
                  placeholder="<script async src='https://pagead2.googlesyndication.com/...'></script>"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* SLOT 3: LEFT OUTER SKYSCRAPER COLUMN AD (GUTTER) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> 3. Left Skyscraper Column Ad (Left Outer Margin Gutter)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Vertical skyscraper banner running down the left blank outer margin on wide desktop screens (Recommended size: 160x600 or 120x600)</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="leftSkyscraperEnabled"
                defaultChecked={initialSettings.leftSkyscraperEnabled}
                onChange={(e) => setLeftSkyscraperEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">{leftSkyscraperEnabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>

          <div className={leftSkyscraperEnabled ? 'space-y-5' : 'hidden space-y-5'}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLeftSkyscraperType('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  leftSkyscraperType === 'image' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Sponsored Skyscraper Image
              </button>
              <button
                type="button"
                onClick={() => setLeftSkyscraperType('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  leftSkyscraperType === 'script' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> HTML / AdSense Script Code
              </button>
            </div>

            {leftSkyscraperType === 'image' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Banner Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="leftSkyscraperImage"
                      defaultValue={initialSettings.leftSkyscraperImage}
                      onChange={(e) => setLeftSkyscraperImage(e.target.value)}
                      placeholder="Paste image URL or click Upload..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                    />
                    <label className="btn-secondary text-xs py-2 px-3 shrink-0 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> {isUploading === 'leftSkyscraper' ? '...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setLeftSkyscraperImage, 'leftSkyscraperImage', 'leftSkyscraper')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Target Link URL</label>
                  <input
                    type="url"
                    name="leftSkyscraperLink"
                    defaultValue={initialSettings.leftSkyscraperLink}
                    onChange={(e) => setLeftSkyscraperLink(e.target.value)}
                    placeholder="https://advertiser-website.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Sponsorship Badge Label</label>
                  <input
                    type="text"
                    name="leftSkyscraperTitle"
                    defaultValue={initialSettings.leftSkyscraperTitle || 'Sponsored Partner'}
                    onChange={(e) => setLeftSkyscraperTitle(e.target.value)}
                    placeholder="Sponsored Partner"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">AdSense / Script Code Snippet</label>
                <textarea
                  name="leftSkyscraperScript"
                  rows={4}
                  defaultValue={initialSettings.leftSkyscraperScript}
                  onChange={(e) => setLeftSkyscraperScript(e.target.value)}
                  placeholder="<script async src='https://pagead2.googlesyndication.com/...'></script>"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* SLOT 4: RIGHT OUTER SKYSCRAPER COLUMN AD (GUTTER) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> 4. Right Skyscraper Column Ad (Right Outer Margin Gutter)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Vertical skyscraper banner running down the right blank outer margin on wide desktop screens (Recommended size: 160x600 or 120x600)</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rightSkyscraperEnabled"
                defaultChecked={initialSettings.rightSkyscraperEnabled}
                onChange={(e) => setRightSkyscraperEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">{rightSkyscraperEnabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>

          <div className={rightSkyscraperEnabled ? 'space-y-5' : 'hidden space-y-5'}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRightSkyscraperType('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  rightSkyscraperType === 'image' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Sponsored Skyscraper Image
              </button>
              <button
                type="button"
                onClick={() => setRightSkyscraperType('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  rightSkyscraperType === 'script' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> HTML / AdSense Script Code
              </button>
            </div>

            {rightSkyscraperType === 'image' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Banner Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="rightSkyscraperImage"
                      defaultValue={initialSettings.rightSkyscraperImage}
                      onChange={(e) => setRightSkyscraperImage(e.target.value)}
                      placeholder="Paste image URL or click Upload..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                    />
                    <label className="btn-secondary text-xs py-2 px-3 shrink-0 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> {isUploading === 'rightSkyscraper' ? '...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setRightSkyscraperImage, 'rightSkyscraperImage', 'rightSkyscraper')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Target Link URL</label>
                  <input
                    type="url"
                    name="rightSkyscraperLink"
                    defaultValue={initialSettings.rightSkyscraperLink}
                    onChange={(e) => setRightSkyscraperLink(e.target.value)}
                    placeholder="https://advertiser-website.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Sponsorship Badge Label</label>
                  <input
                    type="text"
                    name="rightSkyscraperTitle"
                    defaultValue={initialSettings.rightSkyscraperTitle || 'Sponsored Partner'}
                    onChange={(e) => setRightSkyscraperTitle(e.target.value)}
                    placeholder="Sponsored Partner"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">AdSense / Script Code Snippet</label>
                <textarea
                  name="rightSkyscraperScript"
                  rows={4}
                  defaultValue={initialSettings.rightSkyscraperScript}
                  onChange={(e) => setRightSkyscraperScript(e.target.value)}
                  placeholder="<script async src='https://pagead2.googlesyndication.com/...'></script>"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* SLOT 5: SIDEBAR BOX AD */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-purple" /> 5. Sidebar Rectangle Ad (Right Column Box)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">High-engagement box ad placed in the sidebar (Recommended size: 300x250 or 300x600)</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="sidebarEnabled"
                defaultChecked={initialSettings.sidebarEnabled}
                onChange={(e) => setSidebarEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">{sidebarEnabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>

          <div className={sidebarEnabled ? 'space-y-5' : 'hidden space-y-5'}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarType('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  sidebarType === 'image' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Sponsored Banner Image
              </button>
              <button
                type="button"
                onClick={() => setSidebarType('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  sidebarType === 'script' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> HTML / AdSense Script Code
              </button>
            </div>

            {sidebarType === 'image' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Banner Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="sidebarImage"
                      defaultValue={initialSettings.sidebarImage}
                      onChange={(e) => setSidebarImage(e.target.value)}
                      placeholder="Paste image URL or click Upload..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                    />
                    <label className="btn-secondary text-xs py-2 px-3 shrink-0 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> {isUploading === 'sidebar' ? '...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setSidebarImage, 'sidebarImage', 'sidebar')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Target Link URL</label>
                  <input
                    type="url"
                    name="sidebarLink"
                    defaultValue={initialSettings.sidebarLink}
                    onChange={(e) => setSidebarLink(e.target.value)}
                    placeholder="https://advertiser-website.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Sponsorship Badge Label</label>
                  <input
                    type="text"
                    name="sidebarTitle"
                    defaultValue={initialSettings.sidebarTitle || 'Sponsored Partner'}
                    onChange={(e) => setSidebarTitle(e.target.value)}
                    placeholder="Sponsored Partner"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">AdSense / Script Code Snippet</label>
                <textarea
                  name="sidebarScript"
                  rows={4}
                  defaultValue={initialSettings.sidebarScript}
                  onChange={(e) => setSidebarScript(e.target.value)}
                  placeholder="<script async src='https://pagead2.googlesyndication.com/...'></script>"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* SLOT 6: MID-PAGE FEED BANNER AD */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> 6. Mid-Page Feed Banner (In-Feed Ad)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Banner placed between article sections on Homepage feed (Recommended size: 728x90 or 970x250)</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="midBannerEnabled"
                defaultChecked={initialSettings.midBannerEnabled}
                onChange={(e) => setMidBannerEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">{midBannerEnabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>

          <div className={midBannerEnabled ? 'space-y-5' : 'hidden space-y-5'}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMidBannerType('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  midBannerType === 'image' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Sponsored Banner Image
              </button>
              <button
                type="button"
                onClick={() => setMidBannerType('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  midBannerType === 'script' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> HTML / AdSense Script Code
              </button>
            </div>

            {midBannerType === 'image' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Banner Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="midBannerImage"
                      defaultValue={initialSettings.midBannerImage}
                      onChange={(e) => setMidBannerImage(e.target.value)}
                      placeholder="Paste image URL or click Upload..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                    />
                    <label className="btn-secondary text-xs py-2 px-3 shrink-0 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> {isUploading === 'midBanner' ? '...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setMidBannerImage, 'midBannerImage', 'midBanner')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Target Link URL</label>
                  <input
                    type="url"
                    name="midBannerLink"
                    defaultValue={initialSettings.midBannerLink}
                    onChange={(e) => setMidBannerLink(e.target.value)}
                    placeholder="https://advertiser-website.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Sponsorship Badge Label</label>
                  <input
                    type="text"
                    name="midBannerTitle"
                    defaultValue={initialSettings.midBannerTitle || 'Sponsored Partner'}
                    onChange={(e) => setMidBannerTitle(e.target.value)}
                    placeholder="Sponsored Partner"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">AdSense / Script Code Snippet</label>
                <textarea
                  name="midBannerScript"
                  rows={4}
                  defaultValue={initialSettings.midBannerScript}
                  onChange={(e) => setMidBannerScript(e.target.value)}
                  placeholder="<script async src='https://pagead2.googlesyndication.com/...'></script>"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* SLOT 7: BEFORE-FOOTER PRE-FOOTER BANNER AD */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> 7. Before-Footer Pre-Footer Banner (Pre-Footer Ad)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">High-impact banner placed right above the Footer section on pages (Recommended size: 970x90 or 728x90)</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="footerBannerEnabled"
                defaultChecked={initialSettings.footerBannerEnabled}
                onChange={(e) => setFooterBannerEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">{footerBannerEnabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>

          <div className={footerBannerEnabled ? 'space-y-5' : 'hidden space-y-5'}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFooterBannerType('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  footerBannerType === 'image' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Sponsored Banner Image
              </button>
              <button
                type="button"
                onClick={() => setFooterBannerType('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  footerBannerType === 'script' ? 'bg-brand-purple text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> HTML / AdSense Script Code
              </button>
            </div>

            {footerBannerType === 'image' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Banner Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="footerBannerImage"
                      defaultValue={initialSettings.footerBannerImage}
                      onChange={(e) => setFooterBannerImage(e.target.value)}
                      placeholder="Paste image URL or click Upload..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                    />
                    <label className="btn-secondary text-xs py-2 px-3 shrink-0 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> {isUploading === 'footerBanner' ? '...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setFooterBannerImage, 'footerBannerImage', 'footerBanner')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Target Link URL</label>
                  <input
                    type="url"
                    name="footerBannerLink"
                    defaultValue={initialSettings.footerBannerLink}
                    onChange={(e) => setFooterBannerLink(e.target.value)}
                    placeholder="https://advertiser-website.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Sponsorship Badge Label</label>
                  <input
                    type="text"
                    name="footerBannerTitle"
                    defaultValue={initialSettings.footerBannerTitle || 'Sponsored Pre-Footer Partner'}
                    onChange={(e) => setFooterBannerTitle(e.target.value)}
                    placeholder="Sponsored Pre-Footer Partner"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">AdSense / Script Code Snippet</label>
                <textarea
                  name="footerBannerScript"
                  rows={4}
                  defaultValue={initialSettings.footerBannerScript}
                  onChange={(e) => setFooterBannerScript(e.target.value)}
                  placeholder="<script async src='https://pagead2.googlesyndication.com/...'></script>"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* GOOGLE ADSENSE INTEGRATION */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" /> Google AdSense Integration
          </h2>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Google AdSense Publisher ID (e.g., ca-pub-1234567890123456)</label>
            <input
              type="text"
              name="adsenseId"
              defaultValue={initialSettings.adsenseId}
              onChange={(e) => setAdsenseId(e.target.value)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          {/* 👁️ INSTANT ADSENSE LIVE PREVIEW CARD */}
          <div className="bg-slate-950/80 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-cyan-400" /> Live Script Tag Preview</span>
              <span className="text-slate-500 font-mono">Google AdSense Integration</span>
            </div>

            {adsenseId ? (
              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto border border-white/5">
                &lt;script async src=&quot;https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={adsenseId}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;
              </div>
            ) : (
              <div className="h-16 bg-slate-900/60 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-500">
                Enter your Google AdSense Publisher ID above to see live script tag
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" className="btn-primary py-3 px-6 text-xs font-bold shadow-glow-purple flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Ad Configuration
        </button>
      </div>
    </form>
  );
}
