// ================================================================
// GenZ Live — Master Audience Growth & Revenue Hub (/admin/growth)
// Discover readiness, News readiness, Social Distribution, & AdSense.
// ================================================================

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { fetchGrowthHubDataAction } from '@/app/admin/growth-actions';
import SocialDistributionPanel from '@/components/admin/SocialDistributionPanel';
import { Rocket, Share2, Globe, DollarSign, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GrowthHubPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const data = await fetchGrowthHubDataAction();
  if (!data) redirect('/admin');

  return (
    <div className="space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Rocket className="w-7 h-7 text-cyan-400" />
            Audience Growth, Discover/News & Revenue Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Google Discover readiness, multi-platform social distribution, and AdSense revenue preparation
          </p>
        </div>

        {/* Dynamic /ads.txt link */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span><strong>AdSense ads.txt Authorization Record:</strong> Accessible dynamically at <code>/ads.txt</code></span>
          </div>
          <a href="/ads.txt" target="_blank" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold flex items-center gap-1">
            View /ads.txt <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Social Distribution Packages */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" /> Recent Article Social Distribution Packages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.socialPackages.map((pkg, idx) => (
              <SocialDistributionPanel key={idx} packageData={pkg} />
            ))}
          </div>
        </div>

        {/* Google Discover & News Readiness Audit Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Google Discover & News Eligibility Audit
            </h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4 text-center">Discover Score</th>
                <th className="p-4 text-center">News Score</th>
                <th className="p-4 text-center">Discover Status</th>
                <th className="p-4 text-center">News Status</th>
                <th className="p-4">Warnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {data.discoverAudits.map(audit => (
                <tr key={audit.articleId} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-semibold text-white max-w-xs truncate">{audit.title}</td>
                  <td className="p-4 text-center font-bold text-cyan-400">{audit.discoverScore}/100</td>
                  <td className="p-4 text-center font-bold text-emerald-400">{audit.newsScore}/100</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      audit.isDiscoverEligible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>{audit.isDiscoverEligible ? 'ELIGIBLE' : 'NEEDS_WORK'}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      audit.isNewsEligible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>{audit.isNewsEligible ? 'READY' : 'EXPIRED/INCOMPLETE'}</span>
                  </td>
                  <td className="p-4 text-amber-400 text-[11px] max-w-xs truncate">
                    {audit.warnings.length > 0 ? audit.warnings.join('; ') : 'No warnings'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}
