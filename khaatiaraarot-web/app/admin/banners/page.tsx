"use client";
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';

interface Banner {
  id: string;
  type: 'hero' | 'side' | 'promo';
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  startsAt?: string;
  endsAt?: string;
}

function fmtDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.get<{ data: Banner[] }>('/banners');
      setBanners(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title?: string) {
    if (!confirm(`Delete banner "${title ?? id}"? This is permanent.`)) return;
    await adminApi.del(`/banners/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Banners</h1>
          <p className="text-[#a07850] text-sm mt-1">{banners.length} total</p>
        </div>
        <Link
          href="/admin/banners/new"
          className="flex items-center gap-2 bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors"
        >
          <Plus size={15} weight="bold" />
          Add Banner
        </Link>
      </div>

      <div className="bg-white border border-[#e8d5c4] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8d5c4] bg-[#fdf5ee]">
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Order</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Active From</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Active Until</th>
              <th className="text-left px-4 py-3 font-semibold text-[#2c1a0e]">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-[#a07850]">Loading…</td></tr>
            ) : banners.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-[#a07850]">No banners found</td></tr>
            ) : banners.map(b => (
              <tr key={b.id} className="border-b border-[#e8d5c4] last:border-0 hover:bg-[#fdf5ee] transition-colors">
                <td className="px-4 py-3 font-medium text-[#2c1a0e]">{b.title ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fdf5ee] text-[#8B0000] capitalize">
                    {b.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#2c1a0e]">{b.sortOrder}</td>
                <td className="px-4 py-3 text-[#a07850]">{fmtDate(b.startsAt)}</td>
                <td className="px-4 py-3 text-[#a07850]">{fmtDate(b.endsAt)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    b.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {b.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/admin/banners/${b.id}`} className="p-1.5 text-[#a07850] hover:text-[#8B0000] transition-colors">
                      <PencilSimple size={16} />
                    </Link>
                    <button onClick={() => handleDelete(b.id, b.title)} className="p-1.5 text-[#a07850] hover:text-red-600 transition-colors">
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
