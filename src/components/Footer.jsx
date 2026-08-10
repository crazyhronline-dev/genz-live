import React from 'react';
import { Globe, ShieldCheck, Heart } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';
import { CATEGORIES, SOCIAL_LINKS } from '../data/newsData';

export default function Footer({ setActiveCategory }) {
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-12 pb-8 text-slate-400 text-xs">
      <div className="container space-y-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <a href="/" className="inline-block">
              <img 
                src="/brand/06_Website_Logo_1200x400.png" 
                alt="GenZ Live Logo" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/brand/07_Website_Logo_600x200.png';
                }}
              />
            </a>

            <p className="text-slate-300 font-semibold text-sm">
              The Voice of GenZ
            </p>

            <p className="text-slate-400 max-w-sm leading-relaxed">
              GenZ Live is a global digital news and media platform covering World, India, Technology, AI, Business, Markets, Entertainment, Sports, Culture and Trending news.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href={SOCIAL_LINKS.youtube} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                title="YouTube (@genz-live-official)"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a 
                href={SOCIAL_LINKS.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-pink-500 hover:bg-pink-600 hover:text-white transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href={SOCIAL_LINKS.facebook} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories Sitemap (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">News Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left hover:text-purple-400 transition-colors text-slate-400 py-1"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Legal & Platforms (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Official Links</h3>
            <ul className="space-y-2">
              <li>
                <a href={SOCIAL_LINKS.domain} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-purple-400">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span>genz-live.com</span>
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-400">
                  <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                  <span>YouTube ({SOCIAL_LINKS.handle})</span>
                </a>
              </li>
              <li className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Independent Media</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} GenZ Live. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the new generation.
          </p>
        </div>
      </div>
    </footer>
  );
}
