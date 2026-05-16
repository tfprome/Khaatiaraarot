"use client";
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';

interface Category {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  imageUrl?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.get<{ data: Category[] }>('/categories');
      setCategories(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deactivate "${name}"?`)) return;
    await adminApi.del(`/categories/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Categories</h1>
          <p className="text-[#a07850] text-sm mt-1">{categories.length} total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors"
        >
          <Plus size={15} weight="bold" />
          Add Category
        </Link>
      </div>

      <div className="bg-white border border-[#e8d5c4] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8d5c4] bg-[#fdf5ee]">
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Bengali Name</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Order</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-[#a07850]">Loading…</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-[#a07850]">No categories found</td></tr>
            ) : categories.map(c => (
              <tr key={c.id} className="border-b border-[#e8d5c4] last:border-0 hover:bg-[#fdf5ee] transition-colors">
                <td className="px-4 py-3 font-medium text-[#2c1a0e]">{c.name}</td>
                <td className="px-4 py-3 text-[#a07850]">{c.nameBn ?? '—'}</td>
                <td className="px-4 py-3 text-[#a07850] font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3 text-[#2c1a0e]">{c.sortOrder}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/admin/categories/${c.id}`} className="p-1.5 text-[#a07850] hover:text-[#8B0000] transition-colors">
                      <PencilSimple size={16} />
                    </Link>
                    <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 text-[#a07850] hover:text-red-600 transition-colors">
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
