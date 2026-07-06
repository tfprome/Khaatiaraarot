export default function FeaturedCategoriesSkeleton() {
  return (
    <section className="bg-[#fdf5ee] py-10 px-4 sm:px-6 animate-pulse">
      <div className="max-w-7xl mx-auto">

        {/* ── Header Skeleton ── */}
        <div className="text-center mb-8">
          <div className="h-7 w-48 sm:h-8 sm:w-64 bg-gray-200 rounded-lg mx-auto" />
          <div className="h-4 w-56 bg-gray-100 rounded-lg mx-auto mt-3" />
          <div className="mx-auto mt-3 w-12 h-0.5 rounded-full bg-gray-200" />
        </div>

        {/* ── Cards Skeleton ── */}
        {/* We generate 5 items to perfectly match your lg:grid-cols-5 layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
              {/* Image area - aspect-square prevents height collapse */}
              <div className="w-full aspect-square bg-gray-200" />

              {/* Text area - flex-col items-center mimics text-center */}
              <div className="w-full px-3 py-3 sm:py-4 flex flex-col items-center">
                {/* Category Name */}
                <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                {/* Bangla Name */}
                <div className="h-3 w-1/2 bg-gray-100 rounded-full mt-2" />
                {/* Item Count Badge */}
                <div className="mt-3 h-4 w-16 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* ── View All Button Skeleton ── */}
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-44 bg-gray-200 rounded-xl" />
        </div>

      </div>
    </section>
  );
}