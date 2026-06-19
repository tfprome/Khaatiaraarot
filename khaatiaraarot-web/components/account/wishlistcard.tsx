import { Heart, ShoppingCart } from "lucide-react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
}

export default function WishlistCard({ item }: { item: WishlistItem }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#f0e8e7] bg-white hover:border-[#d4b8b7] transition-colors group">
      {/* Image placeholder */}
      <div className="w-14 h-14 rounded-xl bg-[#f9f1f0] flex items-center justify-center flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <Heart className="w-5 h-5 text-[#d4b8b7]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#2d1010] truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-bold text-[#5B1A18]">৳{item.price}</span>
          {item.originalPrice && (
            <span className="text-xs text-[#9b7b7a] line-through">৳{item.originalPrice}</span>
          )}
        </div>
      </div>

      <button className="flex-shrink-0 flex items-center gap-1.5 bg-[#5B1A18] text-white text-xs font-semibold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <ShoppingCart className="w-3.5 h-3.5" />
        Add
      </button>
    </div>
  );
}