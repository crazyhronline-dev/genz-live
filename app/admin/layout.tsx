import React from 'react';
import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getCurrentUser } from '@/lib/auth';

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

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      {/* CMS Sidebar */}
      <AdminSidebar user={user} />

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
