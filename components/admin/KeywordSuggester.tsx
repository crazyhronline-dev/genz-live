'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Tag, Plus, X, Search, Loader2 } from 'lucide-react';
import { suggestKeywordsAction } from '@/app/admin/actions';

interface KeywordSuggesterProps {
  initialKeywords?: string | null;
}

export default function KeywordSuggester({ initialKeywords }: KeywordSuggesterProps) {
  const [keywords, setKeywords] = useState<string[]>(() => {
    if (!initialKeywords) return [];
    return initialKeywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);
  });

  const prevInitialRef = React.useRef(initialKeywords);

  useEffect(() => {
    if (prevInitialRef.current !== initialKeywords) {
      prevInitialRef.current = initialKeywords;
      if (typeof initialKeywords === 'string' && initialKeywords.trim().length > 0) {
        setKeywords(
          initialKeywords
            .split(',')
            .map(k => k.trim())
            .filter(Boolean)
        );
      }
    }
  }, [initialKeywords]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const addKeyword = (kw: string) => {
    const cleaned = kw.trim();
    if (!cleaned) return;
    if (!keywords.some(k => k.toLowerCase() === cleaned.toLowerCase())) {
      setKeywords(prev => [...prev, cleaned]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(inputVal);
      setInputVal('');
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    setKeywords(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAiSuggest = async () => {
    try {
      setLoading(true);
      setAiNotice('Reading news title, summary & body content to analyze SERP intent...');

      // Extract current form values dynamically from DOM
      const titleInput = (document.querySelector('input[name="title"]') as HTMLInputElement)?.value || '';
      const excerptInput = (document.querySelector('textarea[name="excerpt"]') as HTMLTextAreaElement)?.value || '';
      const contentInput = (document.querySelector('textarea[name="content"]') as HTMLTextAreaElement)?.value || '';

      if (!titleInput && !excerptInput && !contentInput) {
        setAiNotice('Please enter an Article Title or Content body first so AI can analyze keywords.');
        setLoading(false);
        return;
      }

      const suggested = await suggestKeywordsAction(titleInput, excerptInput, contentInput);

      if (suggested && suggested.length > 0) {
        let addedCount = 0;
        setKeywords(prev => {
          const updated = [...prev];
          for (const item of suggested) {
            if (!updated.some(k => k.toLowerCase() === item.toLowerCase())) {
              updated.push(item);
              addedCount++;
            }
          }
          return updated;
        });
        setAiNotice(`AI analyzed story & added ${addedCount} high-ranking SERP keywords!`);
      } else {
        setAiNotice('AI analysis complete. No additional keywords generated.');
      }
    } catch (err) {
      console.error('AI Suggestion Error:', err);
      setAiNotice('AI suggestion encountered an issue. You can manually add keywords below.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
      <input type="hidden" name="keywords" value={keywords.join(',')} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div>
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-purple" /> Target SERP Ranking Keywords
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Keywords inserted into article meta headers and Google News schema to rank on top of SERPs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAiSuggest}
          disabled={loading}
          className="btn-primary text-xs py-2 px-3.5 inline-flex items-center justify-center gap-1.5 shadow-glow-purple shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Story...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" /> Auto-Suggest Keywords with AI
            </>
          )}
        </button>
      </div>

      {aiNotice && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          loading ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
        }`}>
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Sparkles className="w-3.5 h-3.5 shrink-0" />}
          <span>{aiNotice}</span>
        </div>
      )}

      {/* Keywords Chips Container */}
      <div className="flex flex-wrap gap-2 min-h-[44px] p-2.5 rounded-xl bg-slate-950 border border-white/10">
        {keywords.length > 0 ? (
          keywords.map((kw, idx) => (
            <span
              key={`${kw}-${idx}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs font-semibold shadow-sm hover:border-brand-purple transition-all"
            >
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => removeKeyword(idx)}
                className="p-0.5 rounded-full hover:bg-purple-800 text-purple-400 hover:text-white transition-colors"
                title="Remove keyword"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic p-1">No keywords added yet. Click &quot;Auto-Suggest Keywords with AI&quot; or type keywords below.</p>
        )}
      </div>

      {/* Manual Keyword Input Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type target keyword and press Enter or comma..."
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
        <button
          type="button"
          onClick={() => { addKeyword(inputVal); setInputVal(''); }}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-brand-purple text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  );
}
