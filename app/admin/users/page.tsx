import type { Metadata } from 'next';
import { UserPlus, Trash2 } from 'lucide-react';
import { getCmsUsers } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createUserAction, deleteUserAction } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'User Management — GenZ Live CMS',
};

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ error?: string; created?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  // Enforce ADMIN role permission server-side
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const { error, created } = await searchParams;
  const usersList = await getCmsUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">User Administration</h1>
        <p className="text-xs text-slate-400">Manage newsroom staff accounts and role permissions (ADMIN only)</p>
      </div>

      {created && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          Staff account created successfully! The user can now log in.
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Name & Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Action</th>
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
                    <td className="p-4 text-right">
                      {u.email !== user.email && (
                        <form action={deleteUserAction.bind(null, u.id)}>
                          <button type="submit" className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">Add Staff Account</h3>
            <form action={createUserAction} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Full Name</label>
                <input name="name" required placeholder="Name" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Email Address</label>
                <input name="email" type="email" required placeholder="email@genz-live.com" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Password</label>
                <input name="password" type="password" required placeholder="Password" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Role</label>
                <select name="role" className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="EDITOR">EDITOR</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="AUTHOR">AUTHOR / WRITER</option>
                </select>
              </div>
              <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold shadow-glow-purple">
                <UserPlus className="w-4 h-4 inline mr-1" /> Create Staff User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

