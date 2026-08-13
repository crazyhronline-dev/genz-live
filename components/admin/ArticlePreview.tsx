'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Eye,
  Calendar,
  Clock,
  Tag,
  Globe,
  Monitor,
  Smartphone,
  ExternalLink,
  Loader2,
  Save,
  Zap,
} from 'lucide-react';
import { resolveArticleImage, getCategoryFallbackImage } from '@/lib/dataAccess';


// ─── Types ────────────────────────────────────────────────────────────────────
interface PreviewData {
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  authorName: string;
  categoryName: string;
  categorySlug: string;
  isBreaking: boolean;
  keywords: string;
  status: string;
}

interface ArticlePreviewProps {
  /** The <form> element to read values from */
  formRef: React.RefObject<HTMLFormElement | null>;
  /** Author and category name maps for resolving IDs */
  authorMap: Record<string, string>;
  categoryMap: Record<string, { name: string; slug: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(d = new Date()): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ArticlePreview({ formRef, authorMap, categoryMap }: ArticlePreviewProps) {
  const [open, setOpen] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [preview, setPreview] = useState<PreviewData | null>(null);

  const buildPreview = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);

    const authorId = fd.get('authorId') as string;
    const categoryId = fd.get('categoryId') as string;
    const cat = categoryMap[categoryId] ?? { name: 'News', slug: 'news' };

    setPreview({
      title: (fd.get('title') as string) || 'Untitled Article',
      excerpt: (fd.get('excerpt') as string) || '',
      content: (fd.get('content') as string) || '',
      featuredImage: (fd.get('featuredImage') as string) || '',
      featuredImageAlt: (fd.get('featuredImageAlt') as string) || '',
      authorName: authorMap[authorId] || 'Staff Writer',
      categoryName: cat.name,
      categorySlug: cat.slug,
      isBreaking: fd.get('isBreaking') === 'on',
      keywords: (fd.get('keywords') as string) || '',
      status: (fd.get('status') as string) || 'DRAFT',
    });
  }, [formRef, authorMap, categoryMap]);

  const openPreview = () => {
    buildPreview();
    setOpen(true);
  };

  const handleSaveFromPreview = (publishLive = false) => {
    const form = formRef.current;
    if (!form) return;
    if (publishLive) {
      const statusSelect = form.querySelector('select[name="status"]') as HTMLSelectElement | null;
      if (statusSelect) {
        statusSelect.value = 'PUBLISHED';
      }
    }
    form.requestSubmit();
  };

  // Refresh preview whenever user switches viewport
  useEffect(() => {
    if (open) buildPreview();
  }, [open, viewport, buildPreview]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const statusColor: Record<string, string> = {
    PUBLISHED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    DRAFT: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    REVIEW: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    SCHEDULED: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    ARCHIVED: 'bg-slate-800 text-slate-400 border-white/10',
  };

  return (
    <>
      {/* ── Trigger Button ──────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={openPreview}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
          border border-brand-purple/40 text-brand-purple hover:bg-brand-purple/10
          text-xs font-bold tracking-wide transition-all duration-200
          hover:border-brand-purple hover:shadow-[0_0_12px_rgba(147,51,234,0.3)]"
      >
        <Eye className="w-3.5 h-3.5" />
        Preview Article
      </button>

      {/* ── Fullscreen Modal ────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ backgroundColor: '#0a0f1e' }}
        >
          {/* Modal Topbar */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0"
            style={{ background: 'linear-gradient(to right, #0f172a, #1e1b4b)' }}
          >
            {/* Left: Brand + status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">
                  ARTICLE PREVIEW
                </span>
              </div>
              {preview && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    statusColor[preview.status] ?? 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }`}
                >
                  {preview.status}
                </span>
              )}
            </div>

            {/* Center: Viewport toggle */}
            <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewport === 'desktop'
                    ? 'bg-brand-purple text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewport === 'mobile'
                    ? 'bg-brand-purple text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>

            {/* Right: Save + Refresh + close */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveFromPreview(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-purple hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-glow-purple"
              >
                <Save className="w-3.5 h-3.5" />
                Save Article
              </button>
              <button
                type="button"
                onClick={buildPreview}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
              >
                <Loader2 className="w-3.5 h-3.5" />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Close
              </button>
            </div>
          </div>

          {/* Browser chrome strip */}
          <div
            className="flex items-center gap-2 px-4 py-2 border-b border-white/5 flex-shrink-0"
            style={{ background: '#111827' }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <div className="flex-1 mx-3 bg-slate-800 rounded-md px-3 py-1 flex items-center gap-2">
              <Globe className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span className="text-xs text-slate-400 font-mono truncate">
                genz-live.com/{preview?.categorySlug}/{preview?.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 50) || 'article-slug'}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-600 ml-auto flex-shrink-0" />
            </div>
          </div>

          {/* Preview Body */}
          <div
            className="flex-1 overflow-auto"
            style={{ background: '#0f172a' }}
          >
            <div
              className={`mx-auto transition-all duration-300 ${
                viewport === 'mobile' ? 'max-w-[390px] shadow-2xl' : 'max-w-4xl'
              }`}
              style={{
                background: '#0a0f1e',
                minHeight: '100%',
                ...(viewport === 'mobile' ? { borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' } : {}),
              }}
            >
              {preview ? (
                <ArticlePageRender
                  preview={preview}
                  viewport={viewport}
                  onClose={() => setOpen(false)}
                  onSave={(publishLive) => handleSaveFromPreview(publishLive)}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
                  Loading preview…
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Article Page Render (mirrors public article page layout) ─────────────────
function ArticlePageRender({
  preview,
  viewport,
  onClose,
  onSave,
}: {
  preview: PreviewData;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onClose: () => void;
  onSave?: (publishLive?: boolean) => void;
}) {
  const keywordList = preview.keywords
    ? preview.keywords.split(',').map(k => k.trim()).filter(Boolean)
    : [];

  const isHtml = /<[a-zA-Z]+[\s>]/.test(preview.content);

  return (
    <div className="text-slate-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Simulated Header */}
      <header
        className="border-b border-white/10 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="font-extrabold text-white tracking-tight"
            style={{ fontSize: viewport === 'mobile' ? '16px' : '20px' }}
          >
            <span style={{ color: '#a855f7' }}>GenZ</span>{' '}
            <span style={{ background: 'linear-gradient(90deg,#a855f7,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Live
            </span>
          </div>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest hidden sm:block">The Voice of GenZ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-semibold">LIVE</span>
        </div>
      </header>

      {/* Article Content */}
      <main className="px-4 py-6 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-4">
          <span className="hover:text-purple-400 cursor-default">Home</span>
          <span>›</span>
          <span className="capitalize hover:text-purple-400 cursor-default">{preview.categoryName}</span>
          <span>›</span>
          <span className="text-slate-400 truncate max-w-[180px]">{preview.title}</span>
        </nav>

        <article>
          <header className="mb-6">
            {/* Breaking badge */}
            {preview.isBreaking && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mb-3 border"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
              >
                🔴 BREAKING
              </span>
            )}

            {/* Category chip */}
            <div className="mb-2">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}
              >
                {preview.categoryName}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-extrabold text-white leading-tight mb-4"
              style={{
                fontSize: viewport === 'mobile' ? '22px' : '32px',
                lineHeight: 1.2,
                fontFamily: '"Outfit", system-ui, sans-serif',
              }}
            >
              {preview.title}
            </h1>

            {/* Excerpt */}
            {preview.excerpt && (
              <p
                className="text-slate-300 leading-relaxed mb-5"
                style={{ fontSize: viewport === 'mobile' ? '14px' : '17px' }}
              >
                {preview.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div
              className="flex flex-wrap items-center gap-3 pb-5 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.08)', fontSize: '12px', color: '#94a3b8' }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#06b6d4)' }}
                >
                  {preview.authorName.charAt(0)}
                </span>
                {preview.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime(preview.content)}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                style={
                  preview.status === 'PUBLISHED'
                    ? { background: 'rgba(16,185,129,0.15)', color: '#34d399', borderColor: 'rgba(16,185,129,0.3)' }
                    : { background: 'rgba(148,163,184,0.1)', color: '#94a3b8', borderColor: 'rgba(148,163,184,0.2)' }
                }
              >
                {preview.status}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {preview.featuredImage && (
            <div className="mb-7 rounded-2xl overflow-hidden aspect-video border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveArticleImage(preview.featuredImage)}
                alt={preview.featuredImageAlt || preview.title}
                className="w-full h-full object-cover"
                style={{ display: 'block' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getCategoryFallbackImage();
                }}
              />
            </div>
          )}

          {/* Article Body */}
          <div
            className="leading-relaxed"
            style={{
              fontSize: viewport === 'mobile' ? '14px' : '16px',
              color: '#cbd5e1',
              lineHeight: '1.8',
            }}
          >
            {isHtml ? (
              <div
                className="prose-preview"
                dangerouslySetInnerHTML={{ __html: preview.content }}
                style={{
                  ['--prose-body' as string]: '#cbd5e1',
                  ['--prose-headings' as string]: '#f1f5f9',
                }}
              />
            ) : (
              <div>
                {preview.content.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '1.25em', color: '#cbd5e1' }}>{para}</p>
                ))}
              </div>
            )}
          </div>

          {/* Keywords / Tags */}
          {keywordList.length > 0 && (
            <div
              className="mt-10 pt-5 border-t flex flex-wrap items-center gap-2"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {keywordList.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-[11px] font-medium"
                  style={{ background: 'rgba(148,163,184,0.08)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.1)' }}
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      {/* Simulated Footer */}
      <footer
        className="border-t px-4 py-6 mt-8 text-center pb-24"
        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(5,10,20,0.8)' }}
      >
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} GenZ Live · The Voice of GenZ
        </p>
      </footer>

      {/* Sticky Bottom Action Bar in Preview Mode */}
      <div className="fixed bottom-0 inset-x-0 z-[10000] px-6 py-3.5 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">Article Preview Mode</span>
          <span className="text-slate-500 hidden md:inline">— Reviewing web layout. Click Save to commit changes.</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            Close Preview
          </button>
          <button
            type="button"
            onClick={() => onSave?.(false)}
            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-brand-purple hover:bg-purple-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-glow-purple"
          >
            <Save className="w-4 h-4" /> Save Article
          </button>
          <button
            type="button"
            onClick={() => onSave?.(true)}
            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Zap className="w-4 h-4 text-emerald-200" /> Save & Publish Live
          </button>
        </div>
      </div>

      {/* Prose styles injected inline */}
      <style dangerouslySetInnerHTML={{ __html: `
        .prose-preview h1,.prose-preview h2,.prose-preview h3,.prose-preview h4 {
          color: #f1f5f9; font-weight: 800; margin: 1.5em 0 0.5em; line-height: 1.25;
        }
        .prose-preview h2 { font-size: 1.4em; }
        .prose-preview h3 { font-size: 1.2em; }
        .prose-preview p { color: #cbd5e1; margin-bottom: 1.25em; }
        .prose-preview a { color: #a855f7; text-decoration: underline; }
        .prose-preview strong { color: #f1f5f9; font-weight: 700; }
        .prose-preview em { color: #e2e8f0; }
        .prose-preview blockquote {
          border-left: 3px solid #a855f7; padding-left: 1rem;
          color: #94a3b8; margin: 1.5em 0; font-style: italic;
        }
        .prose-preview ul,.prose-preview ol { color: #cbd5e1; padding-left: 1.5rem; margin-bottom: 1em; }
        .prose-preview li { margin-bottom: 0.4em; }
        .prose-preview code {
          background: rgba(6,182,212,0.1); color: #06b6d4;
          padding: 2px 6px; border-radius: 4px; font-size: 0.85em;
        }
        .prose-preview img { border-radius: 12px; max-width: 100%; margin: 1.5em 0; }
        .prose-preview hr { border-color: rgba(255,255,255,0.1); margin: 2em 0; }
      ` }} />
    </div>
  );
}
