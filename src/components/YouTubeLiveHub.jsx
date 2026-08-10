import React, { useState } from 'react';
import { Play, Radio, Users, CheckCircle, ExternalLink, X } from 'lucide-react';
import { YoutubeIcon } from './SocialIcons';
import { YOUTUBE_VIDEOS, SOCIAL_LINKS } from '../data/newsData';

export default function YouTubeLiveHub() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="py-10 bg-slate-950/60 border-t border-white/5">
      <div className="container space-y-6">
        {/* Header Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-red-500/20 bg-slate-900 shadow-2xl">
          {/* YouTube Channel Banner */}
          <div className="h-44 md:h-56 relative overflow-hidden">
            <img 
              src="/brand/02_YouTube_Banner_2560x1440.png" 
              alt="GenZ Live YouTube Banner"
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          {/* Profile & Info Bar */}
          <div className="p-6 relative z-10 -mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img 
                src="/brand/01_YouTube_Profile_800x800.png" 
                alt="GenZ Live YouTube Profile" 
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-slate-950 shadow-2xl bg-slate-900 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/brand/MASTER_SQUARE_2000x2000.png';
                }}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-extrabold text-white">GenZ Live</h3>
                  <CheckCircle className="w-5 h-5 text-red-500 fill-red-500/20" />
                </div>
                <p className="text-xs font-mono text-purple-400">{SOCIAL_LINKS.handle}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-300" /> 148K Subscribers
                  </span>
                  <span>•</span>
                  <span>420+ Live Broadcasts</span>
                </div>
              </div>
            </div>

            {/* Subscribe CTA */}
            <a 
              href={SOCIAL_LINKS.youtube} 
              target="_blank" 
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all hover:scale-105"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>Subscribe on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
            </a>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {YOUTUBE_VIDEOS.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="glass-panel group overflow-hidden cursor-pointer border border-white/10 hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-950 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    {video.isLive ? (
                      <span className="live-pulse">
                        <Radio className="w-3 h-3 animate-pulse" /> LIVE STREAM
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white rounded-md border border-white/10">
                        {video.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                    {video.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{video.views}</span>
                    <span>{video.published}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative space-y-4 p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <YoutubeIcon className="w-5 h-5 text-red-500" />
                <h3 className="text-sm md:text-base font-bold text-white truncate max-w-xl">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video iFrame / Embed Player */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.embedId}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Channel: <strong>GenZ Live (@genz-live-official)</strong></span>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 font-bold hover:underline flex items-center gap-1"
              >
                Watch directly on YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
