import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FileEdit,
  Clock,
  CheckCircle2,
  FolderTree,
  Tag as TagIcon,
  Users,
  Link2,
  Image as ImageIcon,
  Flame,
  TrendingUp,
  History,
  UserCog,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { getCurrentUser } from '@/lib/auth';
import { logoutAction } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'GenZ Live Admin CMS & Newsroom',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // If unauthenticated, pass through for login page, redirect others
  if (!user) {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'All Articles', href: '/admin/articles', icon: FileText },
    { label: '+ Create Article', href: '/admin/articles/new', icon: PlusCircle, highlight: true },
    { label: 'Drafts', href: '/admin/articles/drafts', icon: FileEdit },
    { label: 'Review Queue', href: '/admin/articles/review', icon: Clock },
    { label: 'Scheduled', href: '/admin/articles/scheduled', icon: Clock },
    { label: 'Published', href: '/admin/articles/published', icon: CheckCircle2 },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Tags', href: '/admin/tags', icon: TagIcon },
    { label: 'Authors', href: '/admin/authors', icon: Users },
    { label: 'Sources', href: '/admin/sources', icon: Link2 },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: '🤖 AI Newsroom', href: '/admin/ai-newsroom', icon: TrendingUp },
    { label: '└ Ingestion Inbox', href: '/admin/ai-newsroom/inbox', icon: Link2 },
    { label: '└ AI Sources', href: '/admin/ai-newsroom/sources', icon: FolderTree },
    { label: '└ AI Drafts', href: '/admin/ai-newsroom/drafts', icon: FileEdit },
    { label: '└ AI Settings', href: '/admin/ai-newsroom/settings', icon: Settings },
    { label: 'Breaking News', href: '/admin/breaking-news', icon: Flame },
    { label: 'Trending', href: '/admin/trending', icon: TrendingUp },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
    ...(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? [{ label: 'Users', href: '/admin/users', icon: UserCog }] : []),
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      {/* CMS Sidebar */}
      <aside className="w-full md:w-64 bg-navy-surface border-r border-white/10 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Logo size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            CMS
          </span>
        </div>

        {/* User Info Card */}
        <div className="p-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <span className="text-[10px] text-brand-cyan font-mono">{user.role}</span>
          </div>
          <form action={logoutAction}>
            <button title="Log Out" type="submit" className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  item.highlight
                    ? 'bg-brand-purple text-white hover:bg-purple-600 shadow-glow-purple my-2'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Site Footer Link */}
        <div className="p-3 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-white/5 transition-all"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" />
          </a>
        </div>
      </aside>

      {/* Main CMS Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-navy-surface border-b border-white/10 py-3 px-6 flex items-center justify-between">
          <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest">GenZ Live Editorial Control System</h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> CMS Online
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
