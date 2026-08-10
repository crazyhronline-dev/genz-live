import type { Metadata } from 'next';
import YouTubeLiveHub from '@/components/media/YouTubeLiveHub';
import Footer from '@/components/layout/Footer';
import Logo from '@/components/ui/Logo';
import { buildPageMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = buildPageMetadata({
  title: 'Videos & Live Streams',
  description: 'Watch live streams, breaking news video coverage, and in-depth reports on GenZ Live YouTube channel.',
});

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col">
      {/* Thin header — Videos page has its own channel section */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <span className="badge-live">🔴 LIVE NOW</span>
            <a href={SITE_CONFIG.youtube.url} target="_blank" rel="noreferrer" className="btn-primary text-xs py-2 px-4">
              Subscribe
            </a>
          </div>
        </div>
      </header>

      {/* Page Banner */}
      <div className="bg-navy-surface border-b border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2">GenZ Live / Videos</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading">
            Watch <span className="gradient-text">GenZ Live</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Live streams, breaking news coverage, and in-depth video reports from our global team.
          </p>
        </div>
      </div>

      <main className="flex-1">
        <YouTubeLiveHub />
      </main>

      <Footer />
    </div>
  );
}
