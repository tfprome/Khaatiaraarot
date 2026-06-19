const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userToken');
}

async function tryRefresh(): Promise<string | null> {
  const res = await fetch(`${BASE}/api/v1/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) return null;
  const json = await res.json() as { data?: { accessToken: string; user: { fullName: string } } };
  const newToken = json.data?.accessToken ?? null;
  if (newToken) {
    localStorage.setItem('userToken', newToken);
    if (json.data?.user.fullName) {
      localStorage.setItem('userName', json.data.user.fullName);
    }
  }
  return newToken;
}

async function req<T>(path: string, opts: RequestInit = {}, retry = true): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (opts.headers) Object.assign(headers, opts.headers);

  const res = await fetch(`${BASE}${path}`, { ...opts, headers, credentials: 'include' });

  if (res.status === 401 && retry) {
    const newToken = await tryRefresh();
    if (!newToken) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    return req<T>(path, opts, false);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function upload<T>(path: string, field: string, file: File): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const form = new FormData();
  form.append(field, file);
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: form,
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => req<T>(path),
  post: <T>(path: string, body: unknown) =>
    req<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    req<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    req<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(path: string) => req<T>(path, { method: 'DELETE' }),
  upload,
};
