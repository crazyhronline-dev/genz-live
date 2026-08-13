import type { Metadata } from 'next';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { SITE_CONFIG } from '@/config/site';
import { redirect } from 'next/navigation';
import { saveSettingsAction } from '@/app/admin/actions';

import Link from 'next/link';
import { Image as ImageIcon, ArrowRight, Megaphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Site Settings — GenZ Live CMS',
};

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const { saved } = await searchParams;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Platform Settings</h1>
        <p className="text-xs text-slate-400">Configure global metadata, publication parameters, and brand assets</p>
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo & Branding Management Shortcut */}
        <Link
          href="/admin/settings/logo"
          className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-brand-purple/50 transition-all shadow-glow-purple/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20 border border-brand-purple/30 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-brand-cyan" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-heading group-hover:text-brand-cyan transition-colors">
                Logo & Branding
              </h3>
              <p className="text-[11px] text-slate-400">
                Manage header logo, login screen logo, and favicon sizes.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-brand-cyan transition-all shrink-0" />
        </Link>

        {/* Ad & Sponsored Banner Management Shortcut */}
        <Link
          href="/admin/settings/ads"
          className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-amber-500/50 transition-all shadow-glow-purple/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-brand-purple/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-heading group-hover:text-amber-400 transition-colors">
                Ad & Sponsored Banner Manager
              </h3>
              <p className="text-[11px] text-slate-400">
                Run sponsored partner ads, banner campaigns & AdSense.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-400 transition-all shrink-0" />
        </Link>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Platform settings saved successfully!
        </div>
      )}

      <form action={saveSettingsAction} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-purple" /> General Site Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Site Name</label>
              <input name="siteName" defaultValue={SITE_CONFIG.name} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Tagline</label>
              <input name="tagline" defaultValue={SITE_CONFIG.tagline} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Configured Domain</label>
              <input defaultValue={SITE_CONFIG.domain} readOnly className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button type="submit" className="btn-primary py-2.5 px-5 text-xs font-bold shadow-glow-purple inline-flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

