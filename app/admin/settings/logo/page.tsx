import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { getBrandSettings } from '@/lib/brandSettings';
import LogoManager from '@/components/admin/LogoManager';
import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Website Logo & Branding Management — GenZ Live CMS',
};

export default async function AdminLogoPage({ searchParams }: { searchParams: Promise<{ saved?: string; reset?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const { saved, reset } = await searchParams;
  const brandSettings = await getBrandSettings();

  return (
    <div className="space-y-6">
      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Branding and logo settings saved successfully! Header and Login screen will update live.
        </div>
      )}
      {reset && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400" /> Logo settings reset to default brand configuration!
        </div>
      )}

      <LogoManager initialSettings={brandSettings} />
    </div>
  );
}
