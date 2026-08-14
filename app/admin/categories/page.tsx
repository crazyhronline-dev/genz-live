import type { Metadata } from 'next';
import { getCmsCategories } from '@/lib/cmsData';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CategoryManagerClient from '@/components/admin/CategoryManagerClient';

export const metadata: Metadata = {
  title: 'Categories — GenZ Live CMS',
};

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role === 'AUTHOR') {
    redirect('/admin/articles');
  }

  const { error } = await searchParams;
  const categories = await getCmsCategories();

  return <CategoryManagerClient categories={categories} error={error} />;
}

