"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, SlidersHorizontal, ArrowLeft } from "lucide-react";
import axios from "axios";
import { Product, Category } from "@/Types/ProductTypes";
import { ProductCard } from "../../../shop/page"; // The component you extracted
import PaginationControls from "@/components/pagination/paginationcontrol";
import ProductsPageSkeleton from "@/components/skeleton/shopSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.categoryslug as string;
  console.log("Category slug from params:", slug);

  const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  // States
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Pagination & Sort
  const [page, setPage] = useState(1);
  const [limit] = useState(2); // Show more items per page for category view
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");

  const totalPages = Math.ceil(total / limit);

  // 1. Fetch Category Details & Products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all categories to find the matching name/slug
        const matchedCategory = await axios.get(`${BASE}/api/v1/categories/${slug}`);
        console.log("Matched category data:", matchedCategory);
        if (!matchedCategory.data.data) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setCategory(matchedCategory.data.data);

        // Fetch products for this specific category
        const prodRes = await axios.get(
          `${BASE}/api/v1/products?page=${page}&limit=${limit}&sort=${sortBy}&category=${slug}`
        );

        setProducts(prodRes.data.data);
        setTotal(prodRes.data.meta.total);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug, page, sortBy]);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Reset to page 1 when sorting changes
  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="h-48 sm:h-56 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductsPageSkeleton />
        </div>
      </div>
    );
  }

  // --- NOT FOUND STATE ---
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center text-stone-400">
        <span className="text-5xl mb-4">🛒</span>
        <p className="text-xl font-medium text-stone-700">Category Not Found</p>
        <p className="text-sm mt-2">The category you are looking for doesn't exist.</p>
        <button
          onClick={() => router.push("/shop")}
          className="mt-6 px-6 py-2.5 bg-[#5A1B18] text-white rounded-xl text-sm font-semibold hover:bg-[#4a1512] transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-serif">

      {/* ── Clean, Integrated Header ── */}
      {/* pt-24/pt-32 pulls it up directly under the navbar. No bg/border blends it seamlessly. */}
      <div className="pt-5 pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

            {/* Left: Category Name */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2c1a0e] tracking-tight">
                {category?.name}
              </h1>
              <p className="text-base sm:text-lg text-[#a07850] mt-1 font-medium">
                {category?.nameBn}
              </p>
            </div>

            {/* Right: Breadcrumb (Aligned to the right on sm+) */}
            <div className="flex items-center gap-1.5 text-xs text-stone-400 sm:text-right flex-shrink-0 pt-1.5 sm:pt-2">
              <button
                onClick={() => router.push("/")}
                className="hover:text-[#5A1B18] transition-colors"
              >
                Home
              </button>
              <ChevronRight size={12} className="text-stone-300" />
              <button
                onClick={() => router.push("/shop")}
                className="hover:text-[#5A1B18] transition-colors"
              >
                Shop
              </button>
              <ChevronRight size={12} className="text-stone-300" />
              <span className="text-stone-700 font-medium">{category?.name}</span>
            </div>
          </div>

          {/* Controls Row: Count & Sort */}
          {/* Subtle top border to separate header from the grid below */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-stone-200/60">
            <p className="text-xs text-stone-400">
              Showing <span className="font-semibold text-stone-600">{products.length}</span> of{" "}
              <span className="font-semibold text-stone-600">{total}</span> products
            </p>

            {/* Sort Dropdown - given a white bg so it stands out against the transparent header */}
            {/* ── Custom Animated Sort Dropdown ── */}
            <div ref={sortRef} className="relative">
              {/* Trigger Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full sm:w-auto"
              >
                <SlidersHorizontal size={16} className="text-stone-500 flex-shrink-0" />
                <span className="text-sm font-medium text-stone-700 flex-1 sm:flex-initial text-left truncate">
                  {sortBy === "newest" && "Newest First"}
                  {sortBy === "price_asc" && "Price: Low to High"}
                  {sortBy === "price_desc" && "Price: High to Low"}
                </span>

                {/* Animated Arrow using Phosphor Icon */}
                <motion.span
                  animate={{ rotate: isSortOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-stone-400 flex-shrink-0 flex items-center"
                >
                  <CaretDown size={16} weight="bold" />
                </motion.span>
              </motion.button>

              {/* Dropdown Menu (Animated) */}
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-full left-0 right-0 sm:right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden z-50 origin-top"
                  >
                    {/* Option 1 */}
                    <button
                      onClick={() => { setSortBy("newest"); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${sortBy === "newest" ? "bg-[#FBF3EC] text-[#5A1B18] font-semibold" : "text-stone-600 hover:bg-stone-50"
                        }`}
                    >
                      Newest First
                      {sortBy === "newest" && <span className="text-[#5A1B18] text-xs">✓</span>}
                    </button>

                    <div className="h-px bg-stone-100" />

                    {/* Option 2 */}
                    <button
                      onClick={() => { setSortBy("price_asc"); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${sortBy === "price_asc" ? "bg-[#FBF3EC] text-[#5A1B18] font-semibold" : "text-stone-600 hover:bg-stone-50"
                        }`}
                    >
                      Price: Low to High
                      {sortBy === "price_asc" && <span className="text-[#5A1B18] text-xs">✓</span>}
                    </button>

                    <div className="h-px bg-stone-100" />

                    {/* Option 3 */}
                    <button
                      onClick={() => { setSortBy("price_desc"); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${sortBy === "price_desc" ? "bg-[#FBF3EC] text-[#5A1B18] font-semibold" : "text-stone-600 hover:bg-stone-50"
                        }`}
                    >
                      Price: High to Low
                      {sortBy === "price_desc" && <span className="text-[#5A1B18] text-xs">✓</span>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        {/* Back button for mobile (Hidden on desktop) */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-xs font-medium text-[#5A1B18] border border-[#5A1B18] px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={category ? [category] : []}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-stone-400 bg-white rounded-2xl border border-stone-100">
            <span className="text-5xl mb-4">📦</span>
            <p className="text-base font-medium text-stone-600">No products in this category yet</p>
            <p className="text-sm mt-1">Check back later or browse other categories.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10">
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </main>
    </div>
  )
};