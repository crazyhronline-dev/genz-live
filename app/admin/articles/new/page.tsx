import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import { saveArticleAction } from '@/app/admin/actions';
import { getCmsCategories, getCmsAuthors } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create / Edit Article — GenZ Live CMS',
};

export default async function AdminNewArticlePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const [categories, authors] = await Promise.all([
    getCmsCategories(),
    getCmsAuthors(),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link href="/admin/articles" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Articles
        </Link>
        <span className="text-xs text-slate-400 font-mono">Role: {user.role}</span>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Editorial Article Editor</h1>
          <p className="text-xs text-slate-400 mt-1">Create or update published content for GenZ Live digital channels.</p>
        </div>

        <form action={saveArticleAction} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Form Area */}
            <div className="lg:col-span-8 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Article Title <span className="text-red-400">*</span>
                </label>
                <input
                  name="title"
                  required
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
                  placeholder="<p>Write your article paragraphs here...</p> <h2>Subheading</h2> <p>In-depth analysis...</p>"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple leading-relaxed"
                />
              </div>

              {/* SEO Panel */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> SEO Metadata & Optimization Panel
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Custom SEO Title Override</label>
                  <input
                    name="seoTitle"
                    placeholder="Defaults to article title if blank (50-60 chars recommended)"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Custom SEO Description Override</label>
                  <textarea
                    name="seoDescription"
                    rows={2}
                    placeholder="Defaults to excerpt if blank (140-160 chars recommended)"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Controls Area */}
            <div className="lg:col-span-4 space-y-5">
              {/* Status Selector */}
              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Workflow Status
                </label>
                <select
                  name="status"
                  defaultValue={user.role === 'AUTHOR' || user.role === 'WRITER' ? 'DRAFT' : 'PUBLISHED'}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple font-bold"
                >
                  <option value="DRAFT">DRAFT (Private)</option>
                  <option value="REVIEW">SUBMIT FOR REVIEW</option>
                  {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'EDITOR') && (
                    <>
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="PUBLISHED">PUBLISHED (Live)</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </>
                  )}
                </select>
                <p className="text-[11px] text-slate-500">
                  {user.role === 'AUTHOR' || user.role === 'WRITER'
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
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-purple" /> Featured Image URL
                </label>
                <input
                  name="featuredImage"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                />
                <input
                  name="featuredImageAlt"
                  placeholder="Image Alt Text (for accessibility)"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                />
              </div>

              {/* Visibility Flags */}
              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Promotional Flags
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" name="isFeatured" className="rounded accent-purple-600" />
                  <span>Feature in Hero Spotlight</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" name="isTrending" className="rounded accent-purple-600" />
                  <span>Mark as Trending Story (01..05)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" name="isBreaking" className="rounded accent-purple-600" />
                  <span>Include in Breaking News Ticker</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple"
              >
                <Save className="w-4 h-4" /> Save & Commit Article
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
