"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HouseIcon,
  PackageIcon,
  TagIcon,
  ImageIcon,
  ShoppingCartIcon,
  StackIcon,
  ChartBarIcon,
  UserCircleIcon,
  TruckIcon,
} from '@phosphor-icons/react';

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: HouseIcon },
  { label: 'Products', href: '/admin/products', icon: PackageIcon },
  { label: 'Categories', href: '/admin/categories', icon: TagIcon },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
  { label: 'Inventory', href: '/admin/inventory', icon: StackIcon },
  { label: 'Delivery', href: '/admin/delivery', icon: TruckIcon },
  { label: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';
  const [ready, setReady] = useState(isLogin);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [role, setRole] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLogin) { setReady(true); return; }
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('adminRole');
    if (!token || role !== 'admin') {
      router.replace('/admin/login');
    } else {
      setReady(true);
      setAdminName(localStorage.getItem('adminName'));
      setRole(role);
    }
  }, [isLogin, router]);

  if (!ready) return null;
  if (isLogin) return <>{children}</>;

  function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminName');
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
        <div className="p-4 border-t border-gray-400">
          <div className="flex items-center space-x-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <UserCircleIcon size={32}
                className='cursor-pointer text-gray-600 hover:text-gray-800 transition'
                onClick={() => setIsOpen(prev => !prev)} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#FDF5EE]">{adminName}</p>
              <p className="text-xs text-[#FDF5EE]">{role}</p>
            </div>
          </div>
          {isOpen && (
            <div className="fixed bottom-16 left-4 bg-white rounded-lg shadow-lg p-4 w-48">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 cursor-not-allowed  rounded-md transition">Profile</button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 cursor-not-allowed  rounded-md transition">Settings</button>
              <button className="w-full text-left px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-gray-100 rounded-md transition"
                onClick={logout}>Logout</button>
            </div>
          )

          }
        </div>
      </aside>
      <main className="ml-60 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
