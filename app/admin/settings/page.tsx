import type { Metadata } from 'next';
import { Settings, Save } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { SITE_CONFIG } from '@/config/site';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Site Settings — GenZ Live CMS',
};

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Platform Settings</h1>
        <p className="text-xs text-slate-400">Configure global metadata and publication parameters</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-purple" /> General Site Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Site Name</label>
              <input defaultValue={SITE_CONFIG.name} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Tagline</label>
              <input defaultValue={SITE_CONFIG.tagline} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Configured Domain</label>
              <input defaultValue={SITE_CONFIG.domain} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button disabled className="btn-primary py-2.5 px-5 text-xs font-bold opacity-75 cursor-not-allowed inline-flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
