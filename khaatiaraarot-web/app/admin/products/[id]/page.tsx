"use client";
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { ArrowLeft, Trash, Star } from '@phosphor-icons/react';
import NextImage from 'next/image';

interface Category { id: string; name: string; }
interface RatePlan { id: string; name: string; isActive: boolean; }
interface ProductImage { id: string; url: string; isPrimary: boolean; }
interface Product {
  id: string; name: string; slug: string; description?: string; unit: string;
  sourceRegion?: string; categoryId?: string; ratePlanId?: string;
  price: string | number; originalPrice?: string | number;
  stockQty: number; lowStockThreshold: number;
  isBestSelling: boolean; isActive: boolean;
  images?: ProductImage[];
}

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
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

export default function EditProductPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', slug: '', description: '', unit: '', sourceRegion: '',
    categoryId: '', ratePlanId: '', price: '', originalPrice: '', stockQty: '0',
    lowStockThreshold: '5', isBestSelling: false, isActive: true,
  });

  useEffect(() => {
    Promise.all([
      adminApi.get<{ data: Category[] }>('/categories'),
      adminApi.get<{ data: RatePlan[] }>('/rate-plans'),
      fetch(`${BASE}/api/v1/products/${id}`).then(r => r.json()) as Promise<{ data: Product }>,
    ]).then(([cats, plans, prod]) => {
      setCategories(cats.data);
      setRatePlans(plans.data.filter((p: RatePlan) => p.isActive));
      const p = prod.data;
      setImages(p.images ?? []);
      setForm({
        name: p.name, slug: p.slug, description: p.description ?? '',
        unit: p.unit, sourceRegion: p.sourceRegion ?? '',
        categoryId: p.categoryId ?? '', ratePlanId: p.ratePlanId ?? '',
        price: String(p.price),
        originalPrice: p.originalPrice ? String(p.originalPrice) : '',
        stockQty: String(p.stockQty), lowStockThreshold: String(p.lowStockThreshold),
        isBestSelling: p.isBestSelling, isActive: p.isActive,
      });
    }).catch(e => setError(e.message));
  }, [id]);

  function set(k: keyof typeof form, v: string | boolean) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function handleNameChange(name: string) {
    setForm(prev => ({ ...prev, name, slug: toSlug(name) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess('');
    setSaving(true);
    try {
      await adminApi.put(`/products/${id}`, {
        name: form.name, slug: form.slug,
        description: form.description || undefined,
        unit: form.unit, sourceRegion: form.sourceRegion || undefined,
        categoryId: form.categoryId || undefined,
        ratePlanId: form.ratePlanId || undefined,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stockQty: parseInt(form.stockQty),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        isBestSelling: form.isBestSelling, isActive: form.isActive,
      });
      setSuccess('Product updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminApi.upload<{ data: ProductImage }>(`/products/${id}/images`, 'image', file);
      setImages(prev => [...prev, res.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function deleteImage(imageId: string) {
    await adminApi.del(`/products/${id}/images/${imageId}`);
    setImages(prev => prev.filter(img => img.id !== imageId));
  }

  async function setPrimary(imageId: string) {
    await adminApi.patch(`/products/${id}/images/${imageId}/primary`, {});
    setImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === imageId })));
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 text-[#a07850] hover:text-[#8B0000] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Edit Product</h1>
          <p className="text-[#a07850] text-sm mt-0.5">Update product details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-5">
        <Field label="Name" required>
          <input value={form.name} onChange={e => handleNameChange(e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Slug" required>
          <input value={form.slug} onChange={e => set('slug', e.target.value)} required pattern="[a-z0-9-]+" className={inputCls} />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={inputCls + ' resize-none'} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Unit" required>
            <input value={form.unit} onChange={e => set('unit', e.target.value)} required className={inputCls} />
          </Field>
          <Field label="Source Region">
            <input value={form.sourceRegion} onChange={e => set('sourceRegion', e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Category">
          <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className={inputCls}>
            <option value="">— Select category —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Delivery Rate Plan">
          <select value={form.ratePlanId} onChange={e => set('ratePlanId', e.target.value)} className={inputCls}>
            <option value="">— No delivery / free —</option>
            {ratePlans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (৳)" required>
            <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required className={inputCls} />
          </Field>
          <Field label="Original Price (৳)">
            <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} className={inputCls} />
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
        {success && <p className="text-sm text-green-600">{success}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/admin/products" className="px-6 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] transition-colors">
            Cancel
          </Link>
        </div>
      </form>

      {/* Images */}
      <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-[#2c1a0e]">Product Images</h2>
        <div className="flex flex-wrap gap-3">
          {images.map(img => (
            <div key={img.id} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-[#e8d5c4]">
              <NextImage src={img.url} alt="product" fill className="object-cover" sizes="96px" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <button onClick={() => setPrimary(img.id)} className="p-1 bg-white/90 rounded-lg text-yellow-600 hover:bg-white" title="Set primary">
                    <Star size={14} />
                  </button>
                )}
                <button onClick={() => deleteImage(img.id)} className="p-1 bg-white/90 rounded-lg text-red-500 hover:bg-white" title="Delete">
                  <Trash size={14} />
                </button>
              </div>
              {img.isPrimary && (
                <span className="absolute top-1 left-1 bg-[#8B0000] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">PRIMARY</span>
              )}
            </div>
          ))}
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" id="img-upload" />
          <label
            htmlFor="img-upload"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] cursor-pointer transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {uploading ? 'Uploading…' : 'Upload Image'}
          </label>
        </div>
      </div>
    </div>
  );
}
