// app/shop/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axiosinterceptor";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  MapPin,
  Package,
  Tag,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Minus,
  Plus,
  MessageCircle,
  Phone,
  Flame,
} from "lucide-react";
import { ProductdetailsPageSkeleton } from "@/components/skeleton/productDetailsPageSkeleton";
import { addToCart } from "@/lib/cartApi";
import { toast } from 'react-toastify'
import { ProductDetailstype } from "@/Types/ProductTypes";


// ─── Image gallery ────────────────────────────────────────────────────────────
const PLACEHOLDER = "/Images/placeholder-product.png"; // your placeholder

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const imgs = images.length > 0 ? images : [PLACEHOLDER];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f9f1f0] border border-[#f0e8e7]">
        <img
          src={imgs[active]}
          alt={name}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-18 h-18 rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-[#5B1A18]" : "border-[#f0e8e7] hover:border-[#d4b8b7]"
                }`}
            >
              <img src={src} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Trust badges ─────────────────────────────────────────────────────────────
function TrustBadges() {
  const badges = [
    { icon: Truck, label: "Rapid Delivery", sub: "On all orders" },
    { icon: ShieldCheck, label: "100% Pure", sub: "Verified quality" },
    { icon: RefreshCw, label: "Easy Returns", sub: "Hassle-free" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 border border-[#f0e8e7] rounded-2xl p-3">
      {badges.map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex flex-col items-center text-center gap-1 py-1">
          <Icon size={18} className="text-[#5B1A18]" />
          <span className="text-xs font-semibold text-[#2d1010]">{label}</span>
          <span className="text-[10px] text-[#9b7b7a]">{sub}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Tab panel ────────────────────────────────────────────────────────────────
function Tabs({ description }: { description: string }) {
  const [tab, setTab] = useState<"description" | "details" | "reviews">("description");

  return (
    <div className="mt-10 border border-[#f0e8e7] rounded-2xl overflow-hidden bg-white">
      {/* Tab bar */}
      <div className="flex border-b border-[#f0e8e7]">
        {(["description", "details", "reviews"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3.5 text-sm font-semibold capitalize transition-colors ${tab === t
              ? "text-[#5B1A18] border-b-2 border-[#5B1A18] -mb-px bg-white"
              : "text-[#9b7b7a] hover:text-[#5B1A18]"
              }`}
          >
            {t === "reviews" ? "Reviews (0)" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 sm:p-7">
        {tab === "description" && (
          <p className="text-sm text-[#4a2020] leading-relaxed">{description}</p>
        )}
        {tab === "details" && (
          <p className="text-sm text-[#9b7b7a]">No additional details available.</p>
        )}
        {tab === "reviews" && (
          <div className="flex flex-col items-center py-8 text-center">
            <Star className="w-8 h-8 text-[#f0e8e7] mb-3" />
            <p className="text-sm font-semibold text-[#2d1010]">No reviews yet</p>
            <p className="text-xs text-[#9b7b7a] mt-1">Be the first to review this product.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetailstype | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingtoCart, setAddingtoCart] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/v1/products/${id}`);
        setProduct(data.data ?? data);
      } catch (error: any) {
        toast.error(error.error?.message ?? "Something went wrong", {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: true,
          className: "error-toast"
        })
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading) return <ProductdetailsPageSkeleton />;
  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isLowStock = product.stockQty <= product.lowStockThreshold;
  const outOfStock = product.stockQty === 0;

  const handleAddToCart = async (
    id: string,
    quantity: number
  ) => {
    try {
      setAddingtoCart(true);

      await addToCart(id, quantity);

      toast("Added to your cart.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        className: 'cart-success-toast'
      });
      setAddedToCart(true);
    } catch (error) {
      toast.error("Failed to add item", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        className: "error-toast"
      });
    } finally {
      setAddingtoCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-xs text-[#9b7b7a] mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#5B1A18] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <Link href="/shop" className="hover:text-[#5B1A18] transition-colors">Shop</Link>
          <ChevronRight size={13} />
          <Link
            href={`/shop?category=${product.category.slug}`}
            className="hover:text-[#5B1A18] transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight size={13} />
          <span className="text-[#2d1010] font-medium truncate max-w-[160px]">{product.name}</span>
        </nav>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left — image gallery */}
          <ImageGallery images={product.images} name={product.name} />

          {/* Right — product info */}
          <div className="space-y-5">

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-[#9b7b7a] bg-[#f9f1f0] px-3 py-1 rounded-full">
                {product.category.name}
              </span>
              {product.isBestSelling && (
                <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                  <Flame size={11} />
                  Best Selling
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2d1010] leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-[#5B1A18]">৳{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-[#9b7b7a] line-through mb-0.5">
                  ৳{product.originalPrice}
                </span>
              )}
              <span className="text-sm text-[#9b7b7a] mb-0.5">/ {product.unit}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-[#4a2020] leading-relaxed border-t border-[#f0e8e7] pt-4">
              {product.description}
            </p>

            {/* Meta info */}
            <div className="space-y-2">
              {product.sourceRegion && (
                <div className="flex items-center gap-2 text-sm text-[#9b7b7a]">
                  <MapPin size={14} className="text-[#5B1A18] flex-shrink-0" />
                  <span>Source: <span className="text-[#2d1010] font-medium">{product.sourceRegion}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[#9b7b7a]">
                <Package size={14} className="text-[#5B1A18] flex-shrink-0" />
                <span>
                  Availability:{" "}
                  <span className={`font-medium ${outOfStock ? "text-red-500" : isLowStock ? "text-orange-500" : "text-green-600"}`}>
                    {outOfStock ? "Out of stock" : isLowStock ? `Only ${product.stockQty} left` : "In stock"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#9b7b7a]">
                <Tag size={14} className="text-[#5B1A18] flex-shrink-0" />
                <span>Category: <span className="text-[#2d1010] font-medium">{product.category.name}</span></span>
              </div>
            </div>

            {/* Quantity + Add to cart */}
            {!outOfStock && (
              <div className="space-y-3 pt-2">
                {/* Qty picker */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#2d1010]">Quantity</span>
                  <div className="flex items-center border border-[#f0e8e7] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-2.5 text-[#5B1A18] hover:bg-[#f9f1f0] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-[#2d1010]">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stockQty, q + 1))}
                      className="px-3 py-2.5 text-[#5B1A18] hover:bg-[#f9f1f0] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-[#5B1A18] ml-1">
                    = ৳{(product.price * qty).toLocaleString()}
                  </span>
                </div>

                {/* CTA buttons */}
                <div className="flex gap-3 group">
                  <button
                    onClick={() => { handleAddToCart(product.id, 1) }}
                    disabled={addingtoCart}
                    className={`flex-1 flex items-center cursor-pointer disabled:cursor-progress justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${addedToCart
                      ? "bg-green-600 text-white"
                      : "bg-[#5B1A18] text-white hover:bg-[#7a2320]"
                      }`}
                  >
                    <ShoppingCart size={16} className="transition-transform duration-200 group-hover:scale-120" />
                    {addedToCart ? "Added!" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => setWishlisted((w) => !w)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${wishlisted
                      ? "border-[#5B1A18] bg-[#5B1A18] text-white"
                      : "border-[#f0e8e7] text-[#9b7b7a] hover:border-[#5B1A18] hover:text-[#5B1A18]"
                      }`}
                  >
                    <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
                  </button>
                  <button className="px-4 py-3 rounded-xl border-2 border-[#f0e8e7] text-[#9b7b7a] hover:border-[#5B1A18] hover:text-[#5B1A18] transition-all duration-200">
                    <Share2 size={16} />
                  </button>
                </div>

                {/* Buy now */}
                <button className="w-full py-3 rounded-xl border-2 border-[#5B1A18] text-[#5B1A18] text-sm font-semibold hover:bg-[#5B1A18] hover:text-white transition-all duration-200">
                  Buy Now
                </button>

                {/* WhatsApp + Call */}
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/8801700000000?text=Hello! I'm interested in: ${product.name} - ৳${product.price}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle size={14} />
                    Order on WhatsApp
                  </a>
                  <a
                    href="tel:+8801700000000"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f9f1f0] text-[#5B1A18] text-xs font-semibold hover:bg-[#f0e8e7] transition-colors"
                  >
                    <Phone size={14} />
                    Call to Order
                  </a>
                </div>
              </div>
            )}

            {outOfStock && (
              <div className="py-4 text-center bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-600">
                Currently out of stock
              </div>
            )}

            {/* Trust badges */}
            <TrustBadges />
          </div>
        </div>

        {/* ── Description / Reviews tabs ── */}
        <Tabs description={product.description} />

      </div>
    </div>
  );
}