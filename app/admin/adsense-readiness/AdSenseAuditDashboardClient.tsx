'use client';

// ================================================================
// GenZ Live — AdSense Readiness Audit Dashboard (Client Component)
// Scorecards, 30-check table, category breakdowns, drilldowns & re-scan.
// ================================================================

import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, AlertOctagon, AlertTriangle, CheckCircle2, HelpCircle, History, ChevronRight, Filter } from 'lucide-react';
import { AdSenseAuditReport, AuditCheckResult, CheckStatus } from '@/lib/adsense/auditor';
import { runAdSenseAuditAction } from '@/app/admin/adsense-actions';

interface AuditHistoryItem {
  id: string;
  createdAt: Date | string;
  overallScore: number;
  status: string;
  durationMs: number;
}

interface ClientProps {
  initialReport: AdSenseAuditReport | null;
  initialHistory: AuditHistoryItem[];
}

export default function AdSenseAuditDashboardClient({ initialReport, initialHistory }: ClientProps) {
  const [report, setReport] = useState<AdSenseAuditReport | null>(initialReport);
  const [history] = useState<AuditHistoryItem[]>(initialHistory);
  const [isScanning, setIsScanning] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedCheck, setSelectedCheck] = useState<AuditCheckResult | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleRunAudit = async () => {
    setIsScanning(true);
    try {
      const freshReport = await runAdSenseAuditAction();
      if (freshReport) {
        setReport(freshReport);
      }
    } catch (err) {
      console.error('Audit execution error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const checks = report?.checks || [];

  const filteredChecks = checks.filter(c => {
    if (statusFilter === 'CRITICAL' && !c.isCritical) return false;
    if (statusFilter !== 'ALL' && statusFilter !== 'CRITICAL' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    return true;
  });

  const getStatusBadge = (status: CheckStatus, isCritical: boolean) => {
    if (isCritical && (status === 'FAIL' || status === 'WARN')) {
      return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">CRITICAL BLOCKER</span>;
    }
    switch (status) {
      case 'PASS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PASS</span>;
      case 'WARN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">WARNING</span>;
      case 'FAIL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">FAIL</span>;
      case 'MANUAL_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">MANUAL REVIEW</span>;
    }
  };

  const getStatusCardStyle = (status?: string) => {
    switch (status) {
      case 'READY_TO_APPLY':
        return 'from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 text-emerald-400';
      case 'ALMOST_READY':
        return 'from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 text-amber-400';
      default:
        return 'from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40 text-rose-400';
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-cyan-400" />
            GenZ Live AdSense Readiness Auditor
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated quality gate auditing 30 technical, trust, legal, content, and SEO criteria prior to AdSense application.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <History className="w-4 h-4 text-slate-400" /> Audit Log History
          </button>

          <button
            type="button"
            onClick={handleRunAudit}
            disabled={isScanning}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Running 30-Check Audit...' : 'Run Full Audit'}
          </button>
        </div>
      </div>

      {/* Official Policy Disclaimer Banner */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-300 shadow-xl">
        <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">AdSense Readiness Assessment Notice:</strong> {report?.disclaimer || 'This is an internal quality assessment, not a Google approval prediction or guarantee.'}
          <span className="block text-slate-400 mt-0.5">
            This tool evaluates editorial, technical, legal, and search optimization standards against Google AdSense guidelines.
          </span>
        </div>
      </div>

      {/* Overall Score & Status Card */}
      {report && (
        <div className={`p-6 bg-gradient-to-r ${getStatusCardStyle(report.status)} border rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6`}>
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Overall AdSense Readiness Score</span>
            <div className="flex items-baseline justify-center md:justify-start gap-3">
              <span className="text-5xl font-black tracking-tight text-white">{report.overallScore}</span>
              <span className="text-xl font-bold text-slate-400">/ 100</span>
            </div>
            <div className="text-lg font-black tracking-wide flex items-center justify-center md:justify-start gap-2">
              {report.status === 'READY_TO_APPLY' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {report.status === 'ALMOST_READY' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {report.status === 'NOT_READY' && <AlertOctagon className="w-5 h-5 text-rose-400" />}
              {report.statusLabel}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] font-bold uppercase text-rose-400">Critical Blockers</div>
              <div className="text-2xl font-black text-rose-400 mt-1">{report.criticalBlockersCount}</div>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] font-bold uppercase text-amber-400">Warnings</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{report.warningsCount}</div>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] font-bold uppercase text-purple-400">Manual Reviews</div>
              <div className="text-2xl font-black text-purple-400 mt-1">{report.manualReviewsCount}</div>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] font-bold uppercase text-emerald-400">Passed Checks</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{report.passedCount} / 30</div>
            </div>
          </div>
        </div>
      )}

      {/* 5 Category Score Cards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Content Quality</div>
            <div className="text-xl font-black text-white">{report.categoryScores.content} / 30</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full" style={{ width: `${(report.categoryScores.content / 30) * 100}%` }} />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Newsroom Trust</div>
            <div className="text-xl font-black text-white">{report.categoryScores.trust} / 20</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${(report.categoryScores.trust / 20) * 100}%` }} />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Trust & Legal</div>
            <div className="text-xl font-black text-white">{report.categoryScores.legal} / 10</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full" style={{ width: `${(report.categoryScores.legal / 10) * 100}%` }} />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Technical Quality</div>
            <div className="text-xl font-black text-white">{report.categoryScores.technical} / 20</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: `${(report.categoryScores.technical / 20) * 100}%` }} />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">SEO & Indexing</div>
            <div className="text-xl font-black text-white">{report.categoryScores.seo} / 20</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${(report.categoryScores.seo / 20) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar & 30-Check Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4">
        {/* Filters */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>30-Check AdSense Readiness Audit Matrix</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Tabs */}
            {(['ALL', 'CRITICAL', 'PASS', 'WARN', 'FAIL', 'MANUAL_REVIEW'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-all ${
                  statusFilter === tab ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-3 py-1 font-semibold focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="CONTENT">Content Quality</option>
              <option value="TRUST">Newsroom Trust</option>
              <option value="LEGAL">Trust & Legal</option>
              <option value="TECHNICAL">Technical Quality</option>
              <option value="SEO">SEO & Indexing</option>
            </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-center">#</th>
                <th className="p-3.5">Check Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Check Type</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Score</th>
                <th className="p-3.5">Evidence & Findings</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredChecks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No audit checks match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredChecks.map(check => (
                  <tr key={check.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-400">
                      {String(check.checkNumber).padStart(2, '0')}
                    </td>
                    <td className="p-3.5 font-bold text-white max-w-xs">{check.name}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-semibold">
                        {check.categoryName}
                      </span>
                    </td>
                    <td className="p-3.5 text-[10px] font-mono text-slate-400">
                      {check.checkType.replace(/_/g, ' ')}
                    </td>
                    <td className="p-3.5 text-center">
                      {getStatusBadge(check.status, check.isCritical)}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-cyan-400">
                      {check.score} / {check.maxScore}
                    </td>
                    <td className="p-3.5 max-w-md truncate text-slate-300" title={check.evidence}>
                      {check.evidence}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCheck(check)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                      >
                        Details <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check Detail Modal */}
      {selectedCheck && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase font-mono text-cyan-400">Check #{selectedCheck.checkNumber}</span>
                <h3 className="text-lg font-black text-white">{selectedCheck.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCheck(null)}
                className="text-slate-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                  <span className="text-white font-bold">{selectedCheck.categoryName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold text-center">Score</span>
                  <span className="text-cyan-400 font-black text-sm">{selectedCheck.score} / {selectedCheck.maxScore}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold text-right">Status</span>
                  {getStatusBadge(selectedCheck.status, selectedCheck.isCritical)}
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Evidence & Findings</span>
                <p className="text-slate-200 text-xs">{selectedCheck.evidence}</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-cyan-950/30 to-slate-950 border border-cyan-500/30 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-cyan-400">Recommended Action</span>
                <p className="text-emerald-300 text-xs">👉 {selectedCheck.recommendation}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCheck(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" /> Historical AdSense Readiness Audits
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 text-xs">
              {history.length === 0 ? (
                <p className="text-slate-400 p-4 text-center">No historical audit records logged yet.</p>
              ) : (
                history.map((h, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-mono">
                        {new Date(h.createdAt).toLocaleString()}
                      </span>
                      <span className="font-bold text-white">Score: {h.overallScore} / 100</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        h.status === 'READY_TO_APPLY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {h.status}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {h.durationMs}ms
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
