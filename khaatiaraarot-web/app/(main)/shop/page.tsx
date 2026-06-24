// app/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Product } from "@/Types/ProductTypes";
import axios from "axios";
import { ChevronDown, MapPinHouse } from "lucide-react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { Category } from "@/Types/ProductTypes";
import { addToCart } from "@/lib/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

function getDiscount(price: number, originalPrice: number | null): number | null {
  if (!originalPrice) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function StockIndicator({ qty }: { qty: number }) {
  if (qty > 200) return <span className="text-xs text-emerald-600 font-medium">In Stock</span>;
  if (qty > 60) return <span className="text-xs text-amber-600 font-medium">Limited Stock</span>;
  if (qty > 0) return <span className="text-xs text-red-500 font-medium">Low Stock</span>;
  if (qty === 0) return <span className="text-xs text-red-500 font-medium font-bold">Out of Stock</span>;
}

function ProductCard({ product, categories }: { product: Product; categories: Category[] }) {

  const category = categories.find((cat) => cat.id === product.categoryId)?.name ?? "Other";
  const emoji = "📦";
  const discount = getDiscount(product.price, product.originalPrice);
  //const regionClass = regionColor[product.sourceRegion] ?? "bg-gray-100 text-gray-700";
  const [loading, setLoading] = useState(false)
  //console.log(product)

  const router = useRouter()

  const handleAddToCart = async (
    id: string,
    quantity: number
  ) => {
    try {
      setLoading(true);

      await addToCart(id, quantity);

      toast("Added to your cart.", {
        position: "bottom-right",
        autoClose: 1000, // 0.5 second
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        style: {
          background: "#5B1A18",
          opacity: '0.5',
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: "600",
          padding: "16px",
          minWidth: "320px",
          minHeight: "70px",
          borderRadius: "12px",
        },
      });
    } catch (error) {
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:scale-103 transition-all duration-200">
      {/* Image / Placeholder */}
      <div onClick={() => { router.push(`/shop/${product.id}`) }}
        className="relative bg-stone-50 flex items-center justify-center cursor-pointer h-44 sm:h-48 text-5xl select-none">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span role="img" aria-label={category}>
            {emoji}
          </span>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestSelling && (
            <span className="inline-flex items-center gap-1 bg-[#5A1B18] text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full">
              ★ Best Seller
            </span>
          )}
          {discount && (
            <span className="inline-flex items-center bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Region tag — signature element */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-[#FBF3EC] border border-[#5A1B18] text-black px-1 py-0.5 rounded-xl">
            <MapPinHouse className="w-3 h-3" />
            <span className={`text-[12px] font-semibold pr-2 py-0.5 rounded-full`}>
              {product.sourceRegion}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 uppercase tracking-wider font-medium hidden sm:inline">
            {category}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-[15px] font-semibold text-stone-800 leading-snug group-hover:text-[#1B4332] transition-colors">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-end gap-2 mt-auto">
          <span className="text-xl font-bold text-[#1B4332]">
            ৳{product.price}
          </span>
          <span className="text-xs text-stone-400 mb-0.5">/{product.unit}</span>
          {product.originalPrice && (
            <span className="text-xs text-stone-400 line-through mb-0.5">
              ৳{product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock */}
        <StockIndicator qty={product.stockQty} />

        {/* CTA */}
        {product.stockQty == 0 ? (
          <button className="mt-1 w-full py-2.5 rounded-xl cursor-not-allowed bg-stone-300 text-stone-500 text-sm font-semibold transition-all duration-150" disabled>
            Out of Stock
          </button>
        ) : (
          <button onClick={() => handleAddToCart(product.id, 1)}
            disabled={loading}
            className="mt-1 w-full py-2.5 rounded-xl cursor-pointer disabled:cursor-progress bg-[#5A1B18] active:scale-95 text-white text-sm font-semibold transition-all duration-150">
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [onlyBestSelling, setOnlyBestSelling] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const allCategories = [
    { id: "all", name: "All" },
    ...categories,
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`${BASE}/api/v1/products?page=${page}&limit=${limit}&sort=${sortBy}`);
      setProducts(res.data.data);
      setTotal(res.data.meta.total);
    };
    fetchProducts();
  }, [sortBy, page, limit]);
  console.log('products', products);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`${BASE}/api/v1/categories`);
      setCategories(res.data.data);
    };
    fetchCategories();
  }, []);
  console.log('categories', categories);

  const filtered = products
    .filter((p) => {
      const matchCategory =
        activeCategory === "all" ||
        p.categoryId === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sourceRegion.toLowerCase().includes(search.toLowerCase());
      const matchBest = !onlyBestSelling || p.isBestSelling;
      return matchCategory && matchSearch && matchBest;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      {/* Header */}
      {/* <header className="sticky top-0 z-30 bg-[#1B4332] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              🌿 বাজার<span className="text-amber-400">BD</span>
            </h1>
            <p className="text-xs text-emerald-300 mt-0.5 hidden sm:block">
              Pure products, straight from the source
            </p>
          </div>
          Search
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search product or region…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-xl text-sm bg-white/10 text-white placeholder-emerald-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${activeCategory === cat.id
                  ? "bg-[#5A1B18] text-white border-[#1B4332]"
                  : "bg-white text-stone-600 border-stone-200 hover:border-[#1B4332] hover:text-[#1B4332]"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5 flex-wrap">
            <label className="flex items-center gap-2 text-xs text-stone-600 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyBestSelling}
                onChange={(e) => setOnlyBestSelling(e.target.checked)}
                className="accent-[#1B4332] w-4 h-4"
              />
              Best sellers only
            </label>


            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs cursor-pointer appearance-none border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 bg-white focus:outline-none ring ring-[#5A1B18]"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>

              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500"
              />
            </div>
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-stone-400 mb-5">
          Showing <span className="font-semibold text-stone-600">{filtered.length}</span> of{" "}
          {products.length} products
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} categories={categories} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-stone-400">
            <span className="text-5xl mb-4">🌾</span>
            <p className="text-base font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search term</p>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <Pagination>
            <PaginationContent>

              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={page === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={page === pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className={page === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
}