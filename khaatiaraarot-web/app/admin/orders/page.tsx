"use client";
import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { MagnifyingGlass, Eye } from '@phosphor-icons/react';
import { Orderdetails } from '@/Types/orderTypes';

interface Meta { total: number; page: number; limit: number; pages: number; }

const STATUSES = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  refunded: 'bg-gray-100 text-gray-600',
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmt(v: string | number) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return '৳' + (isNaN(n) ? '0' : n.toFixed(2));
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Orderdetails[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20, pages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p = page, q = search, s = status) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (q) params.set('q', q);
      if (s) params.set('status', s);
      const res = await adminApi.get<{ data: Orderdetails[]; meta: Meta }>(`/orders?${params}`);
      setOrders(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { load(); }, [page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(1, search, status);
  }

  function handleStatusChange(s: string) {
    setStatus(s);
    setPage(1);
    load(1, search, s);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2c1a0e]">Orders</h1>
        <p className="text-[#a07850] text-sm mt-1">{meta.total} total orders</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-3 flex-1 min-w-64">
          <div className="flex items-center border border-[#e8d5c4] rounded-xl px-3 gap-2 bg-white flex-1 focus-within:border-[#8B0000] transition-colors">
            <MagnifyingGlass size={16} className="text-[#a07850]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search order # or customer…"
              className="flex-1 py-2.5 text-sm outline-none bg-transparent text-[#2c1a0e] placeholder:text-[#c4a07a]"
            />
          </div>
          <button type="submit" className="bg-[#2c1a0e] hover:bg-[#5B1A18] text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
            Search
          </button>
        </form>
        <select
          value={status}
          onChange={e => handleStatusChange(e.target.value)}
          className="border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm text-[#2c1a0e] bg-white outline-none focus:border-[#8B0000] transition-colors"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-[#e8d5c4] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8d5c4] bg-[#fdf5ee]">
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Order #</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Customer</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Payment</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-[#a07850]">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-[#a07850]">No orders found</td></tr>
            ) : orders.map(o => (
              <tr key={o.id} className="border-b border-[#e8d5c4] last:border-0 hover:bg-[#fdf5ee] transition-colors">
                <td className="px-4 py-3 font-medium text-[#2c1a0e]">#{o.orderNumber}</td>
                <td className="px-4 py-3 text-[#a07850]">{o.shippingAddressSnapshot.fullName}</td>
                <td className="px-4 py-3 font-semibold text-[#8B0000]">{fmt(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLOR[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#a07850] capitalize">{o.paymentMethod}</td>
                <td className="px-4 py-3 text-[#a07850]">{fmtDate(o.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="p-1.5 text-[#a07850] hover:text-[#8B0000] transition-colors inline-flex">
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}
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
