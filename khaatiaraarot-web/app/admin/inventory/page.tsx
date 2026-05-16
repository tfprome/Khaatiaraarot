"use client";
import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Warning } from '@phosphor-icons/react';

interface InventoryItem {
  id: string;
  name: string;
  slug: string;
  stockQty: number;
  lowStockThreshold: number;
  category?: { name: string };
}

interface Meta { total: number; page: number; limit: number; pages: number; }

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20, pages: 1 });
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stockEdit, setStockEdit] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async (p = page, low = lowStockOnly) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (low) params.set('lowStockOnly', 'true');
      const res = await adminApi.get<{ data: InventoryItem[]; meta: Meta }>(`/inventory?${params}`);
      setItems(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  }, [page, lowStockOnly]);

  useEffect(() => { load(); }, [page]);

  function toggleLowStock() {
    const next = !lowStockOnly;
    setLowStockOnly(next);
    setPage(1);
    load(1, next);
  }

  async function saveStock(id: string) {
    const val = parseInt(stockEdit[id] ?? '');
    if (isNaN(val) || val < 0) return;
    setSaving(id);
    try {
      await adminApi.put(`/products/${id}/stock`, { stockQty: val });
      setStockEdit(prev => { const n = { ...prev }; delete n[id]; return n; });
      load();
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Inventory</h1>
          <p className="text-[#a07850] text-sm mt-1">{meta.total} products</p>
        </div>
        <button
          onClick={toggleLowStock}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            lowStockOnly
              ? 'bg-orange-600 text-white border-orange-600'
              : 'border-[#e8d5c4] text-[#2c1a0e] hover:bg-[#fdf5ee]'
          }`}
        >
          <Warning size={15} />
          {lowStockOnly ? 'Showing Low Stock Only' : 'Show Low Stock Only'}
        </button>
      </div>

      <div className="bg-white border border-[#e8d5c4] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8d5c4] bg-[#fdf5ee]">
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Product</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Stock</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Threshold</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Status</th>
              <th className="px-4 py-3 font-semibold text-[#2c1a0e]">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-[#a07850]">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-[#a07850]">No products found</td></tr>
            ) : items.map(item => {
              const isLow = item.stockQty <= item.lowStockThreshold;
              return (
                <tr key={item.id} className="border-b border-[#e8d5c4] last:border-0 hover:bg-[#fdf5ee] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#2c1a0e]">{item.name}</td>
                  <td className="px-4 py-3 text-[#a07850]">{item.category?.name ?? '—'}</td>
                  <td className={`px-4 py-3 font-bold ${isLow ? 'text-orange-600' : 'text-[#2c1a0e]'}`}>
                    {item.stockQty}
                  </td>
                  <td className="px-4 py-3 text-[#a07850]">{item.lowStockThreshold}</td>
                  <td className="px-4 py-3">
                    {isLow ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        <Warning size={11} /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={stockEdit[item.id] ?? ''}
                        onChange={e => setStockEdit(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder={String(item.stockQty)}
                        className="w-20 border border-[#e8d5c4] rounded-lg px-2 py-1 text-sm text-[#2c1a0e] outline-none focus:border-[#8B0000] transition-colors"
                      />
                      <button
                        onClick={() => saveStock(item.id)}
                        disabled={!stockEdit[item.id] || saving === item.id}
                        className="px-3 py-1 bg-[#8B0000] hover:bg-[#6e0000] text-white rounded-lg text-xs font-medium disabled:opacity-40 transition-colors"
                      >
                        {saving === item.id ? '…' : 'Save'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {meta.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-4 py-2 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] disabled:opacity-40 transition-colors">Prev</button>
          <span className="text-sm text-[#a07850]">Page {page} of {meta.pages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === meta.pages} className="px-4 py-2 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] disabled:opacity-40 transition-colors">Next</button>
        </div>
      )}
    </div>
  );
}
