'use client';

// ================================================================
// GenZ Live — Headline Quality & Clickbait Risk Feedback Widget
// Interactive CMS widget evaluating headline clarity & SERP length.
// ================================================================

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { analyzeHeadlineQuality, HeadlineAnalysisReport } from '@/lib/analytics/headlineAnalyzer';

interface HeadlineAnalyzerPanelProps {
  headline: string;
}

export default function HeadlineAnalyzerPanel({ headline }: HeadlineAnalyzerPanelProps) {
  const [analysis, setAnalysis] = useState<HeadlineAnalysisReport | null>(null);

  const handleAnalyze = () => {
    const report = analyzeHeadlineQuality(headline);
    setAnalysis(report);
  };

  return (
    <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Headline Intelligence & Clickbait Risk Evaluator
        </span>
        <button
          type="button"
          onClick={handleAnalyze}
          className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[10px] font-bold transition-all"
        >
          Evaluate Headline
        </button>
      </div>

      {analysis && (
        <div className="mt-2 p-3 bg-slate-900 border border-slate-800 rounded space-y-2 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Length: <strong>{analysis.charCount} chars</strong> ({analysis.wordCount} words)</span>
            <span className={`font-bold ${
              analysis.qualityScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
            }`}>Quality Score: {analysis.qualityScore}/100</span>
          </div>

          {analysis.feedback.length > 0 && (
            <ul className="list-disc list-inside text-slate-400 space-y-0.5">
              {analysis.feedback.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}

          {analysis.suggestions.length > 0 && (
            <div className="text-cyan-400 font-medium">
              💡 Suggestions: {analysis.suggestions.join(' ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
