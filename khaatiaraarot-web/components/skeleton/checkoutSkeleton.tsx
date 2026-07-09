export default function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* ── Page title ── */}
      <div className="text-center pt-6 pb-2">
        <div className="h-6 w-28 bg-gray-200 rounded-lg mx-auto" />
        <div className="h-4 w-40 bg-gray-100 rounded-lg mx-auto mt-2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Order review */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SkeletonHeader />
            <div className="divide-y divide-gray-100">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded" />
                      <div className="h-4 w-4 bg-gray-100 rounded" />
                      <div className="w-6 h-6 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 rounded flex-shrink-0" />
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SkeletonHeader />
            <div className="space-y-3">
              {/* Full Name */}
              <SkeletonInput />
              
              {/* Phone & Postal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex rounded-lg border border-gray-100 overflow-hidden h-10">
                    <div className="w-10 bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 bg-gray-50" />
                  </div>
                  <div className="h-2 w-24 bg-gray-100 rounded mt-1" />
                </div>
                <SkeletonInput />
              </div>

              {/* Address */}
              <SkeletonInput />
              
              {/* District & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SkeletonInput />
                <SkeletonInput />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SkeletonHeader />
            <SkeletonInput />
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SkeletonHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-11 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Special Notes */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SkeletonHeader />
            <div className="w-full h-20 bg-gray-100 rounded-lg" />
            <div className="h-3 w-16 bg-gray-100 rounded mt-2" />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-4">
          
          {/* Coupon */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="h-6 bg-gray-100 rounded-lg w-full" />
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <SkeletonHeader />
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-100 rounded" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-4 w-12 bg-gray-100 rounded" />
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <div className="h-5 w-12 bg-gray-200 rounded" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-full h-12 bg-gray-200 rounded-xl" />
          </div>

          {/* Payment Logos */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="h-3 w-16 bg-gray-100 rounded mb-3" />
            <div className="flex flex-wrap gap-1.5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-5 w-16 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function SkeletonHeader() {
  return (
    <div className="flex items-center mb-4">
      <div className="w-1 h-5 bg-[#5B1A18] rounded-r mr-3" />
      <div className="h-4 w-36 bg-gray-200 rounded" />
    </div>
  );
}

function SkeletonInput() {
  return (
    <div>
      <div className="w-full h-10 bg-gray-100 rounded-lg" />
      {/* This h-2 div holds the space for your invisible error messages */}
      <div className="h-2 w-28 bg-gray-100 rounded mt-1" />
    </div>
  );
}