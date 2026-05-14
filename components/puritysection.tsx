"use client";

import Image from "next/image";
import Link from "next/link";
import type { ImageProps } from "next/image";
import puritysectionphoto from '../public/Images/aboutusphoto.jpg'

// type PuritySectionProps = {
//   image?: ImageProps["src"];
// }

export default function PuritySection() {
  return (
    <section className="bg-white py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-stretch gap-0 rounded-2xl overflow-hidden border border-[#e8d5c4]">

          {/* ── Image — left ── */}
          <div className="relative w-full md:w-1/2 min-h-60 sm:min-h-70 md:min-h-90 bg-[#fdf5ee] shrink-0">
              <Image
                src={puritysectionphoto}
                alt="Where Purity Meets Purpose"
                fill
                className="object-cover"
                priority
              />
          </div>

          {/* ── Content — right ── */}
          <div className="flex flex-col justify-center px-6 sm:px-8 md:px-10 py-8 md:py-10 bg-white flex-1">

            {/* Eyebrow */}
            <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-widest mb-3">
              Our Story
            </p>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2c1a0e] leading-tight mb-4">
              Where Purity{" "}
              <span className="text-[#8B0000]">Meets Purpose</span>
            </h2>

            {/* Divider */}
            <div className="w-10 h-0.5 rounded-full bg-[#8B0000] mb-5" />

            {/* Body */}
            <p className="text-sm sm:text-[15px] text-[#6b4c2a] leading-relaxed mb-8">
              We believe that real health starts at the root — quite literally.
              Our mission is to deliver fresh, preservative-free fruits and
              crops directly from the fields to your doorstep. Grown with care,
              handpicked with love, and delivered with pride, our produce
              reflects a promise: to nourish your body while protecting the
              planet.
            </p>

            {/* CTA */}
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#8B0000] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#6e0000] transition-colors duration-200"
              >
                Check out our collection
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}