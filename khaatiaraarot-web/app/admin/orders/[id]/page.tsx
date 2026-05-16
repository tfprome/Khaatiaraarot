"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { ArrowLeft, Package } from '@phosphor-icons/react';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: string | number;
  total: string | number;
}

interface StatusHistory {
  status: string;
  note?: string;
  createdAt: string;
  changedBy?: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  total: string | number;
  subtotal?: string | number;
  status: string;
  paymentMethod: string;
  source: string;
  notes?: string;
  createdAt: string;
  user?: { fullName: string; email: string; phone?: string };
  customerName?: string;
  address?: {
    fullName: string; phone: string; line1: string; line2?: string;
    city: string; district: string; postalCode?: string;
  };
  items: OrderItem[];
  statusHistory?: StatusHistory[];
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  refunded: 'bg-gray-100 text-gray-600',
};

const NEXT_STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

function fmt(v: string | number) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return '৳' + (isNaN(n) ? '0' : n.toFixed(2));
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString('en-BD', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [statusSuccess, setStatusSuccess] = useState('');

  async function load() {
    adminApi.get<{ data: OrderDetail }>(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(e => setError(e.message));
  }

  useEffect(() => { load(); }, [id]);

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!statusUpdate) return;
    setStatusError(''); setStatusSuccess('');
    setUpdating(true);
    try {
      await adminApi.put(`/orders/${id}/status`, { status: statusUpdate, note: statusNote || undefined });
      setStatusSuccess('Status updated.');
      setStatusUpdate('');
      setStatusNote('');
      load();
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  async function handleInvoice() {
    try {
      await adminApi.post(`/orders/${id}/invoice`, {});
      alert('Invoice generation queued. Customer will receive email shortly.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to queue invoice');
    }
  }

  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!order) return <p className="text-[#a07850] text-sm">Loading…</p>;

  const name = order.customerName ?? order.user?.fullName ?? '—';

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 text-[#a07850] hover:text-[#8B0000] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#2c1a0e]">Order #{order.orderNumber}</h1>
            <p className="text-[#a07850] text-sm mt-0.5">{fmtDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {order.status}
          </span>
          <button
            onClick={handleInvoice}
            className="px-4 py-2 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] transition-colors flex items-center gap-2"
          >
            <Package size={15} />
            Send Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer */}
        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-5">
          <h2 className="font-semibold text-[#2c1a0e] mb-3">Customer</h2>
          <p className="text-sm font-medium text-[#2c1a0e]">{name}</p>
          {order.user?.email && <p className="text-sm text-[#a07850]">{order.user.email}</p>}
          {(order.user?.phone || order.address?.phone) && (
            <p className="text-sm text-[#a07850]">{order.user?.phone ?? order.address?.phone}</p>
          )}
          <div className="mt-3 pt-3 border-t border-[#e8d5c4]">
            <p className="text-xs text-[#a07850] font-medium mb-1">Source / Payment</p>
            <p className="text-sm text-[#2c1a0e] capitalize">{order.source} · {order.paymentMethod}</p>
          </div>
        </div>

        {/* Delivery Address */}
        {order.address && (
          <div className="bg-white border border-[#e8d5c4] rounded-2xl p-5">
            <h2 className="font-semibold text-[#2c1a0e] mb-3">Delivery Address</h2>
            <p className="text-sm font-medium text-[#2c1a0e]">{order.address.fullName}</p>
            <p className="text-sm text-[#a07850]">{order.address.phone}</p>
            <p className="text-sm text-[#a07850] mt-1">
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}
            </p>
            <p className="text-sm text-[#a07850]">
              {order.address.city}, {order.address.district}
              {order.address.postalCode ? ` ${order.address.postalCode}` : ''}
            </p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white border border-[#e8d5c4] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e8d5c4]">
          <h2 className="font-semibold text-[#2c1a0e]">Items</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8d5c4] bg-[#fdf5ee]">
              <th className="text-left px-5 py-3 font-semibold text-[#2c1a0e]">Product</th>
              <th className="text-right px-5 py-3 font-semibold text-[#2c1a0e]">Qty</th>
              <th className="text-right px-5 py-3 font-semibold text-[#2c1a0e]">Unit Price</th>
              <th className="text-right px-5 py-3 font-semibold text-[#2c1a0e]">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} className="border-b border-[#e8d5c4] last:border-0">
                <td className="px-5 py-3 text-[#2c1a0e]">{item.productName}</td>
                <td className="px-5 py-3 text-right text-[#a07850]">{item.quantity}</td>
                <td className="px-5 py-3 text-right text-[#a07850]">{fmt(item.unitPrice)}</td>
                <td className="px-5 py-3 text-right font-semibold text-[#8B0000]">{fmt(item.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-[#e8d5c4] bg-[#fdf5ee]">
              <td colSpan={3} className="px-5 py-3 text-right font-semibold text-[#2c1a0e]">Total</td>
              <td className="px-5 py-3 text-right font-bold text-[#8B0000] text-base">{fmt(order.total)}</td>
            </tr>
          </tfoot>
        </table>
        {order.notes && (
          <div className="px-5 py-4 border-t border-[#e8d5c4]">
            <p className="text-xs text-[#a07850] font-medium mb-1">Notes</p>
            <p className="text-sm text-[#2c1a0e]">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Status Update */}
      <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
        <h2 className="font-semibold text-[#2c1a0e] mb-4">Update Status</h2>
        <form onSubmit={handleStatusUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2c1a0e] mb-1.5">New Status</label>
              <select
                value={statusUpdate}
                onChange={e => setStatusUpdate(e.target.value)}
                required
                className="w-full border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm text-[#2c1a0e] outline-none focus:border-[#8B0000] transition-colors bg-white"
              >
                <option value="">— Select status —</option>
                {NEXT_STATUSES.map(s => (
                  <option key={s} value={s} disabled={s === order.status}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c1a0e] mb-1.5">Note (optional)</label>
              <input
                type="text"
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                placeholder="e.g. Dispatched via courier"
                className="w-full border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm text-[#2c1a0e] outline-none focus:border-[#8B0000] transition-colors bg-white placeholder:text-[#c4a07a]"
              />
            </div>
          </div>
          {statusError && <p className="text-sm text-red-500">{statusError}</p>}
          {statusSuccess && <p className="text-sm text-green-600">{statusSuccess}</p>}
          <button
            type="submit"
            disabled={updating || !statusUpdate}
            className="bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-60"
          >
            {updating ? 'Updating…' : 'Update Status'}
          </button>
        </form>
      </div>

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
          <h2 className="font-semibold text-[#2c1a0e] mb-4">Status History</h2>
          <div className="space-y-3">
            {order.statusHistory.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize shrink-0 ${STATUS_COLOR[h.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {h.status}
                </span>
                <div className="flex-1 min-w-0">
                  {h.note && <p className="text-sm text-[#2c1a0e]">{h.note}</p>}
                  <p className="text-xs text-[#a07850]">{fmtDate(h.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
