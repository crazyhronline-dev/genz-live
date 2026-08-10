import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Settings, ShieldCheck, ArrowLeft, Bot, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Newsroom Settings — GenZ Live Admin',
  robots: { index: false, follow: false },
};

export default async function AiSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  const currentProvider = process.env.AI_PROVIDER || 'mock';
  const currentModel = process.env.AI_MODEL || 'gpt-4o-mini';
  const isKeyConfigured = !!process.env.AI_API_KEY;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <Link href="/admin/ai-newsroom" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2">
          <ArrowLeft className="w-3 h-3" /> Back to AI Newsroom
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-purple" /> AI Engine & Safety Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure server-side AI provider abstractions, generation constraints, and editorial safety rules.
        </p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Safety Notice */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl flex items-start gap-3 text-xs text-emerald-200">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-emerald-300 font-bold block">Hardened Security Guarantee:</strong>
          <span>
            API Keys and AI secrets are managed exclusively through server-side environment variables (<code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-emerald-300">.env</code>). Credentials are NEVER exposed to client JS, forms, or HTML.
          </span>
        </div>
      </div>

      {/* Settings Form */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-brand-purple" /> Active AI Provider Parameters
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5 space-y-1">
              <span className="text-slate-400 block font-semibold">Active AI Provider</span>
              <p className="text-sm font-bold text-white font-mono">{currentProvider}</p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5 space-y-1">
              <span className="text-slate-400 block font-semibold">Configured AI Model</span>
              <p className="text-sm font-bold text-white font-mono">{currentModel}</p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5 space-y-1">
              <span className="text-slate-400 block font-semibold">API Key Status</span>
              <p className={`text-sm font-bold font-mono ${isKeyConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isKeyConfigured ? '✅ Active (Server Secret)' : '⚠️ Not Set (Using Mock Engine)'}
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5 space-y-1">
              <span className="text-slate-400 block font-semibold">Automatic Publishing</span>
              <p className="text-sm font-bold text-red-400 font-mono">DISABLED (Strict Rule)</p>
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-amber-200">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4" /> Production Environment Configuration Instructions
            </div>
            <p className="leading-relaxed">
              To configure a live OpenAI or Gemini API provider on Hostinger VPS, add these variables to your production <code className="bg-slate-900 px-1 py-0.5 rounded font-mono text-amber-300">.env</code> file:
            </p>
            <pre className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto">
{`AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
AI_API_KEY=sk-proj-your-actual-api-key-here`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
