"use client";

import { useState, useEffect } from "react";
import { Product } from "@/Types/ProductTypes";
import axios from "axios";
import { ChevronDown, MapPinHouse } from "lucide-react";
import { BagIcon, HeartIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { Category } from "@/Types/ProductTypes";
import { addToCart } from "@/lib/cartApi";
import { toast } from "react-toastify";
import PaginationControls from "@/components/pagination/paginationcontrol";
import { useRouter } from "next/navigation";
import { addToWish } from "@/lib/wishlistApi";
import { useAppDispatch } from "@/store/hooks";
import { setItemCount } from "@/store/cartSlice";
import ProductsPageSkeleton from "@/components/skeleton/shopSkeleton";

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

export function ProductCard({ product, categories }: { product: Product; categories: Category[] }) {

  const category = categories.find((cat) => cat.id === product.categoryId)?.name ?? "Other";
  const emoji = "📦";
  const discount = getDiscount(product.price, product.originalPrice);
  //const regionClass = regionColor[product.sourceRegion] ?? "bg-gray-100 text-gray-700";
  const [loading, setLoading] = useState(false)
  //console.log(product)

  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleAddToCart = async (
    id: string,
    quantity: number
  ) => {
    try {
      setLoading(true);

      const res = await addToCart(id, quantity);
      dispatch(setItemCount(res.data.itemCount));

      toast("Added to your cart.", {
        position: "top-center",
        autoClose: 1000, // 0.5 second
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        className: 'cart-success-toast'
      });
    } catch (error: any) {
      //console.error("Failed to add item", error.message);
      toast.error(error.response?.data?.message || "Failed to add item", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        className: "error-toast"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWish = async (
    id: string,
  ) => {
    try {
      setLoading(true);

      await addToWish(id);

      toast("Added to your wishlist.", {
        position: "top-center",
        autoClose: 1000, // 0.5 second
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        className: 'cart-success-toast'
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add item", {
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



  return (
    <div className="relative flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
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
        {product.stockQty === 0 ? (
          <button
            disabled
            className="mt-1 w-full py-2.5 rounded-xl cursor-not-allowed bg-stone-300 text-stone-500 text-sm font-semibold"
          >
            Out of Stock
          </button>
        ) : (
          <div className="mt-1 flex gap-1.5 sm:gap-2">
            {/* Add to Cart */}
            <button
              onClick={() => handleAddToCart(product.id, 1)}
              disabled={loading}
              title="Add to Cart"
              className="flex-1 group flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl bg-[#5A1B18] text-white cursor-pointer text-xs sm:text-sm font-semibold active:scale-95 disabled:cursor-progress"
            >
              <ShoppingCartIcon
                size={16}
                className="group-hover:scale-110 transition-transform duration-200 sm:hidden lg:inline sm:w-[18px] sm:h-[18px]"
              />
              <span className="hidden xs:inline sm:inline">Add to Cart</span>
              {/* <span className="xs:hidden sm:hidden">Cart</span> */}
            </button>

            {/* Buy Now */}
            <button
              title="Buy Now"
              onClick={() => handleBuyNow(product.id, 1)}
              className="w-10 sm:w-12 lg:w-[15%] flex group items-center justify-center cursor-pointer rounded-xl border border-[#5A1B18] text-[#5A1B18] transition-colors py-2 sm:py-2.5"
            >
              <BagIcon
                size={16}
                className="group-hover:scale-125 transition-transform duration-200 sm:w-[18px] sm:h-[18px]"
              />
            </button>

            {/* Wishlist */}
            <button
              title="Add to Wishlist"
              onClick={() => handleAddToWish(product.id)}
              className="w-10 sm:w-12 lg:w-[15%] flex items-center justify-center group rounded-xl cursor-pointer border border-[#5A1B18] text-[#5A1B18] transition-colors py-2 sm:py-2.5"
            >
              <HeartIcon
                size={16}
                className="group-hover:scale-125 transition-transform duration-200 sm:w-[18px] sm:h-[18px]"
              />
            </button>
          </div>
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
  const [loading, setLoading] = useState(true);

  const allCategories = [
    { id: "all", name: "All", slug: "all" },
    ...categories,
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${BASE}/api/v1/products?page=${page}&limit=${limit}&sort=${sortBy}`;

        if (activeCategory !== "all") {
          url += `&category=${activeCategory}`;
        }
        const res = await axios.get(url);
        setProducts(res.data.data);
        setTotal(res.data.meta.total);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sortBy, page, limit, activeCategory]);
  console.log('products', products);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`${BASE}/api/v1/categories`);
      setCategories(res.data.data);
    };
    fetchCategories();
  }, []);
  console.log('categories', categories);

  if (loading) {
    return <ProductsPageSkeleton />;
  }

  const filtered = products
    .filter((p) => {
      // const matchCategory =
      //   activeCategory === "all" ||
      //   p.categoryId === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sourceRegion.toLowerCase().includes(search.toLowerCase());
      const matchBest = !onlyBestSelling || p.isBestSelling;
      return matchSearch && matchBest;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-serif">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(
                    cat.id === "all" ? "all" : cat.slug
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${activeCategory === cat.slug ? "text-black border-[#5A1B18] shadow-lg scale-105" : "bg-white text-stone-600 border-stone-200 hover:border-[#1B4332] hover:text-[#1B4332]"}`}
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

        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>
    </div>
  );
}