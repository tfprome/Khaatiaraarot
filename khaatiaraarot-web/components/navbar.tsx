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
    XIcon
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import Khaatiarotlogo from '../public/Images/khatiarotlogo-removebg.png';
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { openCart } from "@/store/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import api from "@/lib/axiosinterceptor";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Product } from "@/Types/ProductTypes";

const navLinks = [
    { label: "Home", href: "/", icon: HouseIcon },
    { label: "Shop", href: "/shop", icon: StorefrontIcon },
    { label: "Orders", href: "/my-account/orders", icon: HandbagSimpleIcon },
    { label: "About", href: "/about", icon: InfoIcon },
    { label: "Contact", href: "/contact", icon: EnvelopeSimpleIcon },
];

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dispatch = useAppDispatch();
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    const router = useRouter();
    const [username, setUsername] = useState<string | null>("")

    // --- SEARCH STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isFetchingProducts, setIsFetchingProducts] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // --- MOBILE MENU CLOSE ON OUTSIDE CLICK ---
    useEffect(() => {
        if (!mobileMenuOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileMenuOpen]);

    // --- SEARCH DROPDOWN CLOSE ON OUTSIDE CLICK ---
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                searchRef.current && !searchRef.current.contains(e.target as Node) &&
                mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)
            ) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- DEBOUNCE & API SEARCH LOGIC ---
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        // Set a timer to call the API after 300ms of inactivity
        debounceTimer.current = setTimeout(async () => {
            setIsFetchingProducts(true);
            try {
                // Backend API call with query parameter
                const res = await axios.get(`${BASE}/api/v1/products?q=${searchQuery.trim()}`);
                setSearchResults(res.data.data); 
            } catch (error) {
                console.error("Search failed", error);
                setSearchResults([]);
            } finally {
                setIsFetchingProducts(false);
            }
        }, 300);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [searchQuery, BASE]);
    //console.log("Search Results:", searchResults);

    // --- SIMPLIFIED FOCUS HANDLER ---
    const handleSearchFocus = () => {
        setIsSearchOpen(true);
    };

    // --- HANDLE CLICKING A SEARCH RESULT ---
    const handleResultClick = (productId: string) => {
        router.push(`/shop/${productId}`); 
        setSearchQuery("");
        setIsSearchOpen(false);
    };

    useEffect(() => {
        setToken(localStorage.getItem("userToken"));
        setUsername(localStorage.getItem("userName"))
    }, []);

    const handleMyAccountRedirection = () => {
        const token = localStorage.getItem("userToken");
        if (token) {
            router.push("/my-account");
        } else {
            toast("Please login to view your profile", {
                position: "top-center", autoClose: 1000, hideProgressBar: true,
                closeOnClick: true, pauseOnHover: false, draggable: false, className: 'success-toast'
            });
            router.push("/login");
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/api/v1/auth/logout");
            if (typeof window !== "undefined") {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userName");
            }
            setToken(null);
            setUsername(null);
            dispatch(logout())
            toast("You're logged out! See you soon.", {
                position: "bottom-right", autoClose: 1000, hideProgressBar: true,
                closeOnClick: true, pauseOnHover: false, draggable: false, className:'success-toast'
            });
        } catch (error: any) {
            toast.error(error?.response?.data?.message ?? "Logout failed. Please try again", {
                position: "bottom-right", autoClose: 1500, hideProgressBar: true, className: "error-toast"
            });
        }
    };

    // --- SEARCH DROPDOWN UI COMPONENT (100% Unchanged) ---
    const SearchDropdown = () => (
        <AnimatePresence>
            {isSearchOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-2xl z-50 max-h-96 overflow-y-auto"
                >
                    {isFetchingProducts ? (
                        <div className="p-4 text-center text-sm text-gray-400">Loading products...</div>
                    ) : searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((product) => (
                                <li
                                    key={product.id}
                                    onClick={() => handleResultClick(product.id)}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {product.image && (
                                            <Image src={product.image} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                                        <p className="text-xs text-[#5B1A18] font-semibold">৳{product.price}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : searchQuery.trim() !== "" ? (
                        <div className="p-4 text-center text-sm text-gray-500">No products found for "{searchQuery}"</div>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-400">Start typing to search...</div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

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
                    <p className="hidden md:block text-white text-xs">Big savings on orders above ৳500</p>
                    <div className="flex items-center gap-3">
                        {token ? (
                            <button onClick={handleLogout} className="flex items-center gap-1 cursor-pointer hover:text-[#5B1A18] transition-colors">
                                <SignInIcon size={13} /> Logout
                            </button>
                        ) : (
                            <Link href="/login" className="flex items-center gap-1 cursor-pointer hover:text-[#5B1A18] transition-colors">
                                <SignInIcon size={13} /> Login
                            </Link>
                        )}
                        <span className="opacity-40">|</span>
                        <Link href='/register' className="flex items-center gap-1 cursor-pointer hover:text-[#5B1A18] transition-colors">
                            <UserCirclePlusIcon size={13} /> Register
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Main Bar ── */}
            <div className="bg-[#5B1A18] border-b border-gray-100">
                <div className="max-w-7xl mx-auto md:px-0 px-4 py-3 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className="flex items-center gap-2 shrink-0 cursor-pointer group">
                            <div onClick={() => { router.push('/') }} className="mb-2">
                                <Image src={Khaatiarotlogo} alt="Khaati Aarot Logo" width={100} height={50} priority />
                            </div>
                        </div>

                        {/* Search Bar — md+ */}
                        <div className="hidden md:block relative flex-1" ref={searchRef}>
                            <div className="flex items-center rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-sm transition-colors duration-200">
                                <div className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 border-r border-gray-200 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0">
                                    All <CaretDownIcon size={12} />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={handleSearchFocus}
                                    placeholder="Search for groceries, vegetables…"
                                    className="flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
                                />
                                <button className="flex items-center gap-2 bg-[#5B1A18] text-white px-4 py-2.5 text-sm font-semibold transition-colors duration-200 shrink-0">
                                    <MagnifyingGlassIcon size={17} weight="bold" />
                                    <span className="hidden lg:inline">Search</span>
                                </button>
                            </div>
                            <SearchDropdown />
                        </div>

                        <div className="flex-1 md:hidden" />

                        {/* Action Icons */}
                        <div className="flex items-center shrink-0">
                            <div onClick={() => router.push('/my-account/wishlist')} className="relative flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl group transition-colors duration-200 cursor-pointer">
                                <HeartIcon size={22} className="text-white transition-colors duration-200" />
                                <span className="hidden lg:block text-[10px] text-white font-medium transition-colors">Wishlist</span>
                            </div>
                            <div onClick={() => dispatch(openCart())} className="relative flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl group transition-colors duration-200 cursor-pointer">
                                <ShoppingCartIcon size={22} className="text-white transition-colors duration-200" />
                                <span className="hidden lg:block text-[10px] text-white font-medium transition-colors">Cart</span>
                            </div>
                            <div onClick={handleMyAccountRedirection} className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl group transition-colors duration-200 cursor-pointer">
                                <UserIcon size={22} className="text-white transition-colors duration-200" />
                                <span className="hidden lg:block text-[10px] text-white font-medium transition-colors">
                                    {username?.split(" ")[0] || "account"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Search Bar — mobile only */}
                    <div className="relative flex md:hidden" ref={mobileSearchRef}>
                        <div className="flex items-center w-full rounded-xl border-2 border-[#5B1A18] bg-white overflow-hidden shadow-sm">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={handleSearchFocus}
                                placeholder="Search for groceries, vegetables…"
                                className="flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
                            />
                            <button className="flex items-center text-black px-4 py-2.5 transition-colors duration-200 cursor-pointer shrink-0">
                                <MagnifyingGlassIcon size={17} weight="bold" />
                            </button>
                        </div>
                        <SearchDropdown />
                    </div>
                </div>
            </div>

            {/* ── Bottom Nav ── */}
            <div className="bg-white border-t border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto md:px-0 px-4 flex items-center">
                    <nav className="hidden md:flex items-center min-w-0 font-serif">
                        {navLinks.map(({ label, href, icon: Icon }) => (
                            <Link key={label} href={href} className="relative px-2.5 lg:px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#5B1A18] hover:bg-[#fcebeb] transition-colors duration-200 whitespace-nowrap group flex items-center gap-1.5 shrink-0">
                                <Icon size={16} />
                                <span className="hidden lg:inline">{label}</span>
                                <span className="absolute bottom-0 left-2.5 right-2.5 lg:left-4 lg:right-4 h-0.5 bg-[#5B1A18] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1" />

                    <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 px-3 lg:px-4 py-3 cursor-pointer shrink-0 whitespace-nowrap">
                        <TagIcon size={16} weight="fill" />
                        <span className="hidden lg:inline">Deals & Offers</span>
                        <span className="lg:hidden text-xs">Deals</span>
                    </div>

                    <button onClick={() => setMobileMenuOpen(true)} className="md:hidden flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:text-[#5B1A18] transition-colors">
                        <ListIcon size={20} />
                        <span>Menu</span>
                    </button>

                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <>
                                <div className="md:hidden fixed inset-0 bg-black/30 z-40" />
                                <motion.div
                                    ref={menuRef}
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "-100%" }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="md:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col"
                                >
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                        <span className="text-[#5B1A18] font-bold text-base">Menu</span>
                                        <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#5B1A18] hover:bg-[#f9f1f0] transition">
                                            <XIcon size={18} />
                                        </button>
                                    </div>
                                    <nav className="flex-1 flex flex-col px-2 py-2 overflow-y-auto">
                                        {navLinks.map(({ label, href, icon: Icon }) => (
                                            <Link key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#fcebeb] hover:text-[#5B1A18] transition-colors">
                                                <Icon size={18} />
                                                <span className="text-sm font-medium">{label}</span>
                                            </Link>
                                        ))}
                                        <button onClick={() => { handleMyAccountRedirection(); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#fcebeb] hover:text-[#5B1A18] transition-colors w-full text-left">
                                            <UserIcon size={18} />
                                            <span className="text-sm font-medium">My Account</span>
                                        </button>
                                    </nav>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}