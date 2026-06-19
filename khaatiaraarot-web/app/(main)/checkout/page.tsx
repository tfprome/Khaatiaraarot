"use client";

import { useEffect, useState } from "react";
import {
    TrashSimpleIcon,
    CaretCircleDownIcon,
    CaretCircleUpIcon,
    TruckIcon,
    CreditCardIcon,
    WalletIcon,
    TagIcon,
    ShoppingBagIcon,
} from "@phosphor-icons/react";
import { CartItem } from "@/Types/cartTypes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { useAppSelector } from "@/store/hooks";
import { addItem, removeItem, updateQuantity } from "@/store/cartSlice";

type PaymentMethod = "cod" | "online" | "bkash";

const districts = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Mymensingh"];
const thanas = ["Rampura", "Mirpur", "Gulshan", "Banani", "Dhanmondi", "Motijheel", "Uttara"];

const paymentMethods = [
    { id: "cod" as PaymentMethod, label: "Cash On Delivery", Icon: TruckIcon, color: "text-green-600" },
    { id: "online" as PaymentMethod, label: "Online Payment", Icon: CreditCardIcon, color: "text-blue-600" },
    { id: "bkash" as PaymentMethod, label: "Bkash", Icon: WalletIcon, color: "text-pink-600" },
];

const paymentLogos = ["VISA", "Mastercard", "Amex", "Bkash", "Nagad", "Rocket", "Dutch-Bangla", "SSL Commerz"];

export default function CheckoutPage() {
    const [payment, setPayment] = useState<PaymentMethod>("cod");
    const [couponOpen, setCouponOpen] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [notes, setNotes] = useState("");
    const [agreed, setAgreed] = useState(true);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        district: "",
        thana: "",
        billing: "",
    });
    const router = useRouter();
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.cart.items);

    useEffect(() => {
        if (!items) return;

        if (items.length === 0) {
            router.replace("/");
        }
    }, [items]);

    const subtotal = items.reduce((sum: number, item) => sum + item.price * item.quantity, 0);

    const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Page title ── */}
            <div className="text-center pt-6 pb-2">
                <h1 className="text-xl font-semibold text-gray-800">Checkout</h1>
                <p className="text-sm text-gray-400 mt-1">
                    <span onClick={() => router.push('/')}
                        className="cursor-pointer">Home</span>
                    {" › "} <span className="text-[#5B1A18]">Checkout</span>
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-16 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── LEFT COLUMN ── */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Auth bar */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <span className="text-sm text-gray-500">Have any account? please login or register</span>
                        <div className="flex gap-2">
                            <button onClick={() => router.push('/login')} className="px-5 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                Login
                            </button>
                            <button onClick={() => router.push('/register')} className="px-5 py-2 text-sm bg-[#5B1A18] text-white rounded-lg hover:bg-[#5B1A18] transition-colors font-medium">
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Order review */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-[#5B1A18] border-l-4 border-[#5B1A18] pl-3 mb-4">
                            Order review
                        </h2>
                        <div className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 py-3">
                                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            height={40}
                                            width={40} />

                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                        {/* {item.isGift && (
                      <span className="inline-block text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-0.5">
                        Gift
                      </span>
                    )} */}
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                className="w-6 h-6 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 flex items-center justify-center text-sm leading-none"
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="text-sm w-5 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                className="w-6 h-6 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 flex items-center justify-center text-sm leading-none"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                                        ৳{(item.price * item.quantity).toLocaleString()}.00
                                    </p>
                                    <button
                                        onClick={() => dispatch(removeItem(item.id))}
                                        className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                                        aria-label={`Remove ${item.name}`}
                                    >
                                        <TrashSimpleIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-[#5B1A18] border-l-4 border-[#5B1A18] pl-3 mb-4">
                            Shipping Address
                        </h2>
                        <div className="space-y-3">
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleField}
                                placeholder="Your Full Name *"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all"
                            />
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#5B1A18] focus-within:border-[#5B1A18] transition-all">
                                <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r border-gray-200 flex-shrink-0">
                                    88
                                </span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleField}
                                    placeholder="017••••••••"
                                    className="flex-1 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleField}
                                placeholder="ex: House no. / building / street / area"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <select
                                    name="district"
                                    value={form.district}
                                    onChange={handleField}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all bg-white"
                                >
                                    <option value="">Select District</option>
                                    {districts.map((d) => <option key={d}>{d}</option>)}
                                </select>
                                <select
                                    name="thana"
                                    value={form.thana}
                                    onChange={handleField}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all bg-white"
                                >
                                    <option value="">Select Thana (Optional)</option>
                                    {thanas.map((t) => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-[#5B1A18] border-l-4 border-[#5B1A18] pl-3 mb-4">
                            Billing Address
                        </h2>
                        <input
                            type="text"
                            name="billing"
                            value={form.billing}
                            onChange={handleField}
                            placeholder="Same as shipping address"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all"
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-[#5B1A18] border-l-4 border-[#5B1A18] pl-3 mb-4">
                            Payment method
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {paymentMethods.map(({ id, label, Icon, color }) => (
                                <button
                                    key={id}
                                    onClick={() => setPayment(id)}
                                    className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${payment === id
                                        ? "border-[#5B1A18] bg-[#FBF3EC] text-gray-800"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Special Notes */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-[#5B1A18] border-l-4 border-[#5B1A18] pl-3 mb-4">
                            Special notes{" "}
                            <span className="text-gray-400 font-normal">(Optional)</span>
                        </h2>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value.slice(0, 90))}
                            placeholder="Write any special instructions for your order..."
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">{notes.length}/90 characters</p>
                    </div>
                </div>

                {/* ── RIGHT COLUMN (Order Summary) ── */}
                <div className="space-y-4">
                    {/* Coupon */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setCouponOpen(!couponOpen)}
                            className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <TagIcon className="w-4 h-4 text-[#5B1A18]" />
                                Have any coupon or gift voucher?
                            </span>
                            {couponOpen ? <CaretCircleUpIcon className="w-4 h-4" /> : <CaretCircleDownIcon className="w-4 h-4" />}
                        </button>
                        {couponOpen && (
                            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B1A18]"
                                    />
                                    <button className="px-4 py-2 bg-[#5B1A18] text-white text-sm rounded-lg hover:bg-[#5B1A18] transition-colors font-medium">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-[#5B1A18] border-l-4 border-[#5B1A18] pl-3 mb-4">
                            Order Summary
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Sub total</span>
                                <span className="text-gray-700 font-medium">{subtotal.toLocaleString()}.00 BDT</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery cost</span>
                                <span className="text-green-600 font-medium">0 BDT</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between font-semibold text-gray-800 text-base">
                                <span>Total</span>
                                <span>{subtotal.toLocaleString()}.00 BDT</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms + Place Order */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                        {/* <label className="flex items-start gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-0.5 accent-[#5B1A18] w-4 h-4 flex-shrink-0"
                            />
                            <span className="text-xs text-gray-500 leading-relaxed">
                                I have read and agreed to the{" "}
                                <a href="#" className="text-orange-500 hover:underline">Terms and Conditions</a>,{" "}
                                <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a> &{" "}
                                <a href="#" className="text-orange-500 hover:underline">Refund and Return Policy.</a>
                            </span>
                        </label> */}
                        <button
                            disabled={!agreed || items.length === 0}
                            className="w-full bg-[#5B1A18] hover:bg-[#5B1A18] disabled:bg-[#5B1A18] disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm tracking-wide"
                        >
                            PLACE ORDER
                        </button>
                    </div>

                    {/* Payment logos */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Pay With</p>
                        <div className="flex flex-wrap gap-1.5">
                            {paymentLogos.map((logo) => (
                                <span
                                    key={logo}
                                    className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-medium"
                                >
                                    {logo}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
