"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';

interface Category { id: string; name: string; }

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

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

const inputCls = "w-full border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm text-[#2c1a0e] outline-none focus:border-[#8B0000] transition-colors bg-white placeholder:text-[#c4a07a]";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    unit: '',
    sourceRegion: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    stockQty: '0',
    lowStockThreshold: '5',
    isBestSelling: false,
    isActive: true,
  });

  useEffect(() => {
    adminApi.get<{ data: Category[] }>('/categories').then(r => setCategories(r.data));
  }, []);

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
      await adminApi.post('/products', {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        unit: form.unit,
        sourceRegion: form.sourceRegion || undefined,
        categoryId: form.categoryId || undefined,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stockQty: parseInt(form.stockQty),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        isBestSelling: form.isBestSelling,
        isActive: form.isActive,
      });
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 text-[#a07850] hover:text-[#8B0000] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Add Product</h1>
          <p className="text-[#a07850] text-sm mt-0.5">Create a new product listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-5">
        <Field label="Name" required>
          <input value={form.name} onChange={e => handleNameChange(e.target.value)} required className={inputCls} placeholder="e.g. Premium Hilsa Fish" />
        </Field>
        <Field label="Slug" required>
          <input value={form.slug} onChange={e => set('slug', e.target.value)} required pattern="[a-z0-9-]+" className={inputCls} placeholder="auto-generated from name" />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={inputCls + ' resize-none'} placeholder="Product description…" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Unit" required>
            <input value={form.unit} onChange={e => set('unit', e.target.value)} required className={inputCls} placeholder="kg, piece, dozen…" />
          </Field>
          <Field label="Source Region">
            <input value={form.sourceRegion} onChange={e => set('sourceRegion', e.target.value)} className={inputCls} placeholder="e.g. Padma River" />
          </Field>
        </div>
        <Field label="Category">
          <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className={inputCls}>
            <option value="">— Select category —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (৳)" required>
            <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required className={inputCls} placeholder="0.00" />
          </Field>
          <Field label="Original Price (৳)">
            <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} className={inputCls} placeholder="0.00" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Stock Qty">
            <input type="number" min="0" value={form.stockQty} onChange={e => set('stockQty', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Low Stock Threshold">
            <input type="number" min="0" value={form.lowStockThreshold} onChange={e => set('lowStockThreshold', e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isBestSelling} onChange={e => set('isBestSelling', e.target.checked)} className="w-4 h-4 accent-[#8B0000]" />
            <span className="text-sm font-medium text-[#2c1a0e]">Best Selling</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-[#8B0000]" />
            <span className="text-sm font-medium text-[#2c1a0e]">Active</span>
          </label>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-60">
            {saving ? 'Creating…' : 'Create Product'}
          </button>
          <Link href="/admin/products" className="px-6 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
