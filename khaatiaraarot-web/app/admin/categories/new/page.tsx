"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

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

export default function NewCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', nameBn: '', slug: '', sortOrder: '0', isActive: true,
  });

  function set(k: keyof typeof form, v: string | boolean) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function handleNameChange(name: string) {
    setForm(prev => ({ ...prev, name, slug: toSlug(name) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await adminApi.post('/categories', {
        name: form.name,
        nameBn: form.nameBn || undefined,
        slug: form.slug,
        sortOrder: parseInt(form.sortOrder),
        isActive: form.isActive,
      });
      router.push('/admin/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/categories" className="p-2 text-[#a07850] hover:text-[#8B0000] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Add Category</h1>
          <p className="text-[#a07850] text-sm mt-0.5">Create a new product category</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-5">
        <Field label="Name (English)" required>
          <input value={form.name} onChange={e => handleNameChange(e.target.value)} required className={inputCls} placeholder="e.g. Fish" />
        </Field>
        <Field label="Name (Bengali)">
          <input value={form.nameBn} onChange={e => set('nameBn', e.target.value)} className={inputCls} placeholder="e.g. মাছ" />
        </Field>
        <Field label="Slug" required>
          <input value={form.slug} onChange={e => set('slug', e.target.value)} required pattern="[a-z0-9-]+" className={inputCls} placeholder="auto-generated" />
        </Field>
        <Field label="Sort Order">
          <input type="number" min="0" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-[#8B0000]" />
          <span className="text-sm font-medium text-[#2c1a0e]">Active</span>
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-60">
            {saving ? 'Creating…' : 'Create Category'}
          </button>
          <Link href="/admin/categories" className="px-6 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
