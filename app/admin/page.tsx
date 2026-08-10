import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  FileEdit,
  Clock,
  CheckCircle2,
  Flame,
  TrendingUp,
  Users,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard Overview — GenZ Live CMS',
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const stats = await getDashboardStats();

  const statCards = [
    { label: 'Total Articles', count: stats.totalArticles, href: '/admin/articles', icon: FileText, color: 'border-brand-purple/40 text-purple-400' },
    { label: 'Drafts', count: stats.draftsCount, href: '/admin/articles/drafts', icon: FileEdit, color: 'border-amber-500/40 text-amber-400' },
    { label: 'Pending Review', count: stats.reviewCount, href: '/admin/articles/review', icon: Clock, color: 'border-blue-500/40 text-blue-400' },
    { label: 'Scheduled', count: stats.scheduledCount, href: '/admin/articles/scheduled', icon: Clock, color: 'border-indigo-500/40 text-indigo-400' },
    { label: 'Published', count: stats.publishedCount, href: '/admin/articles/published', icon: CheckCircle2, color: 'border-emerald-500/40 text-emerald-400' },
    { label: 'Breaking News', count: stats.breakingCount, href: '/admin/breaking-news', icon: Flame, color: 'border-red-500/40 text-red-400' },
    { label: 'Trending Stories', count: stats.trendingCount, href: '/admin/trending', icon: TrendingUp, color: 'border-cyan-500/40 text-cyan-400' },
    { label: 'Authors', count: stats.authorsCount, href: '/admin/authors', icon: Users, color: 'border-slate-500/40 text-slate-300' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            Newsroom Control
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading mt-2">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-brand-purple">{user.role}</strong> · Managing GenZ Live publishing workflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/articles/new" className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-glow-purple">
            <PlusCircle className="w-4 h-4" /> Create New Article
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`glass-panel p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 block ${card.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <Icon className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-extrabold text-white mt-3 font-mono">{card.count}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-base font-extrabold text-white font-heading">Quick Actions</h2>
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
            <Link
              href="/admin/articles/new"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-brand-purple/20 hover:bg-brand-purple text-white text-xs font-bold transition-all border border-purple-500/30 group"
            >
              <span>+ Write New Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin/articles/review"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all border border-white/5 group"
            >
              <span>Review Articles ({stats.reviewCount})</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin/articles/scheduled"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all border border-white/5 group"
            >
              <span>Scheduled Queue ({stats.scheduledCount})</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin/breaking-news"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all border border-white/5 group"
            >
              <span>Manage Breaking Ticker</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Audit Activity Stream */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-purple" /> Recent Newsroom Activity
            </h2>
            <Link href="/admin/audit-logs" className="text-xs text-brand-cyan hover:underline font-medium">View Full Audit Log</Link>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
            {stats.recentLogs.length > 0 ? (
              <div className="space-y-2">
                {stats.recentLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs">
                    <div>
                      <span className="font-bold text-white">{log.userName}</span>
                      <span className="text-slate-400"> executed </span>
                      <span className="font-mono text-brand-purple">{log.action}</span>
                      <span className="text-slate-500"> on {log.entityType}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{log.createdAt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No recent audit log activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
