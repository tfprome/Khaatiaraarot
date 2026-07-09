"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    EnvelopeSimpleIcon,
    ArrowLeftIcon,
    LockIcon,
    CheckCircleIcon,
    SpinnerGapIcon,
} from "@phosphor-icons/react";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/Images/khatiarotlogo-removebg.png";
import ClipLoader from "react-spinners/ClipLoader";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function ForgotPasswordPage() {
    const router = useRouter();

    // Steps: 1 = Email, 2 = OTP, 3 = New Password
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // --- STEP 1: SEND OTP ---
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return toast.error("Please enter your email");

        try {
            setLoading(true);
            // TODO: Replace with your actual backend endpoint
            await axios.post(`${BASE}/api/v1/auth/forgot-password`, { email });

            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send OTP");
        }
        finally {
            setLoading(false);
        }
    };

    // --- STEP 2: VERIFY OTP ---
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp.trim()) return toast.error("Please enter the OTP");

        try {
            setLoading(true);
            // TODO: Replace with your actual backend endpoint
            await axios.post(`${BASE}/api/v1/auth/verify-otp`, { email, otp });

            toast.success("OTP Verified successfully!");
            setStep(3);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 3: RESET PASSWORD ---
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

        try {
            setLoading(true);
            // TODO: Replace with your actual backend endpoint
            await axios.post(`${BASE}/api/v1/auth/reset-password`, {
                email,
                otp,
                newPassword
            });

            toast.success("Password reset successfully! Please login.");
            router.push("/login");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 pb-12">

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
            <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">



                {/* Header */}
                <div className="px-8 pt-8 pb-4 border-b border-stone-100 text-center">
                    <div className="mx-auto w-14 h-14 bg-[#FBF3EC] rounded-full flex items-center justify-center mb-4">
                        <LockIcon size={28} weight="fill" className="text-[#5B1A18]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#2c1a0e]">
                        {step === 1 && "Forgot Password?"}
                        {step === 2 && "Verify OTP"}
                        {step === 3 && "Set New Password"}
                    </h1>
                    <p className="text-sm text-stone-500 mt-2">
                        {step === 1 && "No worries, we'll send you reset instructions."}
                        {step === 2 && `We sent a code to ${email}`}
                        {step === 3 && "Create a new password for your account."}
                    </p>
                </div>

                {/* Forms Container */}
                <div className="p-8">

                    {/* --- STEP 1: EMAIL INPUT --- */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <EnvelopeSimpleIcon
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#5B1A18] hover:bg-[#4a1512] text-white cursor-pointer font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? <ClipLoader size={14} color="white" /> : "Send Reset Code"}
                            </button>
                        </form>
                    )}

                    {/* --- STEP 2: OTP INPUT --- */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
                                    One-Time Password
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    required
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-center tracking-[0.3em] font-bold focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] outline-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#5B1A18] hover:bg-[#4a1512] text-white cursor-pointer font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? <ClipLoader size={14} color="white" /> : "Verify Code"}
                            </button>

                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full text-sm text-[#5B1A18] font-medium hover:underline disabled:opacity-50"
                            >
                                Didn't receive a code? Resend
                            </button>
                        </form>
                    )}

                    {/* --- STEP 3: NEW PASSWORD --- */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    required
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    required
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] outline-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#5B1A18] hover:bg-[#4a1512] text-white cursor-pointer font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? <ClipLoader size={14} color="white" /> : "Reset Password"}
                            </button>
                        </form>
                    )}

                    {/* Back to Login Link */}
                    <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-sm text-stone-500">
                        <ArrowLeftIcon size={14} />
                        <Link href="/login" className="font-medium text-[#5B1A18] hover:underline">
                            Back to login
                        </Link>
                    </div>
                </div>

                {/* Success Banner for Step 3 (Optional visual flair) */}
                {step === 3 && (
                    <div className="bg-green-50 border-t border-green-100 px-8 py-3 flex items-center justify-center gap-2 text-green-700 text-sm font-medium">
                        <CheckCircleIcon size={18} weight="fill" />
                        Identity Verified Successfully
                    </div>
                )}
            </div>
        </div>
    );
}