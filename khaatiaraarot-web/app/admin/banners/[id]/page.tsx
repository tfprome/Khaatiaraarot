"use client";
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import NextImage from 'next/image';

interface Banner {
  id: string; type: 'hero' | 'side' | 'promo'; title?: string; subtitle?: string;
  tagText?: string; imageUrl?: string; ctaLabel?: string; ctaHref?: string;
  sortOrder: number; isActive: boolean; startsAt?: string; endsAt?: string;
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

function toLocal(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 16);
}

export default function EditBannerPage() {
  const { id } = useParams() as { id: string };
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    type: 'hero' as 'hero' | 'side' | 'promo',
    title: '', subtitle: '', tagText: '', ctaLabel: '', ctaHref: '',
    sortOrder: '0', isActive: true, startsAt: '', endsAt: '',
  });

  useEffect(() => {
    adminApi.get<{ data: Banner[] }>('/banners')
      .then(r => {
        const b = r.data.find(ban => ban.id === id);
        if (!b) throw new Error('Banner not found');
        setImageUrl(b.imageUrl);
        setForm({
          type: b.type, title: b.title ?? '', subtitle: b.subtitle ?? '',
          tagText: b.tagText ?? '', ctaLabel: b.ctaLabel ?? '', ctaHref: b.ctaHref ?? '',
          sortOrder: String(b.sortOrder), isActive: b.isActive,
          startsAt: toLocal(b.startsAt), endsAt: toLocal(b.endsAt),
        });
      })
      .catch(e => setError(e.message));
  }, [id]);

  function set(k: keyof typeof form, v: string | boolean) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess('');
    setSaving(true);
    try {
      await adminApi.put(`/banners/${id}`, {
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
      setSuccess('Banner updated.');
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
      const res = await adminApi.upload<{ data: { imageUrl: string } }>(`/banners/${id}/image`, 'image', file);
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
        <Link href="/admin/banners" className="p-2 text-[#a07850] hover:text-[#8B0000] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Edit Banner</h1>
          <p className="text-[#a07850] text-sm mt-0.5">Update banner details</p>
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
          <input value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Subtitle">
          <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Tag Text">
          <input value={form.tagText} onChange={e => set('tagText', e.target.value)} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA Label">
            <input value={form.ctaLabel} onChange={e => set('ctaLabel', e.target.value)} className={inputCls} />
          </Field>
          <Field label="CTA Link">
            <input value={form.ctaHref} onChange={e => set('ctaHref', e.target.value)} className={inputCls} />
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
        {success && <p className="text-sm text-green-600">{success}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/admin/banners" className="px-6 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] transition-colors">
            Cancel
          </Link>
        </div>
      </form>

      <div className="bg-white border border-[#e8d5c4] rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-[#2c1a0e]">Banner Image</h2>
        {imageUrl && (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#e8d5c4]">
            <NextImage src={imageUrl} alt="banner" fill className="object-cover" sizes="(max-width: 640px) 100vw, 640px" />
          </div>
        )}
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="banner-img" />
          <label
            htmlFor="banner-img"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8d5c4] text-sm text-[#2c1a0e] hover:bg-[#fdf5ee] cursor-pointer transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {uploading ? 'Uploading…' : imageUrl ? 'Replace Image' : 'Upload Image'}
          </label>
        </div>
      </div>
    </div>
  );
}
