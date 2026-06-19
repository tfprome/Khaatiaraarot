"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import {
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
  EnvelopeSimpleIcon,
  UserIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import logo from "../../public/Images/khatiarotlogo-removebg.png";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

// ── Zod Schema ──────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name must be under 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

    phone: z
      .string()
      .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number")
      .optional()
      .or(z.literal("")),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be under 50 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
const refinedschema = registerSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// ── Types ────────────────────────────────────────────────────────────────────

type FormData = z.infer<typeof registerSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

// ── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // validate single field on change to clear error as user types
    const fieldSchema = registerSchema.pick({
      [name]: true,
    } as Record<keyof FormData, true>);

    const result = fieldSchema.safeParse({ [name]: value });
    if (result.success) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const result = refinedschema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FormData;

        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    // if (!agreed) {
    //   alert("Please agree to the Terms of Use and Privacy Policy");
    //   return;
    // }

    setLoading(true);
    setApiError('');
    try {
      const res = await fetch(`${BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: result.data.email, password: result.data.password, fullName: result.data.fullName, phone: result.data.phone || undefined }),
      });
      const json = await res.json() as { success?: boolean; data?: { accessToken: string; user: { role: string; fullName: string } }; error?: { message?: string } };
      if (!res.ok) {
        toast.error(json.error?.message ?? "Registration failed.Please try again", {
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
        throw new Error(json.error?.message ?? 'Registration failed');
      }
      localStorage.setItem('userToken', json.data!.accessToken);
      localStorage.setItem('userName', json.data!.user.fullName);

      toast("Welcome to the family!", {
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
      setApiError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Input wrapper class helper ────────────────────────────────────────────

  const inputWrapClass = (field: keyof FormData): string =>
    [
      "flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:bg-white transition-all duration-200",
      errors[field]
        ? "border-red-400 bg-red-50"
        : "border-[#e8d5c4] focus-within:border-[#8B0000]",
    ].join(" ");

  return (
    <main className="min-h-screen bg-[#fdf5ee] flex items-center justify-center px-4 py-12">
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
              Create an account
            </h2>
            <p className="text-sm text-center text-[#a07850] mt-1">
              Join us and shop fresh from the farm
            </p>
            <div className="mt-3 mx-auto w-10 h-0.5 rounded-full bg-[#8B0000]" />
          </div>

          <div className="flex flex-col gap-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="fullName"
                className="text-[12px] font-semibold text-[#2c1a0e] uppercase tracking-wide"
              >
                Full Name
              </label>
              <div className={inputWrapClass("fullName")}>
                <UserIcon size={17} weight="fill" className="text-[#a07850] shrink-0" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Rahim Uddin"
                  className="flex-1 bg-white text-sm text-[#2c1a0e] placeholder-[#c8a882] outline-none"
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="phone"
                className="text-[12px] font-semibold text-[#2c1a0e] uppercase tracking-wide"
              >
                Phone Number <span className="text-[#a07850] normal-case font-normal">(optional)</span>
              </label>
              <div className={inputWrapClass("phone")}>
                <PhoneIcon size={17} weight="fill" className="text-[#a07850] shrink-0" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 170-000-0000"
                  className="flex-1 bg-white text-sm text-[#2c1a0e] placeholder-[#c8a882] outline-none"
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[12px] font-semibold text-[#2c1a0e] uppercase tracking-wide"
              >
                Email Address
              </label>
              <div className={inputWrapClass("email")}>
                <EnvelopeSimpleIcon size={17} weight="fill" className="text-[#a07850] shrink-0" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="flex-1 bg-white text-sm text-[#2c1a0e] placeholder-[#c8a882] outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[12px] font-semibold text-[#2c1a0e] uppercase tracking-wide"
              >
                Password
              </label>
              <div className={inputWrapClass("password")}>
                <LockKeyIcon size={17} weight="fill" className="text-[#a07850] shrink-0" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
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
              {errors.password && (
                <p className="text-[11px] text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-[12px] font-semibold text-[#2c1a0e] uppercase tracking-wide"
              >
                Confirm Password
              </label>
              <div className={inputWrapClass("confirmPassword")}>
                <LockKeyIcon size={17} weight="fill" className="text-[#a07850] shrink-0" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="flex-1 bg-white text-sm text-[#2c1a0e] placeholder-[#c8a882] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="text-[#a07850] hover:text-[#8B0000] transition-colors duration-200 shrink-0 cursor-pointer"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeSlashIcon size={17} weight="fill" />
                  ) : (
                    <EyeIcon size={17} weight="fill" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            {apiError && <p className="text-[11px] text-red-500 text-center">{apiError}</p>}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#8B0000] hover:bg-[#6e0000] disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200 mt-2 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <ClipLoader size={14} color="white" />
                  <span className="ml-2">Creating account…</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#e8d5c4]" />
              <span className="text-[11px] text-[#c8a882] font-medium">OR</span>
              <div className="flex-1 h-px bg-[#e8d5c4]" />
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-[#a07850]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#8B0000] font-semibold hover:text-[#6e0000] transition-colors duration-200">
                Sign in
              </Link>
            </p>

            {/* Continue as guest */}
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 text-[#a07850] hover:text-[#8B0000] font-semibold text-sm transition-colors duration-200"
            >
              Continue as a Guest
            </Link>

          </div>
        </div>

        {/* Back to home */}
        <p className="text-center text-[12px] text-[#a07850] mt-6">
          <Link href="/" className="hover:text-[#8B0000] transition-colors duration-200">
            ← Back to home
          </Link>
        </p>

      </div>
    </main>
  );
}