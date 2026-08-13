import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCmsCategories, getCmsAuthors, getCmsArticleById } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ArticleEditorForm from '@/components/admin/ArticleEditorForm';

export const metadata: Metadata = {
  title: 'Create / Edit Article — GenZ Live CMS',
};

interface SearchParams {
  searchParams: Promise<{ id?: string; error?: string }>;
}

export default async function AdminNewArticlePage({ searchParams }: SearchParams) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const { id, error } = await searchParams;
  const articleToEdit = id ? await getCmsArticleById(id) : null;

  const [categories, authors] = await Promise.all([
    getCmsCategories(),
    getCmsAuthors(),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link href="/admin/articles" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Articles
        </Link>
        <span className="text-xs text-slate-400 font-mono">Role: {user.role}</span>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold">
          {decodeURIComponent(error)}
        </div>
      )}

      {/* Editor Form (Client Component — holds formRef for live preview) */}
      <ArticleEditorForm
        key={articleToEdit?.id || 'new'}
        categories={categories}
        authors={authors}
        userRole={user.role}
        articleToEdit={articleToEdit}
      />
    </div>
  );
}
