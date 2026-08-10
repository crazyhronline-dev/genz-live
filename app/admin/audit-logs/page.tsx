import type { Metadata } from 'next';
import { getCmsAuditLogs } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Audit Logs — GenZ Live CMS',
};

export default async function AdminAuditLogsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const logs = await getCmsAuditLogs(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">System Audit Logs</h1>
        <p className="text-xs text-slate-400">Immutable security audit record of administrative and editorial actions</p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-4">Timestamp</th>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Entity ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-mono text-slate-400">{log.timestamp}</td>
                <td className="p-4 font-bold text-white">{log.userName} ({log.userEmail})</td>
                <td className="p-4"><span className="text-[10px] font-mono text-brand-purple bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{log.userRole}</span></td>
                <td className="p-4 font-mono font-bold text-brand-cyan">{log.action}</td>
                <td className="p-4">{log.entityType}</td>
                <td className="p-4 font-mono text-slate-500">{log.entityId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
