export default function HeroBannerSkeleton() {
  return (
    <section className="bg-[#fdf5ee] py-4 px-4 sm:px-6 animate-pulse">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-stretch">

        {/* ── Main Banner Skeleton (Reduced Height) ── */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 w-full lg:flex-1 bg-gray-200 min-h-[180px] sm:h-[220px] lg:h-[340px] lg:aspect-[2/1]">
          
          {/* CTA Buttons Skeleton at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="h-8 sm:h-10 w-28 sm:w-36 bg-gray-300 rounded-lg" />
            <div className="h-8 sm:h-10 w-32 sm:w-40 bg-gray-300 rounded-lg" />
          </div>
        </div>

        {/* ── Side Cards Skeleton (Adjusted to match) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-1 lg:w-60 gap-4 lg:shrink-0">
          
          {/* Card 1 Skeleton */}
          <div className="relative bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[160px] lg:min-h-0 lg:flex-1">
            <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100" />
            
            <div className="relative flex flex-col gap-2 mt-1">
              <div className="w-16 h-2 bg-gray-200 rounded-full" />
              <div className="w-3/4 h-3 bg-gray-200 rounded-full" />
              <div className="w-1/2 h-3 bg-gray-200 rounded-full" />
              <div className="w-28 h-2 bg-gray-100 rounded-full mt-1" />
            </div>

            <div className="self-start mt-4 w-20 h-7 bg-gray-200 rounded-lg" />
          </div>

          {/* Card 2 Skeleton */}
          <div className="relative bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[160px] lg:min-h-0 lg:flex-1">
            <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100" />
            
            <div className="relative flex flex-col gap-2 mt-1">
              <div className="w-20 h-2 bg-gray-200 rounded-full" />
              <div className="w-4/5 h-3 bg-gray-200 rounded-full" />
              <div className="w-2/5 h-3 bg-gray-200 rounded-full" />
              <div className="w-24 h-2 bg-gray-100 rounded-full mt-1" />
            </div>

            <div className="self-start mt-4 w-20 h-7 bg-gray-200 rounded-lg" />
          </div>

        </div>

      </div>
    </section>
  );
}