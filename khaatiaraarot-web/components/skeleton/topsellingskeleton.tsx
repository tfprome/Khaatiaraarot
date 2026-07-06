function ProductCardSkeleton() {
  return (
    <div className="relative bg-white rounded-2xl border border-[#e8d5c4] overflow-hidden flex flex-row items-center animate-pulse">
      
      {/* Image Placeholder - Matches your exact responsive widths */}
      <div className="w-[90px] sm:w-[110px] md:w-[130px] lg:w-[170px] shrink-0 self-stretch bg-gray-100 rounded-l-2xl" />

      {/* Content Placeholder */}
      <div className="flex flex-col justify-center px-3 sm:px-3 md:px-4 lg:px-5 py-3 md:py-4 lg:py-5 flex-1 min-w-0 space-y-2.5">
        
        {/* Source text line */}
        <div className="w-16 h-2 bg-gray-100 rounded-full" />
        
        {/* Name text line */}
        <div className="w-3/4 h-3 bg-gray-100 rounded-full" />
        
        {/* Unit text line */}
        <div className="w-20 h-2 bg-gray-100 rounded-full" />
        
        {/* Price line */}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-20 h-4 bg-gray-100 rounded-full" />
          <div className="w-14 h-3 bg-gray-50 rounded-full" /> {/* Strikethrough placeholder */}
        </div>

        {/* Save badge placeholder */}
        <div className="w-16 h-4 bg-gray-50 rounded-full" />
        
        {/* Buttons placeholder */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 pt-1">
          <div className="h-8 w-24 bg-gray-100 rounded-lg" />
          <div className="h-8 w-24 bg-gray-100 rounded-lg" />
        </div>

      </div>
    </div>
  );
}

export default function TopSellingSkeleton() {
  return (
    <section className="bg-white py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header Skeleton */}
        <div className="text-center mb-6 sm:mb-8 animate-pulse">
          {/* Title */}
          <div className="h-8 w-64 bg-gray-100 rounded-lg mx-auto" />
          {/* Subtitle */}
          <div className="h-4 w-48 bg-gray-100 rounded-lg mx-auto mt-3" />
          {/* Divider */}
          <div className="mx-auto mt-3 w-12 h-0.5 rounded-full bg-gray-200" />
        </div>

        {/* Grid Skeleton - Always renders 4 cards to hold the space */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

      </div>
    </section>
  );
}