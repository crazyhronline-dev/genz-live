'use client';

import React, { useRef } from 'react';
import ArticlePreview from '@/components/admin/ArticlePreview';
import KeywordSuggester from '@/components/admin/KeywordSuggester';
import EditorialCheckPanel from '@/components/admin/EditorialCheckPanel';
import { Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import { saveArticleAction } from '@/app/admin/actions';
import { resolveArticleImage, getCategoryFallbackImage } from '@/lib/dataAccess';

interface Category { id: string; name: string; slug: string }
interface Author   { id: string; name: string; designation: string }

interface ArticleEditorFormProps {
  categories: Category[];
  authors: Author[];
  userRole: string;
  articleToEdit?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    seoTitle: string | null;
    seoDescription: string | null;
    status: string;
    categoryId: string;
    authorId: string;
    featuredImage: string | null;
    featuredImageAlt: string | null;
    isFeatured: boolean;
    isTrending: boolean;
    isBreaking: boolean;
    keywords: string | null;
  } | null;
}

export default function ArticleEditorForm({
  categories,
  authors,
  userRole,
  articleToEdit,
}: ArticleEditorFormProps) {
  const isAuthorOrWriter = userRole === 'AUTHOR' || userRole === 'WRITER';

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = React.useState(articleToEdit?.featuredImage || '');
  const [imageAlt, setImageAlt] = React.useState(articleToEdit?.featuredImageAlt || '');
  const [isUploading, setIsUploading] = React.useState(false);
  const [status, setStatus] = React.useState<string>(
    articleToEdit?.status || (isAuthorOrWriter ? 'DRAFT' : 'PUBLISHED')
  );

  // Sync state whenever articleToEdit prop changes (including status)
  React.useEffect(() => {
    if (articleToEdit) {
      setImageUrl(articleToEdit.featuredImage || '');
      setImageAlt(articleToEdit.featuredImageAlt || '');
      setStatus(articleToEdit.status || (isAuthorOrWriter ? 'DRAFT' : 'PUBLISHED'));
    }
  }, [articleToEdit, isAuthorOrWriter]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    let uploadSuccess = false;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setImageUrl(data.url);
          if (!imageAlt) setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
          uploadSuccess = true;
        }
      }
    } catch {
      // Server upload failed
    }

    if (!uploadSuccess) {
      // Create local data URL fallback only if server upload failed
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setImageUrl(dataUrl);
          if (!imageAlt) setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsDataURL(file);
    }

    setIsUploading(false);
  };

  // Build lookup maps for the preview component
  const authorMap = Object.fromEntries(
    authors.map(a => [a.id, a.name])
  );
  const categoryMap = Object.fromEntries(
    categories.map(c => [c.id, { name: c.name, slug: c.slug }])
  );

  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">
          {articleToEdit ? `Edit Article: ${articleToEdit.title}` : 'Editorial Article Editor'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {articleToEdit
            ? 'Update existing content, change workflow status, or edit taxonomy & featured parameters.'
            : 'Create or update published content for GenZ Live digital channels.'}
        </p>
      </div>

      {/* Hidden File Input for Device Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <form ref={formRef} action={saveArticleAction} className="space-y-6">
        {articleToEdit && <input type="hidden" name="id" value={articleToEdit.id} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Main Form Area ─────────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Article Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                required
                defaultValue={articleToEdit?.title || ''}
                placeholder="Enter headline..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple font-bold"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                URL Slug (Auto-generated if empty)
              </label>
              <input
                name="slug"
                defaultValue={articleToEdit?.slug || ''}
                placeholder="e.g. future-of-artificial-intelligence"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-brand-purple"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Excerpt / Short Summary
              </label>
              <textarea
                name="excerpt"
                rows={3}
                defaultValue={articleToEdit?.excerpt || ''}
                placeholder="Short summary for article cards and news search snippets..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
              />
            </div>

            {/* Body Content */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Article Body Content (HTML / Structured Text) <span className="text-red-400">*</span>
                </label>
              </div>
              <textarea
                name="content"
                required
                rows={14}
                defaultValue={articleToEdit?.content || ''}
                placeholder="<p>Write your article paragraphs here...</p> <h2>Subheading</h2> <p>In-depth analysis...</p>"
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple leading-relaxed"
              />
            </div>

            {/* AI SERP Keywords */}
            <KeywordSuggester
              key={articleToEdit?.id || 'new'}
              initialKeywords={articleToEdit?.keywords}
            />

            {/* SEO Panel */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> SEO Metadata & Optimization Panel
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Custom SEO Title Override</label>
                <input
                  name="seoTitle"
                  defaultValue={articleToEdit?.seoTitle || ''}
                  placeholder="Defaults to article title if blank (50-60 chars recommended)"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Custom SEO Description Override</label>
                <textarea
                  name="seoDescription"
                  rows={2}
                  defaultValue={articleToEdit?.seoDescription || ''}
                  placeholder="Defaults to excerpt if blank (140-160 chars recommended)"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          </div>

          {/* ── Sidebar Controls ───────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-5">
            {/* Status Selector */}
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Workflow Status
              </label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple font-bold"
              >
                <option value="DRAFT">DRAFT (Private)</option>
                <option value="REVIEW">SUBMIT FOR REVIEW</option>
                {!isAuthorOrWriter && (
                  <>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="PUBLISHED">PUBLISHED (Live)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </>
                )}
              </select>
              <p className="text-[11px] text-slate-500">
                {isAuthorOrWriter
                  ? 'Authors/Writers submit stories for Editorial Review.'
                  : 'Editors & Admins have full publishing rights.'}
              </p>
            </div>

            {/* Category & Author */}
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="categoryId"
                  required
                  defaultValue={articleToEdit?.categoryId || (categories[0]?.id || '')}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Author Profile <span className="text-red-400">*</span>
                </label>
                <select
                  name="authorId"
                  required
                  defaultValue={articleToEdit?.authorId || (authors[0]?.id || '')}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
                >
                  {authors.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.designation})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-purple" /> Featured Image URL / Upload
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-[11px] font-bold text-brand-cyan hover:text-cyan-300 transition-colors flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20"
                  >
                    {isUploading ? 'Uploading...' : '📁 Upload File'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const form = formRef.current;
                      const title = form ? (new FormData(form).get('title') as string) || '' : '';
                      const lower = title.toLowerCase();

                      let suggested = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&auto=format&fit=crop&q=80';
                      if (lower.includes('ai') || lower.includes('intelligence') || lower.includes('robot')) {
                        suggested = 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80';
                      } else if (lower.includes('india') || lower.includes('delhi') || lower.includes('ranchi') || lower.includes('bengaluru')) {
                        suggested = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80';
                      } else if (lower.includes('tech') || lower.includes('code') || lower.includes('software') || lower.includes('app')) {
                        suggested = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80';
                      } else if (lower.includes('cricket') || lower.includes('sport') || lower.includes('match')) {
                        suggested = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80';
                      } else if (lower.includes('market') || lower.includes('stock') || lower.includes('crypto') || lower.includes('business')) {
                        suggested = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80';
                      } else if (lower.includes('world') || lower.includes('global') || lower.includes('summit')) {
                        suggested = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80';
                      }

                      setImageUrl(suggested);
                      if (!imageAlt && title) setImageAlt(title);
                    }}
                    className="text-[11px] font-bold text-brand-purple hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Suggest
                  </button>
                </div>
              </div>

              <input
                name="featuredImage"
                value={imageUrl}
                onChange={(e) => {
                  let val = e.target.value;
                  // Auto-extract YouTube video thumbnail if user pastes a YouTube video URL
                  if (val.includes('youtube.com/watch?v=') || val.includes('youtu.be/')) {
                    const match = val.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
                    if (match && match[1]) {
                      val = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
                    }
                  }
                  // Auto-extract newspinch.in video thumbnail
                  if (val.includes('newspinch.in/video/')) {
                    const match = val.match(/newspinch\.in\/video\/([a-zA-Z0-9_-]+)/);
                    if (match && match[1]) {
                      // newspinch embeds YouTube — extract the YouTube ID from it
                      val = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
                    }
                  }
                  setImageUrl(val);
                }}
                placeholder="Paste direct image URL (ending in .jpg, .png, .webp) or click Upload File..."
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple font-mono"
              />

              {/* Helper: Auto-extract video thumbnail button for YouTube / NewsPinch links */}
              {imageUrl && (imageUrl.includes('youtube.com') || imageUrl.includes('youtu.be') || imageUrl.includes('newspinch')) && !imageUrl.includes('img.youtube.com') && (
                <div className="mt-1 p-2 rounded-lg bg-purple-900/30 border border-purple-500/40 text-[11px] text-purple-200 flex items-center justify-between">
                  <span>📹 Video page link detected</span>
                  <button
                    type="button"
                    onClick={() => {
                      let vid = '';
                      const yt = imageUrl.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
                      const ns = imageUrl.match(/newspinch\.in\/video\/([a-zA-Z0-9_-]+)/);
                      if (yt) vid = yt[1];
                      else if (ns) vid = ns[1];
                      if (vid) setImageUrl(`https://img.youtube.com/vi/${vid}/maxresdefault.jpg`);
                    }}
                    className="text-[11px] font-bold text-yellow-300 hover:text-yellow-100 underline flex items-center gap-1"
                  >
                    ✨ Auto-extract video thumbnail
                  </button>
                </div>
              )}

              <input
                name="featuredImageAlt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Image Alt Text (for accessibility)"
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
              />

              {/* Live Preview Thumbnail Box */}
              {imageUrl ? (
                <div className="mt-2 rounded-lg overflow-hidden border border-white/10 bg-slate-950 aspect-video relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveArticleImage(imageUrl)}
                    alt={imageAlt || 'Featured image preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getCategoryFallbackImage();
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 px-2 py-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[200px]">Live Image Preview</span>
                    <button
                      type="button"
                      onClick={() => { setImageUrl(''); setImageAlt(''); }}
                      className="text-red-400 hover:underline font-bold"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-900/60 border border-dashed border-white/10 text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                    📷 No Featured Image (Optional)
                  </p>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Articles can be saved and published live cleanly with or without an image. If you wish to attach an image, paste a link, click <strong className="text-purple-300">📁 Upload File</strong>, or click <strong className="text-purple-300">✨ Auto-Suggest</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Visibility Flags */}
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Promotional Flags
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" name="isFeatured" defaultChecked={articleToEdit?.isFeatured || false} className="rounded accent-purple-600" />
                <span>Feature in Hero Spotlight</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" name="isTrending" defaultChecked={articleToEdit?.isTrending || false} className="rounded accent-purple-600" />
                <span>Mark as Trending Story (01..05)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" name="isBreaking" defaultChecked={articleToEdit?.isBreaking || false} className="rounded accent-purple-600" />
                <span>Include in Breaking News Ticker</span>
              </label>
            </div>

            {articleToEdit && (
              <EditorialCheckPanel
                articleId={articleToEdit.id}
                articleTitle={articleToEdit.title}
                articleContent={articleToEdit.content}
                userRole={userRole}
              />
            )}

            {/* ── Preview Button (reads live form state) ────────────────── */}
            <ArticlePreview
              formRef={formRef}
              authorMap={authorMap}
              categoryMap={categoryMap}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple"
            >
              <Save className="w-4 h-4" />
              {articleToEdit ? 'Save & Update Article' : 'Save & Commit Article'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
