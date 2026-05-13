"use client";

import Image from "next/image";
import { ShoppingCart, Lightning } from "@phosphor-icons/react";
import type { ImageProps } from "next/image";
import CHINIGURA_CHAL from "../public/images/Chinigura Chal products.png"
import Mustardoil from "../public/images/Mustard Oil Products.png"

type Product = {
    id: number;
    name: string;
    unit: string;
    price: number;
    originalPrice?: number;
    image: ImageProps["src"];
    source: string;
    isBestSelling?: boolean;
};

const products: Product[] = [
    {
        id: 1,
        name: "100% Deshi Mustard Oil",
        unit: "1 Litre",
        price: 300,
        originalPrice: 350,
        image: Mustardoil,
        source: "Chapainawabganj",
        isBestSelling: true,
    },
    {
        id: 2,
        name: "100% Deshi Mustard Oil",
        unit: "5 Litre",
        price: 1500,
        originalPrice: 1750,
        image: "/images/products/mustard-oil-5l.jpg",
        source: "Chapainawabganj",
        isBestSelling: false,
    },
    {
        id: 3,
        name: "Chinigura Chal",
        unit: "1 kg",
        price: 170,
        originalPrice: 200,
        image: CHINIGURA_CHAL,
        source: "Chapainawabganj",
        isBestSelling: true,
    },
    {
        id: 4,
        name: "Chinigura Chal",
        unit: "5 kg",
        price: 800,
        originalPrice: 950,
        image: "/images/products/chinigura-chal-5kg.jpg",
        source: "Chapainawabganj",
        isBestSelling: false,
    },
];

function ProductCard({ product }: { product: Product }) {
    const saving = product.originalPrice
        ? product.originalPrice - product.price
        : 0;

    return (
        <div className="relative bg-white rounded-2xl border border-[#e8d5c4] overflow-hidden flex flex-row items-center gap-0 hover:shadow-md transition-shadow duration-200">

            {/* Best Selling badge */}
            {product.isBestSelling && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#8B0000] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <Lightning size={10} weight="fill" />
                    Best Selling
                </div>
            )}

            {/* Image — left side */}
            <div className="group relative w-[120px] sm:w-[140px] md:w-[160px] shrink-0 self-stretch bg-[#fdf5ee]">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover p-3 transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Content — right side */}
            <div className="flex flex-col justify-center px-4 py-4 flex-1 min-w-0">
                <p className="text-[11px] text-[#a07850] mb-1 font-medium">
                    {product.source}
                </p>

                <h3 className="text-sm sm:text-[15px] font-bold text-[#2c1a0e] leading-tight mb-0.5">
                    {product.name}
                </h3>

                <p className="text-[12px] text-[#a07850] mb-3">
                    {product.unit}
                </p>

                {/* Price row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-[#8B0000]">
                        ৳{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                        <span className="text-[12px] text-gray-400 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Save badge */}
                {saving > 0 && (
                    <span className="inline-block w-fit text-[11px] font-semibold text-[#BA7517] bg-[#faf5e4] border border-[#eedfa0] px-2.5 py-0.5 rounded-full mb-4">
                        Save ৳{saving}
                    </span>
                )}

                {/* Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-[#8B0000] border border-[#8B0000] px-3 sm:px-4 py-2 rounded-lg hover:bg-[#8B0000] hover:text-white transition-all duration-200">
                        <ShoppingCart size={14} weight="bold" />
                        Add to Cart
                    </button>
                    <button className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-white bg-[#8B0000] px-3 sm:px-4 py-2 rounded-lg hover:bg-[#6e0000] transition-all duration-200">
                        <Lightning size={14} weight="fill" />
                        Buy now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TopSellingProducts() {
    return (
        <section className="bg-white py-10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* ── Header ── */}
                <div className="text-center mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2c1a0e]">
                        Top Selling Products
                    </h2>
                    <p className="text-sm text-[#a07850] mt-2">
                        Our customers' most loved picks
                    </p>
                    <div className="mx-auto mt-3 w-12 h-0.5 rounded-full bg-[#8B0000]" />
                </div>

                {/* ── 2-column grid of product cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((product) => (product.isBestSelling &&
                        (<ProductCard key={product.id} product={product} />)
                    ))}
                </div>

            </div>
        </section>
    );
}