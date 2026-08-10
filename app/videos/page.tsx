import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import YouTubeLiveHub from '@/components/media/YouTubeLiveHub';
import { buildPageMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = buildPageMetadata({
  title: 'Videos & Live Broadcasts',
  description: 'Watch live broadcasts, breaking news video coverage, and in-depth video reports on the GenZ Live YouTube channel.',
});

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <Header activeCategory="all" />

      {/* Page Banner */}
      <div className="bg-navy-surface border-b border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-1">{SITE_CONFIG.name} / Video Hub</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading">
              Watch <span className="gradient-text">GenZ Live Broadcasts</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
              24/7 live streams, breaking video reports, and exclusive interviews with global leaders, engineers, and creators.
            </p>
          </div>

          <a
            href={SITE_CONFIG.youtube.url}
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-xs py-3 px-6 shadow-glow-purple self-start md:self-auto shrink-0"
          >
            Subscribe on YouTube ({SITE_CONFIG.youtube.handle})
          </a>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        <YouTubeLiveHub />

        {/* Pagination-ready control bar */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <button disabled className="btn-secondary text-xs opacity-50 cursor-not-allowed">Previous Videos</button>
          <span className="font-mono">Page 1 of 1</span>
          <button disabled className="btn-secondary text-xs opacity-50 cursor-not-allowed">Next Videos</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
