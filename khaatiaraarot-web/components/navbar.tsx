"use client";

import {
    UserCirclePlusIcon,
    SignInIcon,
    PhoneIcon,
    HouseIcon,
    StorefrontIcon,
    TagIcon,
    HandbagSimpleIcon,
    InfoIcon,
    EnvelopeSimpleIcon,
    CaretDownIcon,
    MagnifyingGlassIcon,
    HeartIcon,
    ShoppingCartIcon,
    UserIcon,
    ListIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import Khaatiarotlogo from '../public/Images/khatiarotlogo-removebg.png';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const navLinks = [
    { label: "Home", href: "/", icon: HouseIcon },
    { label: "Shop", href: "/shop", icon: StorefrontIcon },
    { label: "Offers", href: "/offers", icon: TagIcon },
    { label: "Orders", href: "/orders", icon: HandbagSimpleIcon },
    { label: "About", href: "/about", icon: InfoIcon },
    { label: "Contact", href: "/contact", icon: EnvelopeSimpleIcon },
];

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem("userToken"));
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("userToken");

            if (!token) return;

            const BASE =
                process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

            const res = await fetch(`${BASE}/api/v1/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            const json = await res.json();

            console.log("Logout response:", json);

            if (!res.ok) {
                toast.error(json.error?.message ?? "Logout failed.Please try again", {
                    position: "bottom-right",
                    autoClose: 1500,
                    hideProgressBar: true,
                    style: {
                        background: "#f00808",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: "600",
                        padding: "16px",
                        minWidth: "320px",
                        minHeight: "70px",
                        borderRadius: "12px",
                    },
                });

                throw new Error(json.error?.message ?? "Login failed");
            }
            
            else if (res.ok) {

                localStorage.removeItem("userToken");
                localStorage.removeItem("userName");

                setToken(null);
                toast("You're logged out! See you soon.", {
                    position: "bottom-right",
                    autoClose: 1000, // 0.5 second
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    style: {
                        background: "#5B1A18", // dark green
                        color: "#ffffff",
                        fontSize: "16px",
                        fontWeight: "600",
                        padding: "16px",
                        minWidth: "320px",
                        minHeight: "70px",
                        borderRadius: "12px",
                    },
                });
            }

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 shadow-sm">

            {/* ── Top Bar ── */}
            <div className="bg-[#fc8f0a] text-white text-xs py-2 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <PhoneIcon size={13} weight="fill" />
                        <span className="hidden sm:inline">Hotline:</span>
                        <span className="font-semibold">+880 170-000-0000</span>
                    </div>
                    <p className="hidden md:block text-white text-xs">
                        Big savings on orders above ৳500
                    </p>
                    <div className="flex items-center gap-3">
                        {token ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 cursor-pointer hover:text-[#5B1A18] transition-colors"
                            >
                                <SignInIcon size={13} />
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-1 cursor-pointer hover:text-[#5B1A18] transition-colors"
                            >
                                <SignInIcon size={13} />
                                Login
                            </Link>
                        )}
                        <span className="opacity-40">|</span>
                        <Link href='/register'
                            className="flex items-center gap-1 cursor-pointer hover:text-[#5B1A18] transition-colors">
                            <UserCirclePlusIcon size={13} />
                            Register
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Main Bar ── */}
            <div className="bg-[#5B1A18] border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">

                    {/* Row 1: Logo + Search + Icons */}
                    <div className="flex items-center gap-3">

                        {/* Logo */}
                        <div className="flex items-center gap-2 shrink-0 cursor-pointer group">
                            {/* <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                                <HouseIcon size={20} weight="fill" className="text-white" />
                            </div> */}
                            <div className="mb-2">
                                <Image
                                    src={Khaatiarotlogo}
                                    alt="Grocery Store Logo"
                                    width={100}
                                    height={50}
                                    //className="w-full h-full object-contain"
                                    priority
                                >
                                </Image>
                            </div>
                        </div>

                        {/* Search Bar — md+ */}
                        <div className="hidden md:flex flex-1 items-center rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-sm transition-colors duration-200">
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 border-r border-gray-200 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0">
                                All
                                <CaretDownIcon size={12} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for groceries, vegetables…"
                                className="flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
                            />
                            <button className="flex items-center gap-2 bg-[#5B1A18] text-white px-4 py-2.5 text-sm font-semibold transition-colors duration-200 shrink-0">
                                <MagnifyingGlassIcon size={17} weight="bold" />
                                <span className="hidden lg:inline">Search</span>
                            </button>
                        </div>

                        {/* Spacer on mobile */}
                        <div className="flex-1 md:hidden" />

                        {/* Action Icons */}
                        <div className="flex items-center shrink-0">
                            <div className="relative flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl group transition-colors duration-200 cursor-pointer">
                                <HeartIcon size={22} className="text-white transition-colors duration-200" />
                                <span className="hidden lg:block text-[10px] text-white font-medium transition-colors">
                                    Wishlist
                                </span>
                            </div>
                            <div className="relative flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl group transition-colors duration-200 cursor-pointer">
                                <ShoppingCartIcon size={22} className="text-white transition-colors duration-200" />
                                <span className="hidden lg:block text-[10px] text-white font-medium transition-colors">
                                    Cart
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl group transition-colors duration-200 cursor-pointer">
                                <UserIcon size={22} className="text-white transition-colors duration-200" />
                                <span className="hidden lg:block text-[10px] text-white font-medium transition-colors">
                                    Account
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Search Bar — mobile only */}
                    <div className="flex md:hidden items-center rounded-xl border-2 border-[#5B1A18] bg-white overflow-hidden shadow-sm">
                        <input
                            type="text"
                            placeholder="Search for groceries, vegetables…"
                            className="flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
                        />
                        <button className="flex items-center text-black px-4 py-2.5 transition-colors duration-200 cursor-pointer shrink-0">
                            <MagnifyingGlassIcon size={17} weight="bold" />
                        </button>
                    </div>

                </div>
            </div>

            {/* ── Bottom Nav ── */}
            <div className="bg-white border-t border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex items-center">

                    {/* All Categories */}
                    {/* <div className="flex items-center gap-2 bg-[#5B1A18] hover:bg-[#5B1A18] text-white px-4 py-3 text-sm font-semibold transition-colors duration-200 cursor-pointer shrink-0">
                        <ListIcon size={18} />
                        <span className="hidden sm:inline">All Categories</span>
                        <CaretDownIcon size={13} />
                    </div> */}

                    {/* Nav Links — icon only on md, icon+label on lg+ */}
                    <nav className="hidden md:flex items-center min-w-0">
                        {navLinks.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                className="relative px-2.5 lg:px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#5B1A18] hover:bg-[#fcebeb] transition-colors duration-200 whitespace-nowrap group flex items-center gap-1.5 shrink-0"
                            >
                                <Icon size={16} />
                                {/* label hidden on md, visible on lg */}
                                <span className="hidden lg:inline">{label}</span>
                                <span className="absolute bottom-0 left-2.5 right-2.5 lg:left-4 lg:right-4 h-0.5 bg-[#5B1A18] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1" />

                    {/* Deals Badge — shrinks text on md, full on lg */}
                    <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 px-3 lg:px-4 py-3 cursor-pointer shrink-0 whitespace-nowrap">
                        <TagIcon size={16} weight="fill" />
                        <span className="hidden lg:inline">Deals & Offers</span>
                        {/* icon-only label for md */}
                        <span className="lg:hidden text-xs">Deals</span>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:text-green-700">
                        <ListIcon size={20} />
                        <span>Menu</span>
                    </div>

                </div>
            </div>

        </header>
    );
}