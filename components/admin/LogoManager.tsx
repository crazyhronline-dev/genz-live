'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Save, RotateCcw, Trash2, Sliders, Globe, Shield, RefreshCw, Layout, Layers, CheckCircle2 } from 'lucide-react';
import type { BrandSettings } from '@/lib/brandSettings';
import { saveLogoSettingsAction } from '@/app/admin/actions';

interface LogoManagerProps {
  initialSettings: BrandSettings;
}

const HEADER_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic Inline Header',
    description: 'Logo on left, Category navigation centered inline, Action buttons on right, Top utility bar.',
    tag: 'Recommended for News Portals',
  },
  {
    id: 'slim',
    name: 'Ultra-Slim Compact Header',
    description: 'Ultra-thin single line nav bar, high article density, maximum screen viewport for content.',
    tag: 'Minimal & Ultra Fast',
  },
  {
    id: 'newsroom',
    name: 'Newsroom Overhang Header',
    description: 'Logo floats in a prominent glass container hanging over the Breaking News ticker bar.',
    tag: 'High Brand Visibility',
  },
  {
    id: 'minimal',
    name: 'Minimal Two-Tier Header',
    description: 'Centered top brand logo tier, clean bottom category navigation bar.',
    tag: 'Editorial Magazine Style',
  },
];

