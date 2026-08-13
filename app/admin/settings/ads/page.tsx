import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { getAdSettings } from '@/lib/adSettings';
import AdManager from '@/components/admin/AdManager';
import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Ad & Sponsored Banner Management — GenZ Live CMS',
};

export default async function AdminAdsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const { saved } = await searchParams;
  const adSettings = await getAdSettings();

  return (
    <div className="space-y-6">
      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ad configuration and sponsored banner settings saved successfully! Ads will update live across the website.
        </div>
      )}

      <AdManager initialSettings={adSettings} />
    </div>
  );
}
