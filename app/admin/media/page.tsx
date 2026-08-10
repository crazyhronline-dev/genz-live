import type { Metadata } from 'next';
import { Upload } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Media Library — GenZ Live CMS',
};

export default async function AdminMediaPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const mediaItems = [
    { id: 'med-1', filename: '01_YouTube_Banner_2560x1440.png', url: '/brand/01_YouTube_Banner_2560x1440.png', size: '1.2 MB', type: 'PNG' },
    { id: 'med-2', filename: '06_Website_Logo_1200x400.png', url: '/brand/06_Website_Logo_1200x400.png', size: '420 KB', type: 'PNG' },
    { id: 'med-3', filename: 'MASTER_SQUARE_2000x2000.png', url: '/brand/MASTER_SQUARE_2000x2000.png', size: '2.8 MB', type: 'PNG' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Media Library</h1>
          <p className="text-xs text-slate-400">Validated image assets and newsroom media uploads</p>
        </div>
        <button disabled className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 opacity-75 cursor-not-allowed">
          <Upload className="w-4 h-4" /> Upload Asset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mediaItems.map(item => (
          <div key={item.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 group">
            <div className="h-40 bg-slate-900 overflow-hidden relative flex items-center justify-center p-4">
              <img src={item.url} alt={item.filename} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-4 space-y-1 text-xs">
              <p className="font-bold text-white truncate">{item.filename}</p>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>{item.type}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