export default function LogoManager({ initialSettings }: LogoManagerProps) {
  // Header Logo state
  const [headerLogoUrl, setHeaderLogoUrl] = useState(initialSettings.headerLogoUrl);
  const [headerLogoHeight, setHeaderLogoHeight] = useState(initialSettings.headerLogoHeight);
  const [headerLogoWidth, setHeaderLogoWidth] = useState(initialSettings.headerLogoWidth);
  const [headerHeight, setHeaderHeight] = useState(initialSettings.headerHeight || 56);
  const [headerTemplate, setHeaderTemplate] = useState<string>(initialSettings.headerTemplate || 'classic');

  // Admin Login Logo state
  const [adminLogoUrl, setAdminLogoUrl] = useState(initialSettings.adminLogoUrl);
  const [adminLogoHeight, setAdminLogoHeight] = useState(initialSettings.adminLogoHeight);
  const [adminLogoWidth, setAdminLogoWidth] = useState(initialSettings.adminLogoWidth);

  // Favicon state
  const [faviconUrl, setFaviconUrl] = useState(initialSettings.faviconUrl);

  const resetHeaderLogo = () => {
    setHeaderLogoUrl('/brand/06_Website_Logo_1200x400.png');
    setHeaderLogoHeight(52);
    setHeaderLogoWidth(0);
    setHeaderHeight(56);
    setHeaderTemplate('classic');
  };

  const resetAdminLogo = () => {
    setAdminLogoUrl('/brand/06_Website_Logo_1200x400.png');
    setAdminLogoHeight(56);
    setAdminLogoWidth(0);
  };

  const resetFavicon = () => {
    setFaviconUrl('/brand/logo_square.png');
  };

  return (
    <form action={saveLogoSettingsAction} className="space-y-8 max-w-5xl">
      {/* Hidden inputs to guarantee form submission */}
      <input type="hidden" name="headerTemplate" value={headerTemplate} />

      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            Brand Assets & Identity
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading mt-2">
            Website Logo & Header Layout Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize header logo, header height, header templates, admin login screen logo, and site favicon live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset all branding assets to default?')) {
                resetHeaderLogo();
                resetAdminLogo();
                resetFavicon();
              }
            }}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button type="submit" className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-glow-purple">
            <Save className="w-4 h-4" /> Save Branding Changes
          </button>
        </div>
      </div>

      {/* ── Header Template Selector ── */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-brand-purple" />
            <h2 className="text-base font-extrabold text-white font-heading">Header Layout Templates</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Select active header style preset</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HEADER_TEMPLATES.map((tmpl) => {
            const isSelected = headerTemplate === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => setHeaderTemplate(tmpl.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-purple/15 border-brand-purple shadow-glow-purple'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isSelected ? 'bg-brand-purple/30 border-brand-purple/50 text-white' : 'bg-slate-800 border-white/10 text-slate-400'
                    }`}>
                      {tmpl.tag}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-brand-purple animate-pulse" />
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-white font-heading">{tmpl.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{tmpl.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Header Logo & Height Controls */}
        <div className="lg:col-span-12 glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-cyan" />
              <h2 className="text-base font-extrabold text-white font-heading">Header Dimensions & Logo Resizing</h2>
            </div>
            <button
              type="button"
              onClick={resetHeaderLogo}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete / Reset Logo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Control Sliders & Direct Number Inputs */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Logo Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="headerLogoUrl"
                    value={headerLogoUrl}
                    onChange={(e) => setHeaderLogoUrl(e.target.value)}
                    placeholder="/brand/06_Website_Logo_1200x400.png"
                    className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setHeaderLogoUrl('/brand/06_Website_Logo_1200x400.png')}
                    className="btn-secondary text-xs px-3"
                    title="Change to default"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. Header Bar Overall Height Adjustment */}
              <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-brand-purple/30">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-purple" /> Main Header Bar Height (px)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      name="headerHeight"
                      min="36"
                      max="120"
                      value={headerHeight}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setHeaderHeight(val);
                      }}
                      className="w-20 bg-slate-950 border border-brand-purple/40 rounded-lg px-2 py-1 text-xs text-center text-brand-cyan font-mono font-bold"
                    />
                    <span className="text-xs text-slate-400 font-mono">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="36"
                  max="120"
                  value={headerHeight}
                  onChange={(e) => setHeaderHeight(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">Controls the total vertical height of the navigation bar.</p>
              </div>

              {/* 2. Logo Image Height Control */}
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-brand-cyan" /> Header Logo Image Height (px)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      name="headerLogoHeight"
                      min="20"
                      max="300"
                      value={headerLogoHeight}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setHeaderLogoHeight(val);
                      }}
                      className="w-20 bg-slate-950 border border-brand-cyan/40 rounded-lg px-2 py-1 text-xs text-center text-purple-300 font-mono font-bold"
                    />
                    <span className="text-xs text-slate-400 font-mono">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={headerLogoHeight}
                  onChange={(e) => setHeaderLogoHeight(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* 3. Logo Max Width Control */}
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" /> Header Logo Max Width (px)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      name="headerLogoWidth"
                      min="0"
                      max="600"
                      value={headerLogoWidth}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setHeaderLogoWidth(val);
                      }}
                      className="w-20 bg-slate-950 border border-white/20 rounded-lg px-2 py-1 text-xs text-center text-white font-mono font-bold"
                    />
                    <span className="text-xs text-slate-400 font-mono">{headerLogoWidth === 0 ? '(Auto)' : 'px'}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={headerLogoWidth}
                  onChange={(e) => setHeaderLogoWidth(parseInt(e.target.value, 10))}
                  className="w-full accent-slate-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="md:col-span-5 bg-navy-main/90 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center space-y-3 min-h-[280px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Header Preview</span>
              <div
                style={{ height: `${headerHeight}px` }}
                className="p-4 rounded-xl bg-navy-surface border border-white/10 w-full flex items-center justify-center overflow-hidden transition-all duration-150"
              >
                <img
                  src={headerLogoUrl}
                  alt="Header Logo Preview"
                  style={{
                    height: `${headerLogoHeight}px`,
                    maxWidth: headerLogoWidth > 0 ? `${headerLogoWidth}px` : '100%',
                    width: 'auto',
                    objectFit: 'contain',
                  }}
                  className="transition-all duration-150 logo-animated"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/brand/06_Website_Logo_1200x400.png'; }}
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-brand-cyan">Template: {HEADER_TEMPLATES.find(t => t.id === headerTemplate)?.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">Header Height: {headerHeight}px · Logo Height: {headerLogoHeight}px</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Login Page Logo Manager */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-purple" />
              <h2 className="text-base font-extrabold text-white font-heading">Admin Login Page Logo</h2>
            </div>
            <button
              type="button"
              onClick={resetAdminLogo}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Logo Image URL</label>
              <input
                type="text"
                name="adminLogoUrl"
                value={adminLogoUrl}
                onChange={(e) => setAdminLogoUrl(e.target.value)}
                placeholder="/brand/06_Website_Logo_1200x400.png"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
            </div>

            {/* Login Logo Height Control (Number Input + Slider) */}
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-brand-purple" /> Login Logo Height (px)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    name="adminLogoHeight"
                    min="20"
                    max="300"
                    value={adminLogoHeight}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setAdminLogoHeight(val);
                    }}
                    className="w-20 bg-slate-950 border border-brand-purple/40 rounded-lg px-2 py-1 text-xs text-center text-brand-cyan font-mono font-bold"
                  />
                  <span className="text-xs text-slate-400 font-mono">px</span>
                </div>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                value={adminLogoHeight}
                onChange={(e) => setAdminLogoHeight(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Live Login Preview */}
            <div className="bg-navy-main p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center space-y-2 min-h-[140px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Login Screen Preview ({adminLogoHeight}px)</span>
              <img
                src={adminLogoUrl}
                alt="Admin Logo Preview"
                style={{
                  height: `${adminLogoHeight}px`,
                  width: adminLogoWidth > 0 ? `${adminLogoWidth}px` : 'auto',
                  objectFit: 'contain',
                }}
                className="transition-all duration-150 logo-animated"
                onError={(e) => { (e.target as HTMLImageElement).src = '/brand/06_Website_Logo_1200x400.png'; }}
              />
            </div>
          </div>
        </div>

        {/* Site Favicon Manager */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-extrabold text-white font-heading">Site Favicon Icon</h2>
            </div>
            <button
              type="button"
              onClick={resetFavicon}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Favicon Image URL (.png / .ico)</label>
              <input
                type="text"
                name="faviconUrl"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="/brand/logo_square.png"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
            </div>

            {/* Live Browser Tab Preview */}
            <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Browser Tab Preview</span>
              <div className="bg-slate-900 border border-white/10 rounded-lg p-2.5 flex items-center gap-2 max-w-xs">
                <img
                  src={faviconUrl}
                  alt="Favicon Preview"
                  className="w-4 h-4 rounded object-contain shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/brand/logo_square.png'; }}
                />
                <span className="text-xs text-slate-200 font-medium truncate">GenZ Live — The Voice of GenZ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
