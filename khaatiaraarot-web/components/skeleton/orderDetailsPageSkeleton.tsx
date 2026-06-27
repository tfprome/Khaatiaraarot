"use client";

export function OrderDetailsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdf8f7] animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-3 w-12 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded" />
          </div>

          <div className="flex gap-3">
            <div className="h-9 w-28 bg-gray-200 rounded-full" />
            <div className="h-9 w-32 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-4">

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-[#f0e8e7] overflow-hidden">
              <div className="h-14 border-b border-[#f0e8e7] px-5 flex items-center">
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>

              <div className="p-5 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>

              <div className="border-t border-[#f0e8e7] p-5 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>

                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-12 bg-gray-200 rounded" />
                </div>

                <div className="flex justify-between">
                  <div className="h-5 w-16 bg-gray-200 rounded" />
                  <div className="h-5 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-[#f0e8e7] p-5">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />

              <div className="space-y-3">
                <div className="h-4 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-[#f0e8e7] p-5">
              <div className="h-5 w-28 bg-gray-200 rounded mb-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>

                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>

                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div>
            <div className="bg-white rounded-2xl border border-[#f0e8e7] p-5">
              <div className="h-5 w-32 bg-gray-200 rounded mb-5" />

              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex gap-3 mb-5">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}