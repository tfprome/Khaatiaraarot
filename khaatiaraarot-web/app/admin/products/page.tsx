"use client";
import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { Plus, MagnifyingGlass, PencilSimple, Trash } from '@phosphor-icons/react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  stockQty: number;
  isActive: boolean;
  category?: { name: string };
}

interface Meta { total: number; page: number; limit: number; pages: number; }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20, pages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p = page, q = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (q) params.set('q', q);
      const res = await adminApi.get<{ data: Product[]; meta: Meta }>(`/products?${params}`);
      setProducts(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(1, search);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deactivate "${name}"?`)) return;
    await adminApi.del(`/products/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Products</h1>
          <p className="text-[#a07850] text-sm mt-1">{meta.total} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors"
        >
          <Plus size={15} weight="bold" />
          Add Product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex items-center border border-[#e8d5c4] rounded-xl px-3 gap-2 bg-white flex-1 focus-within:border-[#8B0000] transition-colors">
          <MagnifyingGlass size={16} className="text-[#a07850]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="flex-1 py-2.5 text-sm outline-none bg-transparent text-[#2c1a0e] placeholder:text-[#c4a07a]"
          />
        </div>
        <button
          type="submit"
          className="bg-[#2c1a0e] hover:bg-[#5B1A18] text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
        >
          Search
        </button>
      </form>

      <div className="bg-white border border-[#e8d5c4] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8d5c4] bg-[#fdf5ee]">
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Price</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Stock</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-[#a07850]">Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-[#a07850]">No products found</td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="border-b border-[#e8d5c4] last:border-0 hover:bg-[#fdf5ee] transition-colors">
                <td className="px-4 py-3 font-medium text-[#2c1a0e]">{p.name}</td>
                <td className="px-4 py-3 text-[#a07850]">{p.category?.name ?? '—'}</td>
                <td className="px-4 py-3 font-semibold text-[#8B0000]">
                  ৳{typeof p.price === 'string' ? parseFloat(p.price).toFixed(2) : p.price}
                </td>
                <td className="px-4 py-3 text-[#2c1a0e]">{p.stockQty}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="p-1.5 text-[#a07850] hover:text-[#8B0000] transition-colors"
                    >
                      <PencilSimple size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-[#a07850] hover:text-red-600 transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] disabled:opacity-40 transition-colors"
          >
            Prev
          </button>
          <span className="text-sm text-[#a07850]">Page {page} of {meta.pages}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === meta.pages}
            className="px-4 py-2 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
