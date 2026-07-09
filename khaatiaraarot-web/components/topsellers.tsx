"use client";

import Image from "next/image";
import { ShoppingCartIcon, LightningIcon, HandbagIcon } from "@phosphor-icons/react";
import { Product } from "../Types/ProductTypes";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cartApi";
import {setItemCount} from "@/store/cartSlice";
import TopSellingSkeleton from "./skeleton/topsellingskeleton";

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

function ProductCard({ product }: { product: Product }) {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch();
    const router = useRouter()


    const handleAddToCart = async (
        id: string,
        quantity: number
    ) => {
        try {
            setLoading(true);

            const res = await addToCart(id, quantity);

            dispatch(setItemCount(res.data.itemCount));

            toast.success("Added to your cart.", {
                position: "top-center",
                autoClose: 1000, // 0.5 second
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                className: 'cart-success-toast'
            });
        } catch (error) {
            toast.error("Failed to add item", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                className: "error-toast"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async (id: string, quantity: number) => {
        try {
            setLoading(true);

            // same as add to cart (reuse backend logic)
            //await addToCart(id, quantity);
            localStorage.setItem(
            "buyNowItem",
            JSON.stringify({
                product: {
                    id: product.id,
                    name: product.name,
                    slug: product.slug ?? product.id,
                    unit: product.unit,
                    price: product.price,
                    originalPrice: product.originalPrice ?? null,
                    stockQty: product.stockQty ?? 1,
                    images: product.image ? [product.image] : [],
                },
                quantity,
            })
        );
            router.push("/checkout?mode=buy-now");

        } catch (error) {
            toast.error("Failed to process Buy Now", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                className: "error-toast"
            });
        } finally {
            setLoading(false);
        }
    };

    const saving = product.originalPrice
        ? product.originalPrice - product.price
        : 0;

    return (
        <div className="relative bg-white rounded-2xl border border-[#e8d5c4] overflow-hidden flex flex-row items-center hover:shadow-md transition-shadow duration-200">

            {/* Best Selling badge */}
            {product.isBestSelling && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-[#8B0000] text-white text-[9px] lg:text-[10px] font-semibold px-2 py-0.5 lg:py-1 rounded-full">
                    <LightningIcon size={9} weight="fill" />
                    <span className="hidden sm:inline md:hidden lg:inline">Best Selling</span>
                    <span className="sm:hidden lg:hidden">Best Selling</span>
                </div>
            )}

            {/* Image */}
            <div onClick={() => { router.push(`/shop/${product.id}`) }}
                className="relative w-22.5 sm:w-27.5 md:w-32.5 lg:w-42.5 shrink-0 self-stretch cursor-pointer bg-[#fdf5ee] overflow-hidden rounded-l-2xl">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-2 sm:p-3 transition-transform duration-300 hover:scale-105"
                    />) : (getInitial(product.name))
                }
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center px-3 sm:px-3 md:px-4 lg:px-5 py-3 md:py-4 lg:py-5 flex-1 min-w-0">

                <p className="text-[10px] lg:text-[12px] text-[#a07850] mb-0.5 font-medium truncate">
                    {product.sourceRegion}
                </p>

                <h3 className="text-[12px] sm:text-[13px] md:text-sm lg:text-[15px] font-bold text-[#2c1a0e] leading-tight mb-0.5">
                    {product.name}
                </h3>

                <p className="text-[11px] lg:text-[12px] text-[#a07850] mb-1.5 md:mb-2 lg:mb-3">
                    {/\d/.test(product.unit) ? product.unit : `1 ${product.unit}`}
                </p>

                {/* Price */}
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-sm md:text-base lg:text-lg font-bold text-[#8B0000]">
                        ৳{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                        <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Save badge */}
                <div className="inline-block mb-2 lg:mb-4">
                    <span
                        className={`w-fit text-[10px] font-semibold text-[#BA7517] bg-[#faf5e4] border border-[#eedfa0] px-2 py-0.5 rounded-full  ${saving > 0 ? "visible" : "invisible"
                            }`}
                    >
                        Save ৳{saving || 0}
                    </span>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
                    <button onClick={() => { handleAddToCart(product.id, 1) }}
                        disabled={loading}
                        className="group flex items-center justify-center gap-1 text-[10px] 
                        sm:text-[11px] lg:text-[13px] font-semibold text-[#8B0000] border border-[#8B0000] px-2 cursor-pointer disabled:cursor-progress
                        sm:px-2.5 lg:px-4 py-1.5 sm:py-2 rounded-lg  transition-all duration-200 whitespace-nowrap">
                        <ShoppingCartIcon size={11} weight="bold" className="transition-transform duration-200 group-hover:scale-120" />
                        Add to Cart
                    </button>
                    <button
                        onClick={() => handleBuyNow(product.id, 1)}
                        disabled={loading}
                        className="flex items-center justify-center gap-1 cursor-pointer disabled:cursor-progress text-[10px] sm:text-[11px] lg:text-[13px] font-semibold text-white bg-[#8B0000] px-2 sm:px-2.5 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#6e0000] transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                    >
                        <HandbagIcon size={11} weight="bold" />
                        Buy now
                    </button>
                </div>

            </div>
        </div>
    );
}

export default function TopSellingProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    useEffect(() => {
        const fetchProducts = async () => {
            try {setLoading(true);
            const products = await axios.get<{ data: Product[] }>(`${BASE}/api/v1/products/top-sellers`);
            // console.log('products', products.data);
            setProducts(products.data.data.slice(0, 4)); // Take only top 4 products
            } catch (error) {
                console.error("Error fetching top selling products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <TopSellingSkeleton />;
    }
    return (
        <section className="bg-white py-8 sm:py-10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#2c1a0e]">
                        Top Selling Products
                    </h2>
                    <p className="text-sm text-[#a07850] mt-2">
                        Our customers&apos; most loved picks
                    </p>
                    <div className="mx-auto mt-3 w-12 h-0.5 rounded-full bg-[#8B0000]" />
                </div>

                {/* Grid — 1 col mobile, 2 col sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {products.map((product) => (product.isBestSelling && (
                        <ProductCard key={product.id} product={product} />)
                    ))}
                </div>

            </div>
        </section>
    );
}


