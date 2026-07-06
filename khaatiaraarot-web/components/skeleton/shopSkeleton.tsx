export default function ProductsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-serif animate-pulse">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Filters Row Skeleton ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
          {/* Category Pills Skeleton */}
          <div className="flex gap-2 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded-full ${i === 0 ? "w-12 bg-stone-300" : "w-20 bg-stone-200"}`}
              />
            ))}
          </div>

          {/* Controls Skeleton */}
          <div className="flex items-center gap-5">
            {/* Checkbox Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-stone-200 rounded" />
              <div className="w-24 h-3 bg-stone-200 rounded-full" />
            </div>
            {/* Select Skeleton */}
            <div className="relative w-32 h-8 bg-stone-200 rounded-lg" />
          </div>
        </div>

        {/* ── Result Count Skeleton ── */}
        <div className="w-40 h-3 bg-stone-100 rounded-full mb-5" />

        {/* ── Product Grid Skeleton ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden">
              
              {/* Image Area Skeleton - matches h-44 sm:h-48 */}
              <div className="relative bg-stone-100 h-44 sm:h-48">
                {/* Badge placeholders to mimic the layout */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <div className="w-16 h-4 bg-stone-200 rounded-full" />
                  <div className="w-10 h-4 bg-stone-200 rounded-full" />
                </div>
              </div>

              {/* Body Skeleton */}
              <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Region Tag Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-[#FBF3EC] border border-[#5A1B18] px-1 py-0.5 rounded-xl">
                    <div className="w-3 h-3 bg-stone-200 rounded-sm ml-0.5" />
                    <div className="w-14 h-3.5 bg-stone-200 rounded-full mr-2" />
                  </div>
                  {/* Category text hidden on small screens */}
                  <div className="w-12 h-3 bg-stone-100 rounded-full hidden sm:block" />
                </div>

                {/* Name Lines */}
                <div className="space-y-1.5">
                  <div className="w-3/4 h-4 bg-stone-200 rounded-full" />
                  <div className="w-1/2 h-4 bg-stone-100 rounded-full" />
                </div>

                {/* Price Row */}
                <div className="flex items-end gap-2 mt-auto">
                  <div className="w-16 h-5 bg-stone-200 rounded-full" />
                  <div className="w-6 h-3 bg-stone-100 rounded-full mb-0.5" />
                  <div className="w-12 h-3 bg-stone-100 rounded-full mb-0.5" />
                </div>

                {/* Stock Indicator */}
                <div className="w-20 h-3 bg-stone-100 rounded-full" />

                {/* Buttons Row - matches exact flex layout */}
                <div className="mt-1 flex gap-1.5 sm:gap-2">
                  {/* Add to Cart */}
                  <div className="flex-1 h-10 bg-stone-200 rounded-xl" />
                  {/* Buy Now */}
                  <div className="w-10 sm:w-12 h-10 bg-stone-200 rounded-xl" />
                  {/* Wishlist */}
                  <div className="w-10 sm:w-12 h-10 bg-stone-200 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pagination Skeleton ── */}
        <div className="flex justify-end items-center gap-2 mt-10">
          <div className="w-8 h-8 bg-stone-200 rounded-lg" />
          <div className="w-8 h-8 bg-stone-300 rounded-lg" />
          <div className="w-8 h-8 bg-stone-200 rounded-lg" />
          <div className="w-8 h-8 bg-stone-200 rounded-lg" />
        </div>

      </main>
    </div>
  );
}