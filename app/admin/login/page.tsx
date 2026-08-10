import type { Metadata } from 'next';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { loginAction } from '@/app/admin/actions';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Login — GenZ Live CMS',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (user) {
    redirect('/admin');
  }

  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-navy-main text-slate-100 flex items-center justify-center p-4 selection:bg-purple-600 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Editorial Newsroom CMS</h1>
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" /> Authorized Editorial Staff Access Only
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@genz-live.com"
                  defaultValue="admin@genz-live.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-glow-purple group transition-all"
            >
              Sign In to CMS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-500 font-mono">
          GenZ Live CMS v4.0 · Node.js VPS Infrastructure
        </p>
      </div>
    </div>
  );
}
