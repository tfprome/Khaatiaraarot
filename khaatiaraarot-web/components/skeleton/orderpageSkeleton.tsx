// components/account/OrdersPageSkeleton.tsx

function OrderCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#f0e8e7]">
      {/* Icon Box Skeleton */}
      <div className="w-11 h-11 rounded-xl bg-gray-100 flex-shrink-0" />
      
      {/* Text Content Skeleton */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Row 1: Date text + Status Badge */}
        <div className="flex items-center justify-between gap-2">
          {/* w-3/4 mimics the 'truncate' class behavior nicely */}
          <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
          {/* Fixed width matches your status pill roughly */}
          <div className="h-5 w-20 bg-gray-200 rounded-full flex-shrink-0" />
        </div>
        
        {/* Row 2: Details + Dots */}
        <div className="flex items-center gap-3">
          <div className="w-24 h-3 bg-gray-100 rounded-full" />
          {/* The Dot */}
          <div className="w-1 h-1 bg-gray-200 rounded-full" />
          <div className="w-12 h-3 bg-gray-100 rounded-full" />
          {/* The Dot */}
          <div className="w-1 h-1 bg-gray-200 rounded-full" />
          {/* Slightly wider for the price text */}
          <div className="w-14 h-3 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function OrdersPageSkeleton() {
  return (
    <>
      {/* We skip the header skeleton because AccountPageHeader is static text */}
      
      <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm p-5 sm:p-7 animate-pulse">
        <div className="space-y-3">
          {/* Render 3 skeleton cards to hold the space */}
          {[...Array(3)].map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-end items-center gap-2 mt-6 animate-pulse">
        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
      </div>
    </>
  );
}