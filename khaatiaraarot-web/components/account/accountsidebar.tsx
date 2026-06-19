"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut, Menu, X, User, ShoppingBag, Heart, MapPin, Bell, Shield } from "lucide-react";
import { NavItem } from "@/Types/userTypes";
import api from "@/lib/axiosinterceptor";

export const NAV_ITEMS: NavItem[] = [
  { label: "My Profile",    href: "/my-account/profile",       icon: User },
  { label: "My Orders",     href: "/my-account/orders",        icon: ShoppingBag },
  { label: "My Wishlist",   href: "/my-account/wishlist",      icon: Heart },
  { label: "My Addresses",  href: "/my-account/addresses",     icon: MapPin },
//   { label: "Notifications", href: "/my-account/notifications", icon: Bell },
  { label: "Security",      href: "/my-account/security",      icon: Shield },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeLabel =
    NAV_ITEMS.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ??
    "My Account";

  const handleLogout = async () => {
    try { await api.post("/api/v1/auth/logout"); } catch {}
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const NavLinks = ({ onClickLink }: { onClickLink?: () => void }) => (
    <>
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClickLink}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                active ? "bg-[#5B1A18] text-white shadow-sm" : "text-[#4a2020] hover:bg-[#f9f1f0]"
              }`}
            >
              <Icon
                size={17}
                className={`flex-shrink-0 ${active ? "text-white" : "text-[#9b7b7a] group-hover:text-[#5B1A18]"}`}
              />
              <span className="text-sm font-medium">{label}</span>
              {active && <ChevronRight size={15} className="ml-auto opacity-70" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-[#f0e8e7]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#5B1A18] hover:bg-[#fdf3f3] transition-all duration-150"
        >
          <LogOut size={17} className="flex-shrink-0" />
          <span className="text-sm font-semibold">Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col h-full bg-white rounded-2xl border border-[#f0e8e7] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0e8e7]">
          <span className="text-[#5B1A18] font-bold text-base tracking-tight">My Account</span>
        </div>
        <NavLinks />
      </aside>

      {/* ── Mobile topbar ── */}
      <div className="md:hidden sticky top-[130px] z-30 bg-white border-b border-[#f0e8e7] flex items-center justify-between px-4 py-3 shadow-sm">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 rounded-lg text-[#5B1A18] hover:bg-[#f9f1f0] transition"
        >
          <Menu size={20} />
        </button>
        <span className="text-[#5B1A18] font-bold text-sm">{activeLabel}</span>
        <div className="w-8" />
      </div>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl z-50 pt-[130px] flex flex-col animate-slide-in">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-[138px] right-3 p-1.5 rounded-lg text-[#9b7b7a] hover:text-[#5B1A18] hover:bg-[#f9f1f0] transition"
            >
              <X size={18} />
            </button>
            <div className="px-5 py-4 border-b border-[#f0e8e7]">
              <span className="text-[#5B1A18] font-bold text-base tracking-tight">My Account</span>
            </div>
            <NavLinks onClickLink={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.22s cubic-bezier(0.4,0,0.2,1); }
      `}</style>
    </>
  );
}