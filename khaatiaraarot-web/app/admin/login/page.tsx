"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeSlash, Lock, Envelope } from '@phosphor-icons/react';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json() as { success?: boolean; data?: { accessToken: string; user: { role: string, fullName: string } }; message?: string };
      if (!res.ok) throw new Error(json.message ?? 'Login failed');
      if (json.data?.user?.role !== 'admin') throw new Error('Not authorized as admin');
      localStorage.setItem('adminToken', json.data!.accessToken);
      localStorage.setItem('adminRole', json.data!.user.role);
      localStorage.setItem('adminName', json.data!.user.fullName);
      router.replace('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf5ee] flex items-center justify-center px-4">
      <div className="bg-white border border-[#e8d5c4] rounded-2xl shadow-sm w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2c1a0e]">Admin Login</h1>
          <p className="text-[#a07850] text-sm mt-1">Khaatiaraarot Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2c1a0e] mb-1.5">Email</label>
            <div className="flex items-center border border-[#e8d5c4] rounded-xl px-3 gap-2 focus-within:border-[#8B0000] transition-colors">
              <Envelope size={17} className="text-[#a07850] shrink-0" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@khaatiaraarot.com"
                className="flex-1 py-3 text-sm outline-none bg-transparent text-[#2c1a0e] placeholder:text-[#c4a07a]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2c1a0e] mb-1.5">Password</label>
            <div className="flex items-center border border-[#e8d5c4] rounded-xl px-3 gap-2 focus-within:border-[#8B0000] transition-colors">
              <Lock size={17} className="text-[#a07850] shrink-0" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="flex-1 py-3 text-sm outline-none bg-transparent text-[#2c1a0e] placeholder:text-[#c4a07a]"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="text-[#a07850] hover:text-[#8B0000] transition-colors"
              >
                {showPw ? <EyeSlash size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
