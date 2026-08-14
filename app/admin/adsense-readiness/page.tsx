import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { fetchLatestAdSenseAuditAction, fetchAdSenseAuditHistoryAction } from '@/app/admin/adsense-actions';
import AdSenseAuditDashboardClient from './AdSenseAuditDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdSenseReadinessPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const initialReport = await fetchLatestAdSenseAuditAction();
  const history = await fetchAdSenseAuditHistoryAction();

  return (
    <AdSenseAuditDashboardClient
      initialReport={initialReport}
      initialHistory={history}
    />
  );
}
