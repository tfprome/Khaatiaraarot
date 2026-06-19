"use client";

import Image from "next/image";
import { ShoppingCartIcon, LightningIcon, HandbagIcon } from "@phosphor-icons/react";
import CHINIGURA_CHAL from "../public/Images/ChiniguraChalproducts.png";
import Mustardoil from "../public/Images/MustardOilProducts.png";
import { Product } from "../Types/Homepagetypes";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/cartSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

// const products: Product[] = [
//     {
//         id: 1,
//         name: "100% Deshi Mustard Oil",
//         unit: "1 Litre",
//         price: 300,
//         originalPrice: 350,
//         image: Mustardoil,
//         source: "Chapainawabganj",
//         isBestSelling: true,
//     },
//     {
//         id: 2,
//         name: "100% Deshi Mustard Oil",
//         unit: "5 Litre",
//         price: 1500,
//         originalPrice: 1750,
//         image: "/images/products/mustard-oil-5l.jpg",
//         source: "Chapainawabganj",
//         isBestSelling: false,
//     },
//     {
//         id: 3,
//         name: "Chinigura Chal",
//         unit: "1 kg",
//         price: 170,
//         originalPrice: 200,
//         image: CHINIGURA_CHAL,
//         source: "Chapainawabganj",
//         isBestSelling: true,
//     },
//     {
//         id: 4,
//         name: "Chinigura Chal",
//         unit: "5 kg",
//         price: 800,
//         originalPrice: 950,
//         image: "/images/products/chinigura-chal-5kg.jpg",
//         source: "Chapainawabganj",
//         isBestSelling: false,
//     },
// ];

function ProductCard({ product }: { product: Product }) {

    const dispatch = useAppDispatch();


    const handleAddToCart = () => {
        dispatch(addItem({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            unit: product.unit,
            image:
                typeof product.image === "string"
                    ? product.image
                    : product.image ? product.image : "",
        }));
        toast("Added to your cart.", {
            position: "bottom-right",
            autoClose: 1000, // 0.5 second
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            style: {
                background: "#5B1A18",
                opacity: '0.5', // dark green
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                padding: "16px",
                minWidth: "320px",
                minHeight: "70px",
                borderRadius: "12px",
            },
        });
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
            <div className="relative w-22.5 sm:w-27.5 md:w-32.5 lg:w-42.5 shrink-0 self-stretch bg-[#fdf5ee] overflow-hidden rounded-l-2xl">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2 sm:p-3 transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center px-3 sm:px-3 md:px-4 lg:px-5 py-3 md:py-4 lg:py-5 flex-1 min-w-0">

                <p className="text-[10px] lg:text-[12px] text-[#a07850] mb-0.5 font-medium truncate">
                    {product.source}
                </p>

                <h3 className="text-[12px] sm:text-[13px] md:text-sm lg:text-[15px] font-bold text-[#2c1a0e] leading-tight mb-0.5">
                    {product.name}
                </h3>

                <p className="text-[11px] lg:text-[12px] text-[#a07850] mb-1.5 md:mb-2 lg:mb-3">
                    {product.unit}
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
                    <button onClick={handleAddToCart}
                        className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] lg:text-[13px] font-semibold text-[#8B0000] border border-[#8B0000] px-2 sm:px-2.5 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#8B0000] hover:text-white transition-all duration-200 whitespace-nowrap">
                        <ShoppingCartIcon size={11} weight="bold" />
                        Add to Cart
                    </button>
                    <button className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] lg:text-[13px] font-semibold text-white bg-[#8B0000] px-2 sm:px-2.5 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#6e0000] transition-all duration-200 whitespace-nowrap">
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
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    useEffect(() => {
        const fetchProducts = async () => {
            const products = await axios.get<{ data: Product[] }>(`${BASE}/api/v1/products/top-sellers`);
            // console.log('products', products.data);
            setProducts(products.data.data.slice(0, 4)); // Take only top 4 products
        };

        fetchProducts();
    }, []);
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


