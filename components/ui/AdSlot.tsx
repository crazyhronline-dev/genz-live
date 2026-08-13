import { getAdSettings } from '@/lib/adSettings';
import { ExternalLink } from 'lucide-react';

interface AdSlotProps {
  size?: 'leaderboard' | 'banner' | 'rectangle' | 'square' | 'sidebar' | 'left-skyscraper' | 'right-skyscraper' | 'in-article' | 'footer-banner';
  slotId?: string;
  className?: string;
}

export default async function AdSlot(props: AdSlotProps) {
  const adSettings = await getAdSettings();
  const { size, className = '' } = props;

  // 1. LEADERBOARD / HEADER TOP AD (FLASH STYLE 1: GOLD LUXURY STROBE DIAMOND SWEEP)
  if (size === 'leaderboard') {
    if (!adSettings.leaderboardEnabled) return null;

    if (adSettings.leaderboardType === 'image' && adSettings.leaderboardImage) {
      return (
        <div className={`w-full max-w-5xl mx-auto my-6 px-4 ${className}`}>
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 glass-panel p-2 shadow-2xl transition-all duration-300 hover:border-amber-500/80 anim-ad-leaderboard">
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/80 rounded-t-xl border-b border-white/5">
              <span className="flex items-center gap-1 text-amber-400">
                ✨ {adSettings.leaderboardTitle || 'Sponsored Partner'}
              </span>
              <span className="text-slate-500 text-[9px]">ADVERTISEMENT</span>
            </div>

            <a
              href={adSettings.leaderboardLink || '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block relative rounded-lg overflow-hidden mt-1.5 group"
            >
              <div className="flash-overlay-leaderboard"></div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={adSettings.leaderboardImage}
                alt={adSettings.leaderboardTitle || 'Sponsored Banner'}
                width={970}
                height={90}
                loading="lazy"
                decoding="async"
                className="w-full max-h-32 md:max-h-36 object-cover rounded-lg group-hover:scale-[1.015] transition-transform duration-300"
              />
              {adSettings.leaderboardLink && (
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 group-hover:bg-brand-purple transition-colors shadow-lg z-30">
                  <span>Visit Sponsor</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                </div>
              )}
            </a>
          </div>
        </div>
      );
    }

    if (adSettings.leaderboardType === 'script' && adSettings.leaderboardScript) {
      return (
        <div className={`w-full max-w-5xl mx-auto my-6 px-4 text-center ${className}`}>
          <div dangerouslySetInnerHTML={{ __html: adSettings.leaderboardScript }} />
        </div>
      );
    }
  }

  // 2. SIDEBAR BOX AD (FLASH STYLE 5: ROTATING RGB PINK SPOTLIGHT BEACON)
  if (size === 'sidebar' || size === 'rectangle' || size === 'square') {
    if (!adSettings.sidebarEnabled) return null;

    if (adSettings.sidebarType === 'image' && adSettings.sidebarImage) {
      return (
        <div className={`w-full my-4 ${className}`}>
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 glass-panel p-2 shadow-2xl transition-all duration-300 hover:border-pink-500/80 anim-ad-sidebar">
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/80 rounded-t-xl border-b border-white/5">
              <span className="flex items-center gap-1 text-pink-400">
                ✨ {adSettings.sidebarTitle || 'Sponsored Partner'}
              </span>
              <span className="text-slate-500 text-[9px]">AD</span>
            </div>

            <a
              href={adSettings.sidebarLink || '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block relative rounded-lg overflow-hidden mt-1.5 group aspect-[300/250]"
            >
              <div className="flash-overlay-sidebar"></div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={adSettings.sidebarImage}
                alt={adSettings.sidebarTitle || 'Sponsored Banner'}
                className="w-full h-full object-cover rounded-lg group-hover:scale-[1.015] transition-transform duration-300 relative z-10"
              />
              {adSettings.sidebarLink && (
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 group-hover:bg-brand-purple transition-colors shadow-lg z-30">
                  <span>Visit</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                </div>
              )}
            </a>
          </div>
        </div>
      );
    }

    if (adSettings.sidebarType === 'script' && adSettings.sidebarScript) {
      return (
        <div className={`w-full my-4 text-center ${className}`}>
          <div dangerouslySetInnerHTML={{ __html: adSettings.sidebarScript }} />
        </div>
      );
    }
  }

  // 3. MID-PAGE FEED BANNER AD (FLASH STYLE 6: AMBER FIRE LASER BEAM SWEEP)
  if (size === 'banner') {
    if (!adSettings.midBannerEnabled) return null;

    if (adSettings.midBannerType === 'image' && adSettings.midBannerImage) {
      return (
        <div className={`w-full max-w-5xl mx-auto my-8 px-4 ${className}`}>
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 glass-panel p-2 shadow-2xl transition-all duration-300 hover:border-orange-500/80 anim-ad-midbanner">
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/80 rounded-t-xl border-b border-white/5">
              <span className="flex items-center gap-1 text-orange-400">
                ✨ {adSettings.midBannerTitle || 'Sponsored Partner'}
              </span>
              <span className="text-slate-500 text-[9px]">SPONSORED</span>
            </div>

            <a
              href={adSettings.midBannerLink || '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block relative rounded-lg overflow-hidden mt-1.5 group"
            >
              <div className="flash-overlay-midbanner"></div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={adSettings.midBannerImage}
                alt={adSettings.midBannerTitle || 'Sponsored Banner'}
                className="w-full max-h-36 object-cover rounded-lg group-hover:scale-[1.015] transition-transform duration-300"
              />
              {adSettings.midBannerLink && (
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 group-hover:bg-brand-purple transition-colors shadow-lg z-30">
                  <span>Learn More</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                </div>
              )}
            </a>
          </div>
        </div>
      );
    }

    if (adSettings.midBannerType === 'script' && adSettings.midBannerScript) {
      return (
        <div className={`w-full max-w-5xl mx-auto my-8 px-4 text-center ${className}`}>
          <div dangerouslySetInnerHTML={{ __html: adSettings.midBannerScript }} />
        </div>
      );
    }
  }

  // 4. IN-ARTICLE BODY CONTENT BANNER AD (FLASH STYLE 2: EMERALD CYBER HORIZONTAL SCAN BAR)
  if (size === 'in-article') {
    const isEnabled = adSettings.inArticleEnabled || adSettings.midBannerEnabled;
    if (!isEnabled) return null;

    const adType = adSettings.inArticleEnabled ? adSettings.inArticleType : adSettings.midBannerType;
    const adImg = adSettings.inArticleEnabled ? adSettings.inArticleImage : adSettings.midBannerImage;
    const adLnk = adSettings.inArticleEnabled ? adSettings.inArticleLink : adSettings.midBannerLink;
    const adTtl = adSettings.inArticleEnabled ? adSettings.inArticleTitle : adSettings.midBannerTitle;
    const adScr = adSettings.inArticleEnabled ? adSettings.inArticleScript : adSettings.midBannerScript;

    if (adType === 'image' && adImg) {
      return (
        <div className={`w-full my-6 ${className}`}>
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 glass-panel p-2 shadow-2xl transition-all duration-300 hover:border-emerald-500/80 anim-ad-inarticle">
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/80 rounded-t-xl border-b border-white/5">
              <span className="flex items-center gap-1 text-emerald-400">
                ✨ {adTtl || 'Sponsored Article Partner'}
              </span>
              <span className="text-slate-500 text-[9px]">IN-ARTICLE AD</span>
            </div>

            <a
              href={adLnk || '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block relative rounded-lg overflow-hidden mt-1.5 group"
            >
              <div className="flash-overlay-inarticle"></div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={adImg}
                alt={adTtl || 'Sponsored In-Article Banner'}
                className="w-full max-h-48 object-cover rounded-lg group-hover:scale-[1.015] transition-transform duration-300"
              />
              {adLnk && (
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 group-hover:bg-brand-purple transition-colors shadow-lg z-30">
                  <span>Visit Sponsor</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                </div>
              )}
            </a>
          </div>
        </div>
      );
    }

    if (adType === 'script' && adScr) {
      return (
        <div className={`w-full my-6 text-center ${className}`}>
          <div dangerouslySetInnerHTML={{ __html: adScr }} />
        </div>
      );
    }
  }

  // 5. LEFT OUTER SKYSCRAPER COLUMN AD (RESPONSIVE: FIXED GUTTER ON DESKTOP, CLEAN INLINE CARD ON TABLET)
  if (size === 'left-skyscraper') {
    if (!adSettings.leftSkyscraperEnabled) return null;

    if (adSettings.leftSkyscraperType === 'image' && adSettings.leftSkyscraperImage) {
      return (
        <>
          {/* DESKTOP VIEW (1280px+): Fixed Outer Gutter Skyscraper */}
          <aside className={`hidden xl:block fixed left-3 top-28 bottom-8 w-36 z-30 pointer-events-auto ${className}`}>
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 glass-panel p-1.5 shadow-2xl h-full flex flex-col justify-between transition-all duration-300 hover:border-purple-400/80 anim-ad-leftsky">
              <div className="px-2 py-1 text-[9px] font-bold text-purple-300 uppercase tracking-widest bg-slate-950/80 rounded-t-xl text-center border-b border-white/5 truncate">
                ✨ {adSettings.leftSkyscraperTitle || 'Sponsored'}
              </div>

              <a
                href={adSettings.leftSkyscraperLink || '#'}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block relative rounded-lg overflow-hidden my-1 flex-1 group"
              >
                <div className="flash-overlay-leftsky"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={adSettings.leftSkyscraperImage}
                  alt={adSettings.leftSkyscraperTitle || 'Left Skyscraper Banner'}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
                />
              </a>

              <span className="text-[8px] text-slate-500 uppercase tracking-wider text-center py-0.5">ADVERTISEMENT</span>
            </div>
          </aside>

          {/* TABLET VIEW (768px to 1279px): Responsive Inline Sponsored Banner */}
          <div className={`block xl:hidden w-full max-w-5xl mx-auto my-6 px-4 ${className}`}>
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 glass-panel p-2 shadow-2xl anim-ad-leftsky">
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/80 rounded-t-xl border-b border-white/5">
                <span className="flex items-center gap-1 text-purple-300">
                  ✨ {adSettings.leftSkyscraperTitle || 'Sponsored Partner'}
                </span>
                <span className="text-slate-500 text-[9px]">SPONSORED PARTNER</span>
              </div>

              <a
                href={adSettings.leftSkyscraperLink || '#'}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block relative rounded-lg overflow-hidden mt-1.5 group"
              >
                <div className="flash-overlay-leftsky"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={adSettings.leftSkyscraperImage}
                  alt={adSettings.leftSkyscraperTitle || 'Left Skyscraper Banner'}
                  className="w-full max-h-36 object-cover rounded-lg group-hover:scale-[1.015] transition-transform duration-300"
                />
                {adSettings.leftSkyscraperLink && (
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 shadow-lg z-30">
                    <span>Visit Sponsor</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                  </div>
                )}
              </a>
            </div>
          </div>
        </>
      );
    }

    if (adSettings.leftSkyscraperType === 'script' && adSettings.leftSkyscraperScript) {
      return (
        <aside className={`w-full my-6 text-center xl:fixed xl:left-3 xl:top-28 xl:w-36 xl:z-30 ${className}`}>
          <div dangerouslySetInnerHTML={{ __html: adSettings.leftSkyscraperScript }} />
        </aside>
      );
    }
  }

  // 6. RIGHT OUTER SKYSCRAPER COLUMN AD (RESPONSIVE: FIXED GUTTER ON DESKTOP, CLEAN INLINE CARD ON TABLET)
  if (size === 'right-skyscraper') {
    if (!adSettings.rightSkyscraperEnabled) return null;

    if (adSettings.rightSkyscraperType === 'image' && adSettings.rightSkyscraperImage) {
      return (
        <>
          {/* DESKTOP VIEW (1280px+): Fixed Outer Gutter Skyscraper */}
          <aside className={`hidden xl:block fixed right-3 top-28 bottom-8 w-36 z-30 pointer-events-auto ${className}`}>
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 glass-panel p-1.5 shadow-2xl h-full flex flex-col justify-between transition-all duration-300 hover:border-cyan-400/80 anim-ad-rightsky">
              <div className="px-2 py-1 text-[9px] font-bold text-cyan-300 uppercase tracking-widest bg-slate-950/80 rounded-t-xl text-center border-b border-white/5 truncate">
                ✨ {adSettings.rightSkyscraperTitle || 'Sponsored'}
              </div>

              <a
                href={adSettings.rightSkyscraperLink || '#'}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block relative rounded-lg overflow-hidden my-1 flex-1 group"
              >
                <div className="flash-overlay-rightsky"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={adSettings.rightSkyscraperImage}
                  alt={adSettings.rightSkyscraperTitle || 'Right Skyscraper Banner'}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
                />
              </a>

              <span className="text-[8px] text-slate-500 uppercase tracking-wider text-center py-0.5">ADVERTISEMENT</span>
            </div>
          </aside>

          {/* TABLET VIEW (768px to 1279px): Responsive Inline Sponsored Banner */}
          <div className={`block xl:hidden w-full max-w-5xl mx-auto my-6 px-4 ${className}`}>
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 glass-panel p-2 shadow-2xl anim-ad-rightsky">
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/80 rounded-t-xl border-b border-white/5">
                <span className="flex items-center gap-1 text-cyan-300">
                  ✨ {adSettings.rightSkyscraperTitle || 'Sponsored Partner'}
                </span>
                <span className="text-slate-500 text-[9px]">SPONSORED PARTNER</span>
              </div>

              <a
                href={adSettings.rightSkyscraperLink || '#'}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block relative rounded-lg overflow-hidden mt-1.5 group"
              >
                <div className="flash-overlay-rightsky"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={adSettings.rightSkyscraperImage}
                  alt={adSettings.rightSkyscraperTitle || 'Right Skyscraper Banner'}
                  className="w-full max-h-36 object-cover rounded-lg group-hover:scale-[1.015] transition-transform duration-300"
                />
                {adSettings.rightSkyscraperLink && (
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 shadow-lg z-30">
                    <span>Visit Sponsor</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                  </div>
                )}
              </a>
            </div>
          </div>
        </>
      );
    }

    if (adSettings.rightSkyscraperType === 'script' && adSettings.rightSkyscraperScript) {
      return (
        <aside className={`w-full my-6 text-center xl:fixed xl:right-3 xl:top-28 xl:w-36 xl:z-30 ${className}`}>
          <div dangerouslySetInnerHTML={{ __html: adSettings.rightSkyscraperScript }} />
        </aside>
      );
    }
  }

  // 7. BEFORE-FOOTER PRE-FOOTER BANNER AD (FLASH STYLE 7: CYBER RAINBOW GLITCH SHIFT)
  if (size === 'footer-banner') {
    if (!adSettings.footerBannerEnabled) return null;

    if (adSettings.footerBannerType === 'image' && adSettings.footerBannerImage) {
      return (
        <div className={`w-full max-w-5xl mx-auto my-8 px-4 ${className}`}>
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 glass-panel p-2 shadow-2xl transition-all duration-300 hover:border-purple-500/80 anim-ad-footerbanner">
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/80 rounded-t-xl border-b border-white/5">
              <span className="flex items-center gap-1 text-purple-300 font-extrabold">
                ✨ {adSettings.footerBannerTitle || 'Sponsored Pre-Footer Partner'}
              </span>
              <span className="text-slate-500 text-[9px]">PRE-FOOTER ADVERTISEMENT</span>
            </div>

            <a
              href={adSettings.footerBannerLink || '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block relative rounded-lg overflow-hidden mt-1.5 group"
            >
              <div className="flash-overlay-footerbanner"></div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={adSettings.footerBannerImage}
                alt={adSettings.footerBannerTitle || 'Pre-Footer Banner'}
                className="w-full max-h-36 object-cover rounded-lg group-hover:scale-[1.015] transition-transform duration-300"
              />
              {adSettings.footerBannerLink && (
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 group-hover:bg-brand-purple transition-colors shadow-lg z-30">
                  <span>Explore Partner</span> <ExternalLink className="w-3 h-3 text-amber-400" />
                </div>
              )}
            </a>
          </div>
        </div>
      );
    }

    if (adSettings.footerBannerType === 'script' && adSettings.footerBannerScript) {
      return (
        <div className={`w-full max-w-5xl mx-auto my-8 px-4 text-center ${className}`}>
          <div dangerouslySetInnerHTML={{ __html: adSettings.footerBannerScript }} />
        </div>
      );
    }
  }

  return null;
}
