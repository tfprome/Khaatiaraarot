"use client";

import Image from "next/image";
import HeroBannerPhoto from "../public/Images/HeroBanner.jpg";
import { useEffect, useState } from "react";
import HeroBannerSkeleton from "./skeleton/herobannerskeleton";

const sideBanners = [
  {
    tag: "Free delivery",
    tagColor: "text-[#8B0000]",
    title: "Eid Gift\nHampers",
    sub: "Curated local produce boxes",
    btn: "Order now",
    btnClass: "bg-[#8B0000] text-[#FAC775] hover:bg-[#6e0000]",
    accent: "bg-[#fbe8d8]",
  },
  {
    tag: "Season's best",
    tagColor: "text-[#BA7517]",
    title: "Fresh Mangoes\n& Fruits",
    sub: "Direct from orchards",
    btn: "Grab now",
    btnClass: "bg-[#BA7517] text-white hover:bg-[#9a6012]",
    accent: "bg-[#fef3e0]",
  },
];

export default function HeroBanner() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating an API call for banner data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  
  return (
    <section className="bg-[#fdf5ee] py-4 px-4 sm:px-6">
      {isLoading ? <HeroBannerSkeleton /> : (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-stretch">

        {/* ── Main Banner ── */}
        <div className="relative rounded-2xl overflow-hidden border border-[#d4b8a0] w-full lg:flex-1">
          <Image
            src={HeroBannerPhoto}
            alt="Eid Celebration — gift hampers and fresh mangoes"
            width={HeroBannerPhoto.width}
            height={HeroBannerPhoto.height}
            className="w-full h-full"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          {/* CTA content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            {/* <span className="inline-block bg-[#FAC775] text-[#633806] text-[10px] sm:text-[11px] font-medium px-3 py-1 rounded-full mb-2 sm:mb-3">
              ✦ Eid Special 2025
            </span> */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
              <button className="bg-[#8B0000] text-[#FAC775] text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#6e0000] transition-colors duration-200 cursor-pointer">
                Shop gift boxes
              </button>
              <button className="bg-transparent text-[#FAC775] border border-[#FAC775] text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                View all offers
              </button>
            </div>
          </div>
        </div>

        {/* ── Side Cards ── */}
        {/* mobile/tablet: horizontal row | desktop: vertical column */}
        <div className="grid grid-cols-2 lg:grid-cols-1 lg:w-60 gap-4 lg:shrink-0">
          {sideBanners.map(({ tag, tagColor, title, sub, btn, btnClass, accent }) => (
            <div
              key={tag}
              className="relative bg-white border border-[#e8d5c4] rounded-2xl p-4 sm:p-5 overflow-hidden flex flex-col justify-between min-h-40 sm:min-h-45 lg:min-h-0 lg:flex-1"
            >
              {/* Decorative circle */}
              <div className={`absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full ${accent}`} />

              <div className="relative flex flex-col gap-1">
                <p className={`text-[10px] sm:text-[11px] font-medium ${tagColor}`}>{tag}</p>
                <p className="text-sm sm:text-[15px] font-medium text-[#3d1f0a] leading-snug whitespace-pre-line">
                  {title}
                </p>
                <p className="text-[11px] sm:text-[12px] text-[#b07a5a] mt-0.5">{sub}</p>
              </div>

              <button
                className={`self-start mt-3 sm:mt-4 text-[11px] sm:text-[12px] font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg cursor-pointer transition-colors duration-200 ${btnClass}`}
              >
                {btn}
              </button>
            </div>
          ))}
        </div>

      </div>)}
    </section>
  );
}