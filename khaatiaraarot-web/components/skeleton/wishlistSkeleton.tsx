// components/account/WishlistPageSkeleton.tsx
export default function WishlistPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton (Matches AccountPageHeader height) */}
      <div className="mb-6">
        <div className="h-6 w-36 bg-gray-200 rounded-lg" />
        <div className="h-4 w-56 bg-gray-100 rounded-lg mt-2" />
      </div>

      {/* Main Container Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 space-y-3">
        
        {/* Card 1 Skeleton */}
        <WishlistCardSkeleton />
        
        {/* Card 2 Skeleton */}
        <WishlistCardSkeleton />
        
        {/* Card 3 Skeleton */}
        <WishlistCardSkeleton />
        
        {/* Card 4 Skeleton */}
        <WishlistCardSkeleton />
        
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}

// Isolated card skeleton for easy mapping
function WishlistCardSkeleton() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-gray-100">
      
      {/* Image Placeholder - matches w-12 h-12 sm:w-14 sm:h-14 */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 flex-shrink-0" />

      {/* Info Placeholder */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Product Name */}
        <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
        
        {/* Region & Unit Row */}
        <div className="flex items-center gap-2">
          {/* MapPin icon placeholder */}
          <div className="w-3 h-3 bg-gray-100 rounded-sm flex-shrink-0" />
          <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded-full" />
          {/* Original Price placeholder */}
          <div className="h-3 w-12 bg-gray-100 rounded-full" />
        </div>
      </div>

      {/* Actions Placeholder */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Add to Cart Button - matches hidden text behavior on mobile */}
        <div className="h-8 w-24 sm:w-28 bg-gray-200 rounded-xl" />
        
        {/* Remove Button - matches p-2 w-8 h-8 */}
        <div className="h-8 w-8 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}