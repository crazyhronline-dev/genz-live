'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, ShieldCheck, Heart } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '@/components/ui/SocialIcons';
import { NAV_CATEGORIES, SITE_CONFIG } from '@/config/site';

interface FooterProps {
  /** When provided (home page), clicking a category updates page state.
   *  When omitted (all other pages), clicking navigates to the route URL. */
  setActiveCategory?: (cat: string) => void;
}

export default function Footer({ setActiveCategory }: FooterProps) {
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="md" priority={false} />
            <p className="text-slate-300 font-semibold text-sm">{SITE_CONFIG.tagline}</p>
            <p className="text-slate-400 max-w-sm leading-relaxed">{SITE_CONFIG.description}</p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { href: SITE_CONFIG.youtube.url, Icon: YoutubeIcon, color: 'text-red-500 hover:bg-red-600', label: 'YouTube' },
                { href: SITE_CONFIG.social.instagram, Icon: InstagramIcon, color: 'text-pink-500 hover:bg-pink-600', label: 'Instagram' },
                { href: SITE_CONFIG.social.facebook, Icon: FacebookIcon, color: 'text-blue-500 hover:bg-blue-600', label: 'Facebook' },
              ].map(({ href, Icon, color, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center ${color} hover:text-white transition-colors`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories Sitemap */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">News Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {NAV_CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
                // Map category id to its URL slug
                const href = cat.id === 'tech' ? '/technology' : `/${cat.id}`;

                if (setActiveCategory) {
                  // Home page: SPA state update
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-left hover:text-purple-400 transition-colors text-slate-400 py-1"
                    >
                      {cat.name}
                    </button>
                  );
                }

                // All other pages: real link navigation
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    className="text-left hover:text-purple-400 transition-colors text-slate-400 py-1 block"
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Official Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Official Links</h3>
            <ul className="space-y-2">
              <li>
                <a href={SITE_CONFIG.domain} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-purple-400">
                  <Globe className="w-3.5 h-3.5 text-purple-400" /> genz-live.com
                </a>
              </li>
              <li>
                <a href={SITE_CONFIG.youtube.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-400">
                  <YoutubeIcon className="w-3.5 h-3.5 text-red-500" /> YouTube ({SITE_CONFIG.youtube.handle})
                </a>
              </li>
              <li className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" /> Verified Independent Media
              </li>
            </ul>

            {/* Legal links */}
            <div className="pt-3 border-t border-white/5 space-y-1.5">
              {[
                ['About', '/about'],
                ['Privacy Policy', '/privacy-policy'],
                ['Terms', '/terms'],
                ['Editorial Policy', '/editorial-policy'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="block hover:text-purple-400 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the new generation.
          </p>
        </div>
      </div>
    </footer>
  );
}
