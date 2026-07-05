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
  MapPin,
  Package,
  Tag,
  ChevronRight,
  Minus,
  Plus,
  MessageCircle,
  Phone,
  Flame,
} from "lucide-react";
import { ProductdetailsPageSkeleton } from "@/components/skeleton/productDetailsPageSkeleton";
import { addToCart } from "@/lib/cartApi";
import { addToWish } from "@/lib/wishlistApi";
import { toast } from 'react-toastify'
import { ProductDetailstype } from "@/Types/ProductTypes";
import { Tabs } from "@/components/productdetailspage/tabs";
import { TrustBadges } from "@/components/productdetailspage/trustbadges";
import { ImageGallery } from "@/components/productdetailspage/images";
import {useAppDispatch} from "@/store/hooks";
import {setItemCount} from "@/store/cartSlice";
import { CartProduct } from "@/Types/cartTypes";




// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetailstype | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addingtoWish, setAddingtoWish] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingtoCart, setAddingtoCart] = useState(false)
  const [wishlisted,setWishlisted] =useState(false)
  const dispatch=useAppDispatch()

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

      const res=await addToCart(id, quantity);
      //console.log('detail res:', res);
      dispatch(setItemCount(res.data.itemCount));

      toast.success("Added to your cart.", {
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

  const handleBuyNow = (product: ProductDetailstype, quantity: number) => {
    localStorage.setItem("buyNowItem", JSON.stringify({ product, quantity }));
    router.push("/checkout?mode=buy-now");
  };

  const handleAddToWish = async (
      id: string,
    ) => {
      try {
        setAddingtoWish(true);
  
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
        setWishlisted(true)
      } catch (error) {
        toast.error("Failed to add item", {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: true,
          className: "error-toast"
        });
      } finally {
        setAddingtoWish(false);
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
                    onClick={()=>{handleAddToWish(product.id)}}
                    disabled={addingtoWish}
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
                <button onClick={()=>{handleBuyNow(product, qty)}}
                className="w-full py-3 rounded-xl border-2 border-[#5B1A18] text-[#5B1A18] text-sm font-semibold hover:bg-[#5B1A18] hover:text-white transition-all duration-200">
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