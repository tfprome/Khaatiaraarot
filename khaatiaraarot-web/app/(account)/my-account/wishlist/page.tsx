"use client";

import { Heart } from "lucide-react";
import AccountPageHeader from "@/components/account/accountpageHeader";
import EmptyState from "@/components/account/emptystate";
import WishlistCard, { WishlistItem } from "@/components/account/wishlistcard";

const MOCK_WISHLIST: WishlistItem[] = [];

export default function WishlistPage() {
  return (
    <>
      <AccountPageHeader title="My Wishlist" description="Items you've saved for later" />
      <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm p-5 sm:p-7">
        {MOCK_WISHLIST.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            message="Save items you love and come back to them anytime."
            action={{ label: "Browse products", href: "/shop" }}
          />
        ) : (
          <div className="space-y-3">
            {MOCK_WISHLIST.map((item) => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}