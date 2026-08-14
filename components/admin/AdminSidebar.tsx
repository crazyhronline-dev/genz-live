'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Bot,
  Inbox,
  Rss,
  Sparkles,
  Cpu,
  UserCog,
  History,
  ShieldCheck,
  BarChart3,
  Globe,
  Newspaper,
  Rocket,
  DollarSign,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { logoutAction } from '@/app/admin/actions';

interface AdminSidebarProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface NavGroup {
  groupName: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    exact?: boolean;
    highlight?: boolean;
    adminOnly?: boolean;
    allowedRoles?: string[];
  }[];
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navGroups: NavGroup[] = [
    {
      groupName: 'CONTENT',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'] },
        { label: 'Create Article', href: '/admin/articles/new', icon: PlusCircle, highlight: true, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'] },
        { label: 'All Articles', href: '/admin/articles', icon: FileText, exact: true, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'] },
        { label: 'Drafts', href: '/admin/articles/drafts', icon: FileEdit, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'] },
        { label: 'Review Queue', href: '/admin/articles/review', icon: Clock, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Fact-Check Queue', href: '/admin/editorial-checks', icon: ShieldCheck, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Scheduled', href: '/admin/articles/scheduled', icon: Clock, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'] },
        { label: 'Published', href: '/admin/articles/published', icon: CheckCircle2, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'] },
        { label: 'Media Library', href: '/admin/media', icon: ImageIcon, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'] },
      ],
    },
    {
      groupName: 'AI NEWSROOM',
      items: [
        { label: 'AI Overview', href: '/admin/ai-newsroom', icon: Bot, exact: true, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Ingestion Inbox', href: '/admin/ai-newsroom/inbox', icon: Inbox, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'AI Feeds & Sources', href: '/admin/ai-newsroom/sources', icon: Rss, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'AI Generated Drafts', href: '/admin/ai-newsroom/drafts', icon: Sparkles, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'AI Rules & Settings', href: '/admin/ai-newsroom/settings', icon: Cpu, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
      ],
    },
    {
      groupName: 'GROWTH & ANALYTICS',
      items: [
        { label: 'AdSense Readiness', href: '/admin/adsense-readiness', icon: DollarSign, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Newsroom Brief', href: '/admin/newsroom', icon: Newspaper, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Audience Growth & Hub', href: '/admin/growth', icon: Rocket, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Analytics Overview', href: '/admin/analytics', icon: BarChart3, exact: true, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Author Analytics', href: '/admin/analytics/authors', icon: Users, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Category Analytics', href: '/admin/analytics/categories', icon: FolderTree, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Technical SEO Health', href: '/admin/seo', icon: Globe, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
      ],
    },
    {
      groupName: 'TAXONOMY & CURATION',
      items: [
        { label: 'Categories', href: '/admin/categories', icon: FolderTree, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Tags', href: '/admin/tags', icon: TagIcon, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Authors', href: '/admin/authors', icon: Users, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'News Sources', href: '/admin/sources', icon: Link2, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Breaking Ticker', href: '/admin/breaking-news', icon: Flame, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
        { label: 'Trending News', href: '/admin/trending', icon: TrendingUp, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
      ],
    },
    {
      groupName: 'SYSTEM & SETTINGS',
      items: [
        { label: 'Logo & Branding', href: '/admin/settings/logo', icon: ImageIcon, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
        { label: 'Site Settings', href: '/admin/settings', icon: Settings, exact: true, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
        { label: 'Staff Users', href: '/admin/users', icon: UserCog, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: History, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
      ],
    },
  ];

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  const navContent = (
    <div className="flex flex-col h-full">
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

      {/* Sidebar Nav Links by Category */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;
            if (item.allowedRoles) return item.allowedRoles.includes(user.role);
            return !item.adminOnly;
          });
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.groupName} className="space-y-1">
              <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-mono">
                {group.groupName}
              </h3>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href, item.exact);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-brand-purple via-purple-600 to-purple-700 text-white shadow-glow-purple border-l-4 border-brand-cyan pl-3 scale-[1.01]'
                        : item.highlight
                        ? 'bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white border border-purple-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-cyan' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-brand-cyan shrink-0" />}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Live Site Footer Link */}
      <div className="p-3 border-t border-white/10 mt-auto">
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
    </div>
  );

  return (
    <>
      {/* Mobile Bar Toggle */}
      <div className="md:hidden bg-navy-surface border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-navy-main/95 backdrop-blur-lg flex flex-col">
          <div className="flex justify-end p-4">
            <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{navContent}</div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-navy-surface border-r border-white/10 flex-col shrink-0 min-h-screen">
        {navContent}
      </aside>
    </>
  );
}
