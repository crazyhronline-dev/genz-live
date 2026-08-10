import type { Metadata } from 'next';
import { UserPlus } from 'lucide-react';
import { getCmsUsers } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'User Management — GenZ Live CMS',
};

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  // Enforce ADMIN role permission server-side
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const usersList = await getCmsUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">User Administration</h1>
          <p className="text-xs text-slate-400">Manage newsroom staff accounts and role permissions (ADMIN only)</p>
        </div>
        <button disabled className="btn-primary text-xs py-2 px-3 inline-flex items-center gap-1 opacity-75 cursor-not-allowed">
          <UserPlus className="w-3.5 h-3.5" /> Add Staff Account
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-4">Name & Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Last Login</th>
              <th className="p-4">Account Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {usersList.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-white">
                  <p>{u.name}</p>
                  <span className="text-[11px] text-slate-400 font-mono font-normal">{u.email}</span>
                </td>
                <td className="p-4">
                  <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-purple-500/30">
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-slate-400">{u.lastLoginAt}</td>
                <td className="p-4">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/30">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
