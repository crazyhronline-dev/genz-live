import React from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { BREAKING_HEADLINES } from '../data/newsData';

export default function BreakingTicker({ onSelectHeadline }) {
  return (
    <div className="bg-slate-900/90 border-b border-purple-500/20 py-2.5 px-4 overflow-hidden relative">
      <div className="container flex items-center gap-3">
        {/* Fixed Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600/20 border border-red-500/40 text-red-400 font-extrabold text-[11px] uppercase tracking-wider rounded-md shrink-0 shadow-sm shadow-red-900/30">
          <Flame className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>BREAKING</span>
        </div>

        {/* Sliding Ticker Wrap */}
        <div className="ticker-wrap flex-1 overflow-hidden">
          <div className="ticker-move flex items-center gap-8">
            {BREAKING_HEADLINES.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHeadline && onSelectHeadline(item)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-purple-300 transition-colors group cursor-pointer"
              >
                <span className="text-purple-400 font-mono text-[10px] uppercase px-1.5 py-0.5 bg-purple-950/60 border border-purple-800/40 rounded">
                  {item.category}
                </span>
                <span>{item.text}</span>
                <span className="text-slate-500 text-[10px]">({item.time})</span>
                <ChevronRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
