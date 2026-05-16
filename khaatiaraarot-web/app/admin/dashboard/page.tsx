"use client";
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { CurrencyCircleDollar, ShoppingCart, Warning, Package } from '@phosphor-icons/react';

interface Dashboard {
  revenue: { today: number; thisMonth: number; thisYear: number; allTime: number; };
  orders: { today: number; thisMonth: number; thisYear: number; allTime: number; pending: number; };
  lowStockCount: number;
  statusDistribution: { status: string; count: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    total: string | number;
    status: string;
    createdAt: string;
    customerName?: string;
    user?: { fullName: string };
  }[];
}

function fmt(v: string | number) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return '৳' + (isNaN(n) ? '0' : n.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
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

function StatCard({ label, value, sub, icon: Icon, bg }: {
  label: string; value: string; sub?: string; icon: React.ElementType; bg: string;
}) {
  return (
    <div className="bg-white border border-[#e8d5c4] rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={20} weight="fill" className="text-white" />
      </div>
      <div>
        <p className="text-xs text-[#a07850] font-medium">{label}</p>
        <p className="text-xl font-bold text-[#2c1a0e]">{value}</p>
        {sub && <p className="text-xs text-[#a07850]">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.get<{ success: boolean; data: Dashboard }>('/reports/dashboard')
      .then(r => setData(r.data))
      .catch(e => setError(e.message));
  }, []);

  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!data) return <p className="text-[#a07850] text-sm">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#2c1a0e]">Dashboard</h1>
        <p className="text-[#a07850] text-sm mt-1">Store overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today Revenue" value={fmt(data.revenue.today)} sub={`${data.orders.today} orders`} icon={CurrencyCircleDollar} bg="bg-[#8B0000]" />
        <StatCard label="This Month" value={fmt(data.revenue.thisMonth)} sub={`${data.orders.thisMonth} orders`} icon={ShoppingCart} bg="bg-[#5B1A18]" />
        <StatCard label="This Year" value={fmt(data.revenue.thisYear)} sub={`${data.orders.thisYear} orders`} icon={Package} bg="bg-[#2c1a0e]" />
        <StatCard label="Low Stock" value={String(data.lowStockCount)} sub="Products need restock" icon={Warning} bg="bg-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
          <h2 className="font-semibold text-[#2c1a0e] mb-4">Order Status</h2>
          <div className="space-y-2.5">
            {data.statusDistribution.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLOR[status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {status}
                </span>
                <span className="text-sm font-semibold text-[#2c1a0e]">{count}</span>
              </div>
            ))}
            {data.statusDistribution.length === 0 && (
              <p className="text-sm text-[#a07850]">No orders yet</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#2c1a0e]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#8B0000] hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {data.recentOrders.slice(0, 6).map(order => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-2 py-2 rounded-xl hover:bg-[#fdf5ee] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[#2c1a0e]">#{order.orderNumber}</p>
                  <p className="text-xs text-[#a07850]">{order.customerName ?? order.user?.fullName ?? '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#8B0000]">{fmt(order.total)}</p>
                  <p className="text-xs text-[#a07850] capitalize">{order.status}</p>
                </div>
              </Link>
            ))}
            {data.recentOrders.length === 0 && (
              <p className="text-sm text-[#a07850]">No orders yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
        <h2 className="font-semibold text-[#2c1a0e] mb-1">All-Time Revenue</h2>
        <p className="text-3xl font-bold text-[#8B0000]">{fmt(data.revenue.allTime)}</p>
        <p className="text-sm text-[#a07850] mt-1">{data.orders.allTime} total orders</p>
      </div>
    </div>
  );
}
