"use client";
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';

interface SalesPoint { date: string; orders: number; revenue: number; }
interface SalesReport {
  data: SalesPoint[];
  summary: { totalOrders: number; totalRevenue: number; totalCancelled: number };
}

interface RevenueByMethod { paymentMethod: string; revenue: number; orderCount: number; }
interface RevenueBySource { source: string; revenue: number; orderCount: number; }
interface RevenueSummary {
  byPaymentMethod: RevenueByMethod[];
  bySource: RevenueBySource[];
  summary: { revenue: number; orderCount: number; avgOrderValue: number };
}

interface TopItem { id: string; name: string; revenue: number; orderCount: number; }
interface TopWrapper { data: TopItem[]; }

function fmt(v: string | number) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return '৳' + (isNaN(n) ? '0' : n.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="font-semibold text-[#2c1a0e] mb-4">{title}</h2>;
}

export default function ReportsPage() {
  const [sales, setSales] = useState<SalesReport | null>(null);
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [topProducts, setTopProducts] = useState<TopItem[]>([]);
  const [topCategories, setTopCategories] = useState<TopItem[]>([]);
  const [group, setGroup] = useState<'day' | 'month'>('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminApi.get<{ data: SalesReport }>(`/reports/sales?group=${group}`),
      adminApi.get<{ data: RevenueSummary }>('/reports/revenue'),
      adminApi.get<{ data: TopWrapper }>('/reports/top-products?limit=10'),
      adminApi.get<{ data: TopWrapper }>('/reports/top-categories'),
    ]).then(([s, r, tp, tc]) => {
      setSales(s.data);
      setRevenue(r.data);
      setTopProducts(tp.data.data);
      setTopCategories(tc.data.data);
    }).finally(() => setLoading(false));
  }, [group]);

  if (loading) return <p className="text-[#a07850] text-sm">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#2c1a0e]">Reports</h1>
        <p className="text-[#a07850] text-sm mt-1">Last 30 days</p>
      </div>

      {/* Sales Over Time */}
      <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Sales Over Time" />
          <div className="flex gap-2">
            {(['day', 'month'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                  group === g ? 'bg-[#8B0000] text-white' : 'border border-[#e8d5c4] text-[#2c1a0e] hover:bg-[#fdf5ee]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        {sales && (
          <>
            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-xs text-[#a07850]">Total Revenue</p>
                <p className="text-xl font-bold text-[#8B0000]">{fmt(sales.summary.totalRevenue)}</p>
              </div>
              <div>
                <p className="text-xs text-[#a07850]">Total Orders</p>
                <p className="text-xl font-bold text-[#2c1a0e]">{sales.summary.totalOrders}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8d5c4]">
                    <th className="text-left py-2 text-[#a07850] font-medium">Date</th>
                    <th className="text-right py-2 text-[#a07850] font-medium">Orders</th>
                    <th className="text-right py-2 text-[#a07850] font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.data.slice(0, 15).map((row, i) => (
                    <tr key={i} className="border-b border-[#e8d5c4] last:border-0">
                      <td className="py-2 text-[#2c1a0e]">{row.date}</td>
                      <td className="py-2 text-right text-[#2c1a0e]">{row.orders}</td>
                      <td className="py-2 text-right font-medium text-[#8B0000]">{fmt(row.revenue)}</td>
                    </tr>
                  ))}
                  {(!sales.data || sales.data.length === 0) && (
                    <tr><td colSpan={3} className="py-4 text-center text-[#a07850]">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Payment Method */}
        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
          <SectionHeader title="Revenue by Payment Method" />
          {revenue ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8d5c4]">
                  <th className="text-left py-2 text-[#a07850] font-medium">Method</th>
                  <th className="text-right py-2 text-[#a07850] font-medium">Orders</th>
                  <th className="text-right py-2 text-[#a07850] font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenue.byPaymentMethod.map((row, i) => (
                  <tr key={i} className="border-b border-[#e8d5c4] last:border-0">
                    <td className="py-2 text-[#2c1a0e] capitalize">{row.paymentMethod}</td>
                    <td className="py-2 text-right text-[#2c1a0e]">{row.orderCount}</td>
                    <td className="py-2 text-right font-medium text-[#8B0000]">{fmt(row.revenue)}</td>
                  </tr>
                ))}
                {(!revenue.byPaymentMethod || revenue.byPaymentMethod.length === 0) && (
                  <tr><td colSpan={3} className="py-4 text-center text-[#a07850]">No data</td></tr>
                )}
              </tbody>
            </table>
          ) : <p className="text-sm text-[#a07850]">No data</p>}
        </div>

        {/* Revenue by Source */}
        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
          <SectionHeader title="Revenue by Order Source" />
          {revenue ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8d5c4]">
                  <th className="text-left py-2 text-[#a07850] font-medium">Source</th>
                  <th className="text-right py-2 text-[#a07850] font-medium">Orders</th>
                  <th className="text-right py-2 text-[#a07850] font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenue.bySource.map((row, i) => (
                  <tr key={i} className="border-b border-[#e8d5c4] last:border-0">
                    <td className="py-2 text-[#2c1a0e] capitalize">{row.source}</td>
                    <td className="py-2 text-right text-[#2c1a0e]">{row.orderCount}</td>
                    <td className="py-2 text-right font-medium text-[#8B0000]">{fmt(row.revenue)}</td>
                  </tr>
                ))}
                {(!revenue.bySource || revenue.bySource.length === 0) && (
                  <tr><td colSpan={3} className="py-4 text-center text-[#a07850]">No data</td></tr>
                )}
              </tbody>
            </table>
          ) : <p className="text-sm text-[#a07850]">No data</p>}
        </div>

        {/* Top Products */}
        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
          <SectionHeader title="Top Products by Revenue" />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8d5c4]">
                <th className="text-left py-2 text-[#a07850] font-medium">Product</th>
                <th className="text-right py-2 text-[#a07850] font-medium">Orders</th>
                <th className="text-right py-2 text-[#a07850] font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i} className="border-b border-[#e8d5c4] last:border-0">
                  <td className="py-2 text-[#2c1a0e]">{p.name}</td>
                  <td className="py-2 text-right text-[#2c1a0e]">{p.orderCount}</td>
                  <td className="py-2 text-right font-medium text-[#8B0000]">{fmt(p.revenue)}</td>
                </tr>
              ))}
              {topProducts.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-[#a07850]">No data</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Top Categories */}
        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6">
          <SectionHeader title="Top Categories by Revenue" />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8d5c4]">
                <th className="text-left py-2 text-[#a07850] font-medium">Category</th>
                <th className="text-right py-2 text-[#a07850] font-medium">Orders</th>
                <th className="text-right py-2 text-[#a07850] font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topCategories.map((c, i) => (
                <tr key={i} className="border-b border-[#e8d5c4] last:border-0">
                  <td className="py-2 text-[#2c1a0e]">{c.name}</td>
                  <td className="py-2 text-right text-[#2c1a0e]">{c.orderCount}</td>
                  <td className="py-2 text-right font-medium text-[#8B0000]">{fmt(c.revenue)}</td>
                </tr>
              ))}
              {topCategories.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-[#a07850]">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
