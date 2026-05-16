"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';

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

export default function NewBannerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    type: 'hero' as 'hero' | 'side' | 'promo',
    title: '', subtitle: '', tagText: '', ctaLabel: '', ctaHref: '',
    sortOrder: '0', isActive: true, startsAt: '', endsAt: '',
  });

  function set(k: keyof typeof form, v: string | boolean) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await adminApi.post('/banners', {
        type: form.type,
        title: form.title || undefined,
        subtitle: form.subtitle || undefined,
        tagText: form.tagText || undefined,
        ctaLabel: form.ctaLabel || undefined,
        ctaHref: form.ctaHref || undefined,
        sortOrder: parseInt(form.sortOrder),
        isActive: form.isActive,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
      });
      router.push('/admin/banners');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/banners" className="p-2 text-[#a07850] hover:text-[#8B0000] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Add Banner</h1>
          <p className="text-[#a07850] text-sm mt-0.5">Create a new banner (upload image after creating)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-5">
        <Field label="Type" required>
          <select value={form.type} onChange={e => set('type', e.target.value as 'hero' | 'side' | 'promo')} className={inputCls}>
            <option value="hero">Hero</option>
            <option value="side">Side</option>
            <option value="promo">Promo</option>
          </select>
        </Field>
        <Field label="Title">
          <input value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} placeholder="Banner headline" />
        </Field>
        <Field label="Subtitle">
          <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} className={inputCls} placeholder="Supporting text" />
        </Field>
        <Field label="Tag Text">
          <input value={form.tagText} onChange={e => set('tagText', e.target.value)} className={inputCls} placeholder="e.g. NEW ARRIVAL" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA Label">
            <input value={form.ctaLabel} onChange={e => set('ctaLabel', e.target.value)} className={inputCls} placeholder="Shop Now" />
          </Field>
          <Field label="CTA Link">
            <input value={form.ctaHref} onChange={e => set('ctaHref', e.target.value)} className={inputCls} placeholder="/shop" />
          </Field>
        </div>
        <Field label="Sort Order">
          <input type="number" min="0" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Active From">
            <input type="datetime-local" value={form.startsAt} onChange={e => set('startsAt', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Active Until">
            <input type="datetime-local" value={form.endsAt} onChange={e => set('endsAt', e.target.value)} className={inputCls} />
          </Field>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-[#8B0000]" />
          <span className="text-sm font-medium text-[#2c1a0e]">Active</span>
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-60">
            {saving ? 'Creating…' : 'Create Banner'}
          </button>
          <Link href="/admin/banners" className="px-6 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
