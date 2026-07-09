"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Category } from "@/Types/ProductTypes";
import CategorySkeleton from "./skeleton/categoriesSkeleton";

// Initials generator for when there is no image
function getInitial(name: string) {
  const initials = name
    ?.trim()
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#2c1a0e]/30 bg-[#fdf5ee]">
      {initials}
    </div>
  );
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE}/api/v1/categories`);
        // Sort by sortOrder just in case the backend doesn't return them in order
        const sorted = res.data.data.sort((a: Category, b: Category) => a.sortOrder - b.sortOrder);
        setCategories(sorted);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
       finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if(loading) {
    return <CategorySkeleton />;
  }

  return (
    <section className="bg-[#fdf5ee] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2c1a0e] leading-tight">
            Featured Categories
          </h2>
          <p className="text-sm text-[#a07850] mt-2">
            Pure & locally sourced — straight from the farm
          </p>
          <div className="mx-auto mt-3 w-12 h-0.5 rounded-full bg-[#8B0000]" />
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map(({ name, nameBn, slug, imageUrl, productCount }) => (
            <Link
              key={slug}
              href={`/shop/category/${slug}`}
              className="group flex flex-col items-center text-center bg-white border border-[#e8d5c4] rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              {/* Image area */}
              <div className="relative w-full aspect-square overflow-hidden bg-[#fdf5ee]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  getInitial(name)
                )}
              </div>

              {/* Text area */}
              <div className="w-full px-3 py-3 sm:py-4">
                <p className="text-[13px] sm:text-sm font-semibold text-[#2c1a0e] leading-tight">
                  {name}
                </p>
                <p className="text-[11px] text-[#a07850] mt-0.5">{nameBn}</p>
                <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#fdf5ee] text-[#8B0000] border border-[#f2d5c4]">
                  {productCount} item{productCount !== 1 ? "s" : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── View all — centered below cards ── */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B0000] border border-[#8B0000] px-6 py-2.5 rounded-xl hover:bg-[#8B0000] hover:text-white transition-all duration-200"
          >
            View all categories
            <ArrowRightIcon size={16} weight="bold" />
          </Link>
        </div>

      </div>
    </section>
  );
}