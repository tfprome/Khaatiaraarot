"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  House,
  Package,
  Tag,
  Image as ImageIcon,
  ShoppingCart,
  Stack,
  ChartBar,
  SignOut,
} from '@phosphor-icons/react';

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: House },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Inventory', href: '/admin/inventory', icon: Stack },
  { label: 'Reports', href: '/admin/reports', icon: ChartBar },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';
  const [ready, setReady] = useState(isLogin);

  useEffect(() => {
    if (isLogin) { setReady(true); return; }
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('adminRole');
    if (!token || role !== 'admin') {
      router.replace('/admin/login');
    } else {
      setReady(true);
    }
  }, [isLogin, router]);

  if (!ready) return null;
  if (isLogin) return <>{children}</>;

  function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    router.replace('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[#fdf5ee]">
      <aside className="w-60 bg-[#2c1a0e] flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="px-5 py-5 border-b border-[#5B1A18]">
          <p className="text-[#FAC775] font-bold text-base">Khaatiaraarot</p>
          <p className="text-[#a07850] text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#8B0000] text-white'
                    : 'text-[#c4a07a] hover:bg-[#3d2010] hover:text-white'
                }`}
              >
                <Icon size={17} weight={active ? 'fill' : 'regular'} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-5">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#c4a07a] hover:bg-[#3d2010] hover:text-white transition-colors"
          >
            <SignOut size={17} />
            Logout
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
