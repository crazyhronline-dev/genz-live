'use client';

// ================================================================
// GenZ Live — Editorial Check CMS UI Component (Managed Design System)
// Embedded Fact-Check & Originality Panel for Article Editors
// ================================================================

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  RefreshCw,
  FileText,
  Quote as QuoteIcon,
  TrendingUp,
  AlertOctagon,
  Lock,
  Plus,
  ChevronDown,
  Info,
} from 'lucide-react';
import { runEditorialCheckAction, overrideEditorialCheckAction } from '@/app/admin/editorial-actions';
import { EditorialCheckReport } from '@/lib/editorial/orchestrator';

interface EditorialCheckPanelProps {
  articleId: string;
  articleTitle?: string;
  articleContent?: string;
  initialReport?: EditorialCheckReport | null;
  userRole?: string;
}

export default function EditorialCheckPanel({
  articleId,
  initialReport,
  userRole = 'EDITOR',
}: EditorialCheckPanelProps) {
  const [report, setReport] = useState<EditorialCheckReport | null>(initialReport || null);
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Optional source drawer state
  const [showSourceDrawer, setShowSourceDrawer] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [sourceContent, setSourceContent] = useState('');

  // Override modal state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideError, setOverrideError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'scorecard' | 'claims' | 'originality' | 'quotes' | 'allegations'>('scorecard');

  const handleRunCheck = async () => {
    setLoading(true);
    setErrorMessage(null);
    setAnalysisStep('Extracting factual claims & statistics...');

    try {
      const stepTimer1 = setTimeout(() => {
        setAnalysisStep('Running originality shingle & source phrase matching...');
      }, 600);

      const stepTimer2 = setTimeout(() => {
        setAnalysisStep('Verifying quotes, allegations & defamation safety...');
      }, 1200);

      const sources = sourceContent.trim()
        ? [{ name: sourceName || 'External Reference Source', content: sourceContent }]
        : [];

      const res = await runEditorialCheckAction(articleId, sources);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (res.success && res.report) {
        setReport(res.report);
      } else {
        setErrorMessage(res.error || 'Failed to execute editorial check.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during editorial check execution.');
    } finally {
      setLoading(false);
      setAnalysisStep('');
    }
  };

  const handleOverride = async () => {
    if (!overrideReason || overrideReason.trim().length < 10) {
      setOverrideError('Please provide a detailed explanation (at least 10 characters) for overriding the warning.');
      return;
    }

    setLoading(true);
    setOverrideError(null);
    try {
      const res = await overrideEditorialCheckAction(articleId, overrideReason);
      if (res.success && report) {
        setReport({ ...report, status: 'PASSED' });
        setShowOverrideModal(false);
        setOverrideReason('');
      } else {
        setOverrideError(res.error || 'Failed to record editor override.');
      }
    } catch {
      setOverrideError('An error occurred while saving the override.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
      case 'SUPPORTED':
      case 'VERIFIED':
      case 'SAFE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> GREEN / PASSED
          </span>
        );
      case 'REVIEW_REQUIRED':
      case 'PARTIALLY_SUPPORTED':
      case 'MISSING_ATTRIBUTION':
      case 'ATTRIBUTION_RECOMMENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> YELLOW / REVIEW REQUIRED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> RED / HIGH RISK
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 my-6 text-slate-100 font-sans">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-violet-600/30 to-purple-600/10 text-violet-400 rounded-xl border border-violet-500/30 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              Editorial Fact-Check & Originality Scanner
            </h3>
            <p className="text-xs text-slate-400">
              Automated claim extraction, quote verification, shingle originality analysis, and defamation safety gate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {report && getStatusBadge(report.status)}
          <button
            type="button"
            onClick={handleRunCheck}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing...' : report ? 'Re-Run Check' : 'Run Editorial Check'}
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-400 font-bold px-2">✕</button>
        </div>
      )}

      {/* Analysis Step Loading Bar */}
      {loading && analysisStep && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-violet-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              {analysisStep}
            </span>
            <span className="font-mono text-slate-500 text-[10px]">VERIFYING...</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Optional Reference Source Accordion */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSourceDrawer(!showSourceDrawer)}
          className="w-full p-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-violet-400" />
            Attach Reference Article for Originality Comparison (Optional)
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showSourceDrawer ? 'rotate-180' : ''}`} />
        </button>

        {showSourceDrawer && (
          <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Source Name (e.g., Reuters, AP, TechCrunch)</label>
              <input
                type="text"
                value={sourceName}
                onChange={e => setSourceName(e.target.value)}
                placeholder="Reuters"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Reference Article Text (Paste raw source text for overlap check)</label>
              <textarea
                rows={3}
                value={sourceContent}
                onChange={e => setSourceContent(e.target.value)}
                placeholder="Paste external report or official press release content here..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* No Report Placeholder State */}
      {!report && !loading && (
        <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center space-y-2">
          <Info className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-xs font-bold text-slate-300">No Editorial Check Generated Yet</h4>
          <p className="text-[11px] text-slate-400 max-w-md mx-auto">
            Click <strong className="text-violet-400">&quot;Run Editorial Check&quot;</strong> above to extract claims, check originality against sources, and verify statistics prior to publishing.
          </p>
        </div>
      )}

      {/* Report Details & Scorecard */}
      {report && (
        <div className="space-y-5">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-1 overflow-x-auto">
            {[
              { id: 'scorecard', label: 'Scorecard Overview', icon: ShieldCheck },
              { id: 'claims', label: `Claims (${report.claims?.length || 0})`, icon: FileText },
              { id: 'originality', label: `Originality (${report.originalityScore}%)`, icon: TrendingUp },
              { id: 'quotes', label: `Quotes (${report.quotes?.length || 0})`, icon: QuoteIcon },
              { id: 'allegations', label: `Allegations (${report.allegations?.length || 0})`, icon: AlertOctagon },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as 'scorecard' | 'claims' | 'originality' | 'quotes' | 'allegations')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: SCORECARD OVERVIEW */}
          {activeTab === 'scorecard' && (
            <div className="space-y-4">
              {/* 4 Metrics Scorecard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Score</span>
                  <span className="text-2xl font-black text-white mt-1 block">{report.overallScore}<span className="text-xs text-slate-500">/100</span></span>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Fact Accuracy</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">{report.factScore}%</span>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block">Originality Score</span>
                  <span className="text-2xl font-black text-cyan-400 mt-1 block">{report.originalityScore}%</span>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Source Dependency</span>
                  <span className="text-2xl font-black text-amber-400 mt-1 block">{report.sourceDependencyScore}%</span>
                </div>
              </div>

              {/* Final Recommendation Card */}
              <div className={`p-4 rounded-xl border text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                report.status === 'PASSED'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : report.status === 'REVIEW_REQUIRED'
                  ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Recommendation: <strong>{report.finalRecommendation}</strong></span>
                </div>

                {report.status !== 'PASSED' && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(userRole) && (
                  <button
                    type="button"
                    onClick={() => setShowOverrideModal(true)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md shrink-0"
                  >
                    <Lock className="w-3 h-3" /> Editor Override
                  </button>
                )}
              </div>

              {/* Identified Risk Items */}
              {report.riskFlags && report.riskFlags.length > 0 && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-amber-400" /> Identified Risk Items ({report.riskFlags.length})
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {report.riskFlags.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 bg-slate-900/60 rounded border border-slate-800">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FACTUAL CLAIMS */}
          {activeTab === 'claims' && (
            <div className="space-y-3">
              {(!report.claims || report.claims.length === 0) ? (
                <p className="text-slate-400 text-xs text-center py-4">No explicit factual claims extracted from story body.</p>
              ) : (
                report.claims.map((claim, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">&quot;{claim.claim}&quot;</span>
                      {getStatusBadge(claim.status)}
                    </div>
                    <p className="text-slate-400 text-[11px]">Confidence Rating: <strong>{Math.round((claim.confidence || 1) * 100)}%</strong></p>
                    {claim.suggestedAttribution && <p className="text-emerald-400 text-[11px]">👉 Suggested Attribution: {claim.suggestedAttribution}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ORIGINALITY & MATCHED PHRASES */}
          {activeTab === 'originality' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Shingle Originality Score</span>
                <span className="text-xl font-black text-cyan-400">{report.originalityScore} / 100</span>
                <p className="text-slate-400 text-[11px]">Evaluates word sequence overlap against external databases and attached references.</p>
              </div>

              {report.matchingPhrases && report.matchingPhrases.length > 0 && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-amber-400 font-bold block text-xs">Overlapping Phrase Matches Detected</span>
                  <ul className="space-y-1 text-slate-300">
                    {report.matchingPhrases.map((phrase, idx) => (
                      <li key={idx} className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-amber-300">
                        &quot;{phrase}&quot;
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QUOTE VERIFICATION */}
          {activeTab === 'quotes' && (
            <div className="space-y-3">
              {(!report.quotes || report.quotes.length === 0) ? (
                <p className="text-slate-400 text-xs text-center py-4">No direct speaker quotes detected in article text.</p>
              ) : (
                report.quotes.map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">&quot;{q.quote}&quot;</span>
                      {getStatusBadge(q.status)}
                    </div>
                    {q.speaker && <p className="text-slate-400 text-[11px]">Attributed Speaker: <strong>{q.speaker}</strong></p>}
                    {q.notes && <p className="text-emerald-400 text-[11px]">👉 {q.notes}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: ALLEGATIONS & SAFETY */}
          {activeTab === 'allegations' && (
            <div className="space-y-3">
              {(!report.allegations || report.allegations.length === 0) ? (
                <p className="text-slate-400 text-xs text-center py-4">Zero sensitive allegations or defamation risks flagged.</p>
              ) : (
                report.allegations.map((alg, idx) => (
                  <div key={idx} className="p-3.5 bg-rose-950/30 border border-rose-500/30 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300">&quot;{alg.sentence}&quot;</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">
                        {alg.status === 'CRITICAL_RISK' ? 'CRITICAL RISK' : 'ATTRIBUTION RECOMMENDED'}
                      </span>
                    </div>
                    {alg.suggestedPhrasing && <p className="text-slate-300 text-[11px]">Suggested Phrasing: {alg.suggestedPhrasing}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Editor Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" /> Human Editor Warning Override
              </h3>
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Only authorized Editors and Admins can override fact-check warnings. A mandatory audit explanation (at least 10 characters) is logged for accountability.
            </p>

            {overrideError && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-xs text-rose-300">
                {overrideError}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Mandatory Override Explanation</label>
              <textarea
                rows={3}
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                placeholder="Explain why this warning is safe to override (e.g., Primary source confirmed via official press briefing)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {overrideReason.trim().length} / 10 characters minimum
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOverride}
                disabled={loading || overrideReason.trim().length < 10}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-lg shadow-amber-600/20"
              >
                {loading ? 'Recording...' : 'Submit Official Override'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
