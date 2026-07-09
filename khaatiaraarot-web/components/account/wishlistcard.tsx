"use client";

import { Heart, ShoppingCart, Trash2, MapPin } from "lucide-react";
import { WishlistProduct } from "@/Types/wishTypes";
import { wishlistType } from "@/Types/wishTypes";

interface WishlistCardProps {
  item: wishlistType;
  onclick: () => void;
  onRemove: () => void;
  onAddToCart: () => void;
  AddingtoCart?: boolean; // Optional prop to indicate loading state
  deletingItem?: boolean; // Optional prop to indicate loading state for deletion
}

export default function WishlistCard({ item, onclick, onRemove, onAddToCart, AddingtoCart, deletingItem }: WishlistCardProps) {
  const { product } = item;

  return (
    <div onClick={()=>{onclick()}}
    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-[#f0e8e7] bg-white hover:border-[#d4b8b7] transition-colors group">
      
      {/* Image */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#f9f1f0] flex items-center justify-center flex-shrink-0 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Heart className="w-5 h-5 text-[#d4b8b7]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#2d1010] truncate">{product.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-[#9b7b7a] flex-shrink-0" />
          <span className="text-xs text-[#9b7b7a] truncate">{product.sourceRegion} · {product.unit}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-[#5B1A18]">৳{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-[#9b7b7a] line-through">৳{product.originalPrice}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation(); // FIX: Prevents triggering the outer div navigation
            onAddToCart();
          }}
          disabled={AddingtoCart} // Disable button when loading
          aria-label={`Add ${product.name} to cart`}
          className="flex items-center gap-1.5 bg-[#5B1A18] cursor-pointer disabled:cursor-progress disabled:opacity-50 hover:bg-[#7a2320] active:scale-95 text-white text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-xl transition-all duration-150"
        >
          <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline">Add to cart</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation(); // FIX: Prevents triggering the outer div navigation
            onRemove();
          }}
          disabled={deletingItem}
          aria-label={`Remove ${product.name} from wishlist`}
          title={`Remove ${product.name} from wishlist`}
          className="flex items-center justify-center p-2 cursor-pointer rounded-xl border disabled:cursor-progress disabled:opacity-50 border-[#f0e8e7] text-[#b07070] hover:bg-[#fdf0f0] hover:text-[#c0392b] hover:border-[#f5c6c6] active:scale-95 transition-all duration-150"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}