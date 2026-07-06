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
    DeviceMobileIcon,
} from "@phosphor-icons/react";
import { CartItem } from "@/Types/cartTypes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchCart, updateCartItem, deleteCartItem } from "@/lib/cartApi";
import { createOrder } from "@/lib/orderApi";
import { toast } from 'react-toastify'
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@/zodvalidations/checkoutschema";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setItemCount } from "@/store/cartSlice";
import { getBuyNowItem, clearBuyNowItem } from "@/lib/cartApi";
import { useSearchParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

type PaymentMethod = "cash" | "online" | "bkash";

const paymentMethods = [
    { id: "cash" as PaymentMethod, label: "Cash On Delivery", Icon: TruckIcon },
    { id: "card" as PaymentMethod, label: "Online Payment", Icon: CreditCardIcon },
    { id: "bkash" as PaymentMethod, label: "Bkash", Icon: WalletIcon },
    { id: "nagad" as PaymentMethod, label: "Nagad", Icon: DeviceMobileIcon },
];

const paymentLogos = ["VISA", "Mastercard", "Amex", "Bkash", "Nagad", "Rocket", "Dutch-Bangla", "SSL Commerz"];

function getInitial(name: string) {
    const initials = name
        ?.trim()
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

    return (
        <div className="w-full h-full flex items-center justify-center text-black font-bold text-lg sm:text-xl">
            {initials}
        </div>
    );
}

export default function CheckoutPage() {
    const [payment, setPayment] = useState<PaymentMethod>("cash");
    const [couponOpen, setCouponOpen] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [notes, setNotes] = useState("");
    const [agreed, setAgreed] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            district: "",
            city: "",
            billing: "",
            postalCode: "",
        },
    });
    const [cart, setCart] = useState<CartItem[]>([])
    const router = useRouter();
    //console.log('form',form)
    const { isAuthenticated } = useAppSelector(
        (state) => state.auth
    );
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const idempotencyKey = useRef<string>(crypto.randomUUID());
    const searchParams = useSearchParams();
    const isBuyNow = searchParams.get("mode") === "buy-now";

    const handlePlaceOrder = async (form: CheckoutFormData) => {
        try {
            setPlacingOrder(true);

            const payload: Parameters<typeof createOrder>[0] = {
                paymentMethod: payment,
                notes,
                address: {
                    fullName: form.name,
                    phone: form.phone,
                    line1: form.address,
                    line2: form.billing,
                    city: form.city,
                    district: form.district,
                    postalCode: form.postalCode,
                },
            };

            if (isBuyNow) {
                const buyNowItem = getBuyNowItem();
                if (buyNowItem) {
                    payload.items = [{ productId: buyNowItem.product.id, quantity: buyNowItem.quantity }];
                }
            }

            const res = await createOrder(payload, idempotencyKey.current);

            if (isBuyNow) clearBuyNowItem();
            toast.success("Order placed successfully!");
            idempotencyKey.current = crypto.randomUUID();

            router.push(`/orderdetails/${res.data.data.id}`);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to place order", {
                hideProgressBar: true,
                className: "error-toast"
            }
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    useEffect(() => {
        const loadCart = async () => {
            try {
                if (isBuyNow) {
                    const buyNowItem = getBuyNowItem();
                    if (!buyNowItem) {
                        router.replace("/");
                        return;
                    }
                    setCart([{
                        id: "buy-now",
                        quantity: buyNowItem.quantity,
                        product: {
                            id: buyNowItem.product.id,
                            name: buyNowItem.product.name,
                            slug: buyNowItem.product.slug,
                            unit: buyNowItem.product.unit,
                            price: buyNowItem.product.price,
                            originalPrice: buyNowItem.product.originalPrice,
                            stockQty: buyNowItem.product.stockQty,
                            image: buyNowItem.product.images?.[0] ?? null,
                        },
                    }] as CartItem[]);
                    setLoading(false);
                    return;
                }
                const res = await fetchCart();
                setCart(res.data.items);
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message || "Failed to place order", {
                    hideProgressBar: true,
                    className: "error-toast"
                }
                );
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, []);

    useEffect(() => {
        if (loading) return;

        if (cart.length === 0) {
            router.replace("/");
        }
    }, [loading, cart, router]);

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            handleDeleteItem(productId);
            return;
        }
        const previousCart = cart;

        setCart((prev) =>
            prev.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );

        try {
            const res = await updateCartItem(productId, quantity);
            dispatch(setItemCount(res.data.itemCount));
        } catch (error) {
            // rollback on failure
            setCart(previousCart);
            console.error("Failed to update cart item", error);
        }
    };

    const handleDeleteItem = async (productId: string) => {
        const previousCart = cart;
        try {
            const res = await deleteCartItem(productId);
            setCart((prev) =>
                prev.filter((item) => item.product.id !== productId)
            );
            //console.log(res);
            dispatch(setItemCount(res.data.data.itemCount));
        } catch (error: any) {
            setCart(previousCart);
            console.error("Failed to delete cart item", error);
        }
    };


    const subtotal = cart.reduce((sum: number, item) => sum + item.product.price * item.quantity, 0);

    // const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    //     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // };

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
                    {!isAuthenticated && (<div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <span className="text-sm text-gray-500">Have any account? please login or register</span>
                        <div className="flex gap-2">
                            <button onClick={() => router.push('/login')} className="px-5 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                Login
                            </button>
                            <button onClick={() => router.push('/register')} className="px-5 py-2 text-sm bg-[#5B1A18] text-white rounded-lg hover:bg-[#5B1A18] transition-colors font-medium">
                                Register
                            </button>
                        </div>
                    </div>)}

                    {/* Order review */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-[#5B1A18] border-l-4 border-[#5B1A18] pl-3 mb-4">
                            Order review
                        </h2>
                        <div className="divide-y divide-gray-100">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 py-3">
                                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                        {item.product.image ?
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                height={40}
                                                width={40} /> : (getInitial(item.product.name))}

                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            {!isBuyNow && (
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                                    className="w-6 h-6 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 flex items-center justify-center text-sm leading-none"
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                            )}
                                            <span className="text-sm w-5 text-center font-medium">{item.quantity}</span>
                                            {!isBuyNow && (
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                                    className="w-6 h-6 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 flex items-center justify-center text-sm leading-none"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                                        ৳{(item.product.price * item.quantity).toLocaleString()}.00
                                    </p>
                                    {!isBuyNow && (
                                        <button
                                            onClick={() => handleDeleteItem(item.product.id)}
                                            className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                                            aria-label={`Remove ${item.product.name}`}
                                        >
                                            <TrashSimpleIcon className="w-4 h-4" />
                                        </button>
                                    )}
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
                            <div>
                                <input
                                    {...register("name")}
                                    placeholder="Your Full Name *"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all"
                                />
                                <p
                                    className={`text-red-500 text-xs mt-1 h-2 ${!errors.name ? "invisible" : ""}`}
                                >
                                    {errors.name?.message || "placeholder"}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#5B1A18] focus-within:border-[#5B1A18] transition-all">
                                        <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r border-gray-200 flex-shrink-0">
                                            88
                                        </span>
                                        <input
                                            {...register("phone")}
                                            placeholder="017••••••••"
                                            className="flex-1 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none"
                                        />
                                    </div>
                                    <p
                                        className={`text-red-500 text-xs mt-1 h-2 ${!errors.phone ? "invisible" : ""}`}
                                    >
                                        {errors.phone?.message || "placeholder"}
                                    </p>
                                </div>
                                <div>
                                    <input
                                        {...register("postalCode")}
                                        placeholder="Enter your postal code"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all"
                                    />
                                    <p
                                        className={`text-red-500 text-xs mt-1 h-2 ${!errors.postalCode ? "invisible" : ""}`}
                                    >
                                        {errors.postalCode?.message || "placeholder"}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <input
                                    {...register("address")}
                                    placeholder="ex: House no. / building / street / area"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all"
                                />
                                <p
                                    className={`text-red-500 text-xs mt-1 h-2 ${!errors.address ? "invisible" : ""}`}
                                >
                                    {errors.address?.message || "placeholder"}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <input
                                        {...register("district")}
                                        placeholder="Enter district"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all bg-white"
                                    />
                                    <p
                                        className={`text-red-500 text-xs mt-1 h-2 ${!errors.district ? "invisible" : ""}`}
                                    >
                                        {errors.district?.message || "placeholder"}
                                    </p>
                                </div>
                                {/* <option value="">Select District</option>
                                    {districts.map((d) => <option key={d}>{d}</option>)} */}
                                <div>
                                    <input
                                        {...register("city")}
                                        placeholder="Enter city"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all bg-white"
                                    />
                                    <p
                                        className={`text-red-500 text-xs mt-1 h-2 ${!errors.city ? "invisible" : ""}`}
                                    >
                                        {errors.city?.message || "placeholder"}
                                    </p>
                                </div>
                                {/* <option value="">Select Thana (Optional)</option>
                                    {thanas.map((t) => <option key={t}>{t}</option>)} */}
                            </div>
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-[#5B1A18] border-l-4 border-[#5B1A18] pl-3 mb-4">
                            Billing Address
                        </h2>
                        <input
                            {...register("billing")}
                            placeholder="Same as shipping address"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B1A18] focus:border-[#5B1A18] transition-all"
                        />
                        <p
                            className={`text-red-500 text-xs mt-1 h-2 ${!errors.billing ? "invisible" : ""}`}
                        >
                            {errors.billing?.message || "placeholder"}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-[#5B1A18] border-l-4 border-[#5B1A18] pl-3 mb-4">
                            Payment method
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {paymentMethods.map(({ id, label, Icon }) => (
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
                            onClick={handleSubmit(handlePlaceOrder)}
                            disabled={!agreed || cart.length === 0 || placingOrder}
                            className="w-full bg-[#5B1A18] hover:bg-[#5B1A18] disabled:bg-[#5B1A18] cursor-pointer disabled:cursor-progress text-white font-semibold py-3.5 rounded-xl transition-colors text-sm tracking-wide"
                        >
                            {placingOrder ? (
                                <div className="flex items-center justify-center">
                                    <ClipLoader size={14} color="white" />
                                    <span className="ml-2">Placing order…</span>
                                </div>
                            ) : (
                                "Place Order"
                            )}
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
