"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';
import { ArrowLeft } from '@phosphor-icons/react';

const DISTRICTS = [
  'Bagerhat','Bandarban','Barguna','Barishal','Bhola','Bogura','Brahmanbaria',
  'Chandpur','Chapai Nawabganj','Chattogram','Chuadanga',"Cox's Bazar",'Cumilla',
  'Dhaka','Dinajpur','Faridpur','Feni','Gaibandha','Gazipur','Gopalganj',
  'Habiganj','Jamalpur','Jashore','Jhalokati','Jhenaidah','Joypurhat',
  'Khagrachhari','Khulna','Kishoreganj','Kurigram','Kushtia','Lakshmipur',
  'Lalmonirhat','Madaripur','Magura','Manikganj','Meherpur','Moulvibazar',
  'Munshiganj','Mymensingh','Naogaon','Narail','Narayanganj','Narsingdi',
  'Natore','Netrokona','Nilphamari','Noakhali','Pabna','Panchagarh',
  'Patuakhali','Pirojpur','Rajbari','Rajshahi','Rangamati','Rangpur',
  'Satkhira','Shariatpur','Sherpur','Sirajganj','Sunamganj','Sylhet',
  'Tangail','Thakurgaon',
];

const inputCls = "w-full border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm text-[#2c1a0e] outline-none focus:border-[#8B0000] transition-colors bg-white placeholder:text-[#c4a07a]";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2c1a0e] mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function NewRatePlanPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [rates, setRates] = useState<Record<string, string>>({});

  function setRate(district: string, value: string) {
    setRates(prev => ({ ...prev, [district]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const rateEntries = Object.entries(rates)
      .filter(([, v]) => v !== '' && !isNaN(parseFloat(v)) && parseFloat(v) > 0)
      .map(([district, v]) => ({ district, costPerUnit: parseFloat(v) }));

    if (rateEntries.length === 0) {
      setError('Add at least one district rate.');
      return;
    }

    setSaving(true);
    try {
      await adminApi.post('/rate-plans', { name, description: description || undefined, isActive, rates: rateEntries });
      router.push('/admin/delivery');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create rate plan');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/delivery" className="p-2 text-[#a07850] hover:text-[#8B0000] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">New Rate Plan</h1>
          <p className="text-[#a07850] text-sm mt-0.5">Set delivery cost per district</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-5">
          <Field label="Plan Name" required>
            <input value={name} onChange={e => setName(e.target.value)} required className={inputCls} placeholder="e.g. Standard, Express, Heavy Items" />
          </Field>
          <Field label="Description">
            <input value={description} onChange={e => setDescription(e.target.value)} className={inputCls} placeholder="Optional note about this plan" />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#8B0000]" />
            <span className="text-sm font-medium text-[#2c1a0e]">Active</span>
          </label>
        </div>

        <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-[#2c1a0e]">District Rates</h2>
            <p className="text-xs text-[#a07850] mt-0.5">Cost per unit (৳). Leave blank = no delivery to that district.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 max-h-[420px] overflow-y-auto pr-1">
            {DISTRICTS.map(district => (
              <div key={district} className="flex items-center gap-2">
                <span className="text-sm text-[#2c1a0e] w-36 shrink-0 truncate" title={district}>{district}</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#a07850]">৳</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rates[district] ?? ''}
                    onChange={e => setRate(district, e.target.value)}
                    placeholder="—"
                    className="w-full border border-[#e8d5c4] rounded-lg pl-6 pr-2 py-1.5 text-sm text-[#2c1a0e] outline-none focus:border-[#8B0000] transition-colors bg-white placeholder:text-[#e8d5c4]"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#a07850]">
            {Object.values(rates).filter(v => v !== '' && parseFloat(v) > 0).length} districts configured
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-60">
            {saving ? 'Creating…' : 'Create Rate Plan'}
          </button>
          <Link href="/admin/delivery" className="px-6 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
