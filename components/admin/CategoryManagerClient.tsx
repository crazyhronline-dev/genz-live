'use client';

// ================================================================
// GenZ Live — Category Manager Client Component
// Provides interactive category listing, creation, and modal editing.
// ================================================================

import React, { useState } from 'react';
import { FolderTree, Plus, Check, Trash2, Edit3, X, Save, ShieldAlert } from 'lucide-react';
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from '@/app/admin/actions';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  articleCount: number;
}

interface CategoryManagerClientProps {
  categories: CategoryItem[];
  error?: string;
}

export default function CategoryManagerClient({ categories, error }: CategoryManagerClientProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-violet-400" /> Newsroom Category Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage primary editorial categories, URL slugs, and publication taxonomies for GenZ Live
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Table */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Categories ({categories.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Category Name</th>
                    <th className="p-4">URL Slug</th>
                    <th className="p-4">Articles</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <FolderTree className="w-4 h-4 text-violet-400 shrink-0" />
                          <div>
                            <span className="block font-bold">{cat.name}</span>
                            {cat.description && (
                              <span className="block text-[11px] text-slate-400 font-normal truncate max-w-xs">{cat.description}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-cyan-400 font-semibold">/{cat.slug}</td>
                      <td className="p-4 font-mono font-bold text-violet-300">{cat.articleCount}</td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => setEditingCategory(cat)}
                            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-violet-600/30 transition-colors border border-slate-700/60"
                            title="Edit Category"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button / Form */}
                          <form action={deleteCategoryAction.bind(null, cat.id)}>
                            <button
                              type="submit"
                              onClick={(e) => {
                                if (deleteConfirmId !== cat.id) {
                                  e.preventDefault();
                                  setDeleteConfirmId(cat.id);
                                  setTimeout(() => setDeleteConfirmId(null), 3000);
                                }
                              }}
                              className={`p-2 rounded-lg transition-colors border ${
                                deleteConfirmId === cat.id
                                  ? 'bg-rose-600 text-white border-rose-500 text-[10px] font-bold px-2'
                                  : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border-slate-700/60'
                              }`}
                              title="Delete Category"
                            >
                              {deleteConfirmId === cat.id ? 'Confirm?' : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add New Category Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Plus className="w-4 h-4 text-violet-400" /> Add New Category
            </h3>
            <form action={createCategoryAction} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Category Name <span className="text-rose-400">*</span></label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Science & Space"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">URL Slug (Optional)</label>
                <input
                  name="slug"
                  placeholder="science (auto-generated if empty)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-mono placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Description (Optional)</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Brief description for SEO & category header..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-2.5 text-xs font-bold shadow-glow-purple flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Category Modal Dialog */}
      {editingCategory && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-violet-400" /> Edit Category: {editingCategory.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-white font-bold text-lg px-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={updateCategoryAction} className="space-y-4">
              <input type="hidden" name="id" value={editingCategory.id} />

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Category Name <span className="text-rose-400">*</span></label>
                <input
                  name="name"
                  required
                  defaultValue={editingCategory.name}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">URL Slug <span className="text-rose-400">*</span></label>
                <input
                  name="slug"
                  required
                  defaultValue={editingCategory.slug}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingCategory.description || ''}
                  placeholder="Category description..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-violet-600/20"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
