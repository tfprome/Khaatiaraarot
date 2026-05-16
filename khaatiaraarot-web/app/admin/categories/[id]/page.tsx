"use client";
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import NextImage from 'next/image';

interface Category {
  id: string; name: string; nameBn?: string; slug: string;
  sortOrder: number; isActive: boolean; imageUrl?: string;
}

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

export default function EditCategoryPage() {
  const { id } = useParams() as { id: string };
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', nameBn: '', slug: '', sortOrder: '0', isActive: true,
  });

  useEffect(() => {
    adminApi.get<{ data: Category[] }>('/categories')
      .then(r => {
        const c = r.data.find(cat => cat.id === id);
        if (!c) throw new Error('Category not found');
        setImageUrl(c.imageUrl);
        setForm({
          name: c.name, nameBn: c.nameBn ?? '', slug: c.slug,
          sortOrder: String(c.sortOrder), isActive: c.isActive,
        });
      })
      .catch(e => setError(e.message));
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
      await adminApi.put(`/categories/${id}`, {
        name: form.name, nameBn: form.nameBn || undefined,
        slug: form.slug, sortOrder: parseInt(form.sortOrder), isActive: form.isActive,
      });
      setSuccess('Category updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminApi.upload<{ data: { imageUrl: string } }>(`/categories/${id}/image`, 'image', file);
      setImageUrl(res.data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/categories" className="p-2 text-[#a07850] hover:text-[#8B0000] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Edit Category</h1>
          <p className="text-[#a07850] text-sm mt-0.5">Update category details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-5">
        <Field label="Name (English)" required>
          <input value={form.name} onChange={e => handleNameChange(e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Name (Bengali)">
          <input value={form.nameBn} onChange={e => set('nameBn', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Slug" required>
          <input value={form.slug} onChange={e => set('slug', e.target.value)} required pattern="[a-z0-9-]+" className={inputCls} />
        </Field>
        <Field label="Sort Order">
          <input type="number" min="0" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-[#8B0000]" />
          <span className="text-sm font-medium text-[#2c1a0e]">Active</span>
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/admin/categories" className="px-6 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] transition-colors">
            Cancel
          </Link>
        </div>
      </form>

      <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-[#2c1a0e]">Category Image</h2>
        {imageUrl && (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#e8d5c4]">
            <NextImage src={imageUrl} alt="category" fill className="object-cover" sizes="128px" />
          </div>
        )}
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="cat-img" />
          <label
            htmlFor="cat-img"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] cursor-pointer transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {uploading ? 'Uploading…' : imageUrl ? 'Replace Image' : 'Upload Image'}
          </label>
        </div>
      </div>
    </div>
  );
}
