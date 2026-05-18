"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';

interface RatePlanDistrict { id: string; district: string; costPerUnit: string; }
interface RatePlan { id: string; name: string; description?: string; isActive: boolean; rates: RatePlanDistrict[]; }

export default function DeliveryPage() {
  const [plans, setPlans] = useState<RatePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.get<{ data: RatePlan[] }>('/rate-plans')
      .then(r => setPlans(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete rate plan "${name}"? Products using it will have no delivery rate.`)) return;
    setDeleting(id);
    try {
      await adminApi.del(`/rate-plans/${id}`);
      setPlans(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Delivery Rate Plans</h1>
          <p className="text-[#a07850] text-sm mt-0.5">Manage district-based delivery pricing</p>
        </div>
        <Link
          href="/admin/delivery/new"
          className="inline-flex items-center gap-2 bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors"
        >
          <Plus size={16} weight="bold" />
          New Rate Plan
        </Link>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading ? (
        <p className="text-[#a07850] text-sm">Loading…</p>
      ) : plans.length === 0 ? (
        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-10 text-center">
          <p className="text-[#a07850]">No rate plans yet.</p>
          <Link href="/admin/delivery/new" className="text-[#8B0000] text-sm font-medium mt-2 inline-block">Create one →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white border border-[#e8d5c4] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-[#2c1a0e]">{plan.name}</h2>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {plan.description && <p className="text-sm text-[#a07850] mt-0.5">{plan.description}</p>}
                  <p className="text-xs text-[#c4a07a] mt-1">{plan.rates.length} district{plan.rates.length !== 1 ? 's' : ''} covered</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/delivery/${plan.id}`}
                    className="p-2 text-[#a07850] hover:text-[#8B0000] transition-colors rounded-lg hover:bg-[#fdf5ee]"
                  >
                    <PencilSimple size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(plan.id, plan.name)}
                    disabled={deleting === plan.id}
                    className="p-2 text-[#a07850] hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              {plan.rates.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.rates.slice(0, 8).map(r => (
                    <span key={r.id} className="text-xs bg-[#fdf5ee] border border-[#e8d5c4] rounded-lg px-2 py-1 text-[#2c1a0e]">
                      {r.district}: <span className="font-semibold">৳{Number(r.costPerUnit).toFixed(0)}/unit</span>
                    </span>
                  ))}
                  {plan.rates.length > 8 && (
                    <span className="text-xs text-[#a07850] self-center">+{plan.rates.length - 8} more</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
