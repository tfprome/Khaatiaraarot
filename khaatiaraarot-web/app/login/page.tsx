"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon, LockKeyIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";
import logo from "../../public/Images/khatiarotlogo-removebg.png";
import { toast } from "react-toastify";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

    async function handleSubmit() {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${BASE}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const json = await res.json() as { success?: boolean; data?: { accessToken: string; user: { role: string; fullName: string } }; error?: { message?: string } };
            if (!res.ok) {
                toast.error(json.error?.message ?? "Login failed.Please try again", {
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

            localStorage.setItem('userToken', json.data!.accessToken);
            localStorage.setItem('userName', json.data!.user.fullName);
            
            toast("You're in! Let's fill the cart.", {
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

            router.replace('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="h-screen bg-[#fdf5ee] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                {/* ── Logo ── */}
                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mr-5 -mb-6">
                        <Image
                            src={logo}
                            alt="Khaati Aarot"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* ── Card ── */}
                <div className="bg-white border border-[#e8d5c4] rounded-2xl px-6 sm:px-8 py-8 shadow-sm">

                    {/* Heading */}
                    <div className="mb-6">
                        <h2 className="text-xl text-center font-bold text-[#2c1a0e]">
                            Welcome back
                        </h2>
                        <p className="text-sm text-center text-[#a07850] mt-1">
                            Sign in to your account to continue
                        </p>
                        <div className="mt-3 mx-auto w-10 h-0.5 rounded-full bg-[#8B0000]" />
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="email"
                                className="text-[12px] font-semibold text-[#2c1a0e] uppercase tracking-wide"
                            >
                                Email address
                            </label>
                            <div className="flex items-center gap-3 border border-[#e8d5c4] rounded-xl px-4 py-3  focus-within:border-[#8B0000] focus-within:bg-white transition-all duration-200">
                                <EnvelopeSimpleIcon
                                    size={17}
                                    weight="fill"
                                    className="text-[#a07850] shrink-0"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="flex-1 bg-white text-sm text-black placeholder-[#c8a882] outline-none"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-[12px] font-semibold text-[#2c1a0e] uppercase tracking-wide"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[12px] text-[#8B0000] hover:text-[#6e0000] font-medium transition-colors duration-200"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="flex items-center gap-3 border border-[#e8d5c4] rounded-xl px-4 py-3 focus-within:border-[#8B0000] focus-within:bg-white transition-all duration-200">
                                <LockKeyIcon
                                    size={17}
                                    weight="fill"
                                    className="text-[#a07850] shrink-0"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="flex-1 bg-white text-sm text-[#2c1a0e] placeholder-[#c8a882] outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="text-[#a07850] hover:text-[#8B0000] transition-colors duration-200 shrink-0 cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon size={17} weight="fill" />
                                    ) : (
                                        <EyeIcon size={17} weight="fill" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        {/* {error && <p className="text-[11px] text-red-500 text-center">{error}</p>} */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-[#8B0000] hover:bg-[#6e0000] text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200 mt-2 cursor-pointer"
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-1">
                            <div className="flex-1 h-px bg-[#e8d5c4]" />
                            <span className="text-[11px] text-[#c8a882] font-medium">
                                OR
                            </span>
                            <div className="flex-1 h-px bg-[#e8d5c4]" />
                        </div>

                        {/* Register link */}
                        <p className="text-center text-sm text-[#a07850]">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="text-[#8B0000] font-semibold hover:text-[#6e0000] transition-colors duration-200"
                            >
                                Create one
                            </Link>
                        </p>

                        {/* Continue as guest */}
                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 text-[#a07850] hover:text-[#8B0000] font-semibold text-sm"
                        >
                            Continue as a Guest
                        </Link>

                    </div>
                </div>

                {/* Back to home */}
                <p className="text-center text-[12px] text-[#a07850] mt-6">
                    <Link
                        href="/"
                        className="hover:text-[#8B0000] transition-colors duration-200"
                    >
                        ← Back to home
                    </Link>
                </p>

            </div>
        </main>
    );
}