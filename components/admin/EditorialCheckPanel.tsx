'use client';

// ================================================================
// GenZ Live — Editorial Check CMS UI Component
// Embedded Scorecard Panel for Article Editors & AI Newsroom
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
  const [sourceName, setSourceName] = useState('');
  const [sourceContent, setSourceContent] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'scorecard' | 'claims' | 'originality' | 'quotes' | 'allegations'>('scorecard');

  const handleRunCheck = async () => {
    setLoading(true);
    try {
      const sources = sourceContent.trim()
        ? [{ name: sourceName || 'External Source', content: sourceContent }]
        : [];

      const res = await runEditorialCheckAction(articleId, sources);
      if (res.success && res.report) {
        setReport(res.report);
      } else {
        alert(res.error || 'Failed to execute editorial check.');
      }
    } catch {
      alert('An error occurred during checking.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = async () => {
    if (!overrideReason || overrideReason.trim().length < 10) {
      alert('Please provide a detailed reason (at least 10 characters) for overriding the warning.');
      return;
    }

    setLoading(true);
    try {
      const res = await overrideEditorialCheckAction(articleId, overrideReason);
      if (res.success && report) {
        setReport({ ...report, status: 'PASSED' });
        setShowOverrideModal(false);
      } else {
        alert(res.error || 'Failed to record override.');
      }
    } catch {
      alert('Failed to execute override.');
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
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> GREEN / PASS</span>;
      case 'REVIEW_REQUIRED':
      case 'PARTIALLY_SUPPORTED':
      case 'MISSING_ATTRIBUTION':
      case 'ATTRIBUTION_RECOMMENDED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><AlertTriangle className="w-3.5 h-3.5" /> YELLOW / REVIEW</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle className="w-3.5 h-3.5" /> RED / FAIL</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl mb-8">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-600/20 text-violet-400 rounded-lg border border-violet-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">GenZ Live Editorial Check</h3>
            <p className="text-xs text-slate-400">Fact accuracy, originality, quote verification, and attribution assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {report && getStatusBadge(report.status)}
          <button
            onClick={handleRunCheck}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing...' : report ? 'Re-Run Check' : 'Run Editorial Check'}
          </button>
        </div>
      </div>

      {/* Source Input Drawer */}
      <div className="mt-4 p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
        <details className="group">
          <summary className="cursor-pointer text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between">
            <span>➕ Attach External Reference Source for Originality & Fact Matching (Optional)</span>
            <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Source Name (e.g. Reuters, AP, TechCrunch)</label>
              <input
                type="text"
                value={sourceName}
                onChange={e => setSourceName(e.target.value)}
                placeholder="Reuters"
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Source Reference Text (Paste reference article to compare overlap)</label>
              <textarea
                rows={3}
                value={sourceContent}
                onChange={e => setSourceContent(e.target.value)}
                placeholder="Paste external news story or official press release text here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </details>
      </div>

      {/* No Report Placeholder */}
      {!report && !loading && (
        <div className="text-center py-8 text-slate-400 text-xs">
          Click <strong className="text-violet-400">&quot;Run Editorial Check&quot;</strong> above to extract factual claims, verify quote sources, and calculate the Originality & Source Dependency Score.
        </div>
      )}

      {/* Report Summary Scorecard */}
      {report && (
        <div className="mt-6 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-2">
            {[
              { id: 'scorecard', label: 'Scorecard', icon: ShieldCheck },
              { id: 'claims', label: `Claims (${report.claims?.length || 0})`, icon: FileText },
              { id: 'originality', label: `Originality (${report.originalityScore}/100)`, icon: TrendingUp },
              { id: 'quotes', label: `Quotes (${report.quotes?.length || 0})`, icon: QuoteIcon },
              { id: 'allegations', label: `Allegations (${report.allegations?.length || 0})`, icon: AlertOctagon },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'scorecard' | 'claims' | 'originality' | 'quotes' | 'allegations')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
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

          {/* TAB 1: SCORECARD */}
          {activeTab === 'scorecard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Overall Score</div>
                  <div className="text-2xl font-black text-white mt-1">{report.overallScore}<span className="text-xs text-slate-500">/100</span></div>
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Fact Accuracy</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{report.factScore}%</div>
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Originality Score</div>
                  <div className="text-2xl font-black text-cyan-400 mt-1">{report.originalityScore}%</div>
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Source Dependency</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">{report.sourceDependencyScore}%</div>
                </div>
              </div>

              {/* Recommendation banner */}
              <div className={`p-4 rounded-lg border text-xs font-semibold flex items-center justify-between ${
                report.status === 'PASSED'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : report.status === 'REVIEW_REQUIRED'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Recommendation: <strong>{report.finalRecommendation}</strong></span>
                </div>

                {report.status !== 'PASSED' && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(userRole) && (
                  <button
                    onClick={() => setShowOverrideModal(true)}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-bold"
                  >
                    Editor Override
                  </button>
                )}
              </div>

              {/* Risk Flags */}
              {report.riskFlags?.length > 0 && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-amber-400" /> Identified Risk Items:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    {report.riskFlags.map((flag: string, idx: number) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLAIMS */}
          {activeTab === 'claims' && (
            <div className="space-y-3">
              {report.claims?.map(c => (
                <div key={c.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">{c.claimType}</span>
                    {getStatusBadge(c.status)}
                  </div>
                  <p className="text-white font-medium">&quot;{c.claim}&quot;</p>
                  {c.suggestedAttribution && (
                    <p className="text-amber-400 text-[11px]">💡 Suggested Attribution: {c.suggestedAttribution}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ORIGINALITY */}
          {activeTab === 'originality' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-slate-400 font-medium">Headline Similarity Level: <strong className="text-white">{report.headlineSimilarityLevel}</strong></div>
                {report.suggestedHeadline && (
                  <p className="mt-1 text-cyan-400">💡 Suggested Independent Headline: <strong>{report.suggestedHeadline}</strong></p>
                )}
              </div>

              {report.matchingPhrases?.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300">Matching Overlapping Phrases:</h4>
                  {report.matchingPhrases.map((phrase: string, idx: number) => (
                    <div key={idx} className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded font-mono text-[11px]">
                      &quot;{phrase}&quot;
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No continuous matching phrase overlap detected against provided source references.</p>
              )}
            </div>
          )}

          {/* TAB 4: QUOTES */}
          {activeTab === 'quotes' && (
            <div className="space-y-3">
              {report.quotes?.map(q => (
                <div key={q.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-violet-400">{q.speaker || 'Unattributed Speaker'}</span>
                    {getStatusBadge(q.status)}
                  </div>
                  <p className="text-white italic">&quot;{q.quote}&quot;</p>
                  <p className="text-slate-500 text-[11px]">{q.notes}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: ALLEGATIONS */}
          {activeTab === 'allegations' && (
            <div className="space-y-3">
              {report.allegations?.map(a => (
                <div key={a.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-400">Flagged Keyword: {a.keyword}</span>
                    {getStatusBadge(a.status)}
                  </div>
                  <p className="text-white">&quot;{a.sentence}&quot;</p>
                  <p className="text-cyan-400 text-[11px]">💡 Suggested Attribution: {a.suggestedPhrasing}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> Human Editor Override Confirmation
            </h3>
            <p className="text-xs text-slate-400">
              Authorized editors may override non-critical warnings by recording an explicit reason. This override will be logged in audit history.
            </p>
            <textarea
              rows={3}
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
              placeholder="e.g. Verified official statement text directly from press release."
              className="w-full bg-slate-950 border border-slate-700 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleOverride}
                disabled={loading}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
