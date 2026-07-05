"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import OilPhoto from '../public/Images/OilCategories.jpg';
import FruitsPhoto from '../public/Images/khatiarotlogo.jpg';
import CropsPhoto from '../public/Images/CropsCategories.jpg';
import SpicePhoto from '../public/Images/SpicesCategories.jpg';
import ImportedPhoto from '../public/Images/ImportedGoodsCategories.jpg';
import { HomePageCategory } from "@/Types/Homepagetypes";

const categories: HomePageCategory[] = [
  {
    label: "Shossho",
    bangla: "শস্য",
    slug: "shossho",
    image: CropsPhoto,
    border: "border-[#e2d5b8]",
    count: 3,
  },
  {
    label: "Moshla",
    bangla: "মশলা",
    slug: "moshla",
    image: SpicePhoto,
    border: "border-[#f2d5c4]",
    count: 5,
  },
  {
    label: "Fruits",
    bangla: "ফলমূল",
    slug: "fruits",
    image: FruitsPhoto,
    border: "border-[#eedfa0]",
    count: 2,
  },
  {
    label: "Oil",
    bangla: "তেল",
    slug: "oil",
    image: OilPhoto,
    border: "border-[#c8dfc8]",
    count: 4,
  },
  {
    label: "Imported Goods",
    bangla: "আমদানি পণ্য",
    slug: "imported-goods",
    image: ImportedPhoto,
    border: "border-[#c8c8df]",
    count: 1,
  },
];

export default function FeaturedCategories() {
  return (
    <section className="bg-[#fdf5ee] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2c1a0e] leading-tight">
            Featured Categories
          </h2>
          <p className="text-sm text-[#a07850] mt-2">
            Pure & locally sourced — straight from the farm
          </p>
          <div className="mx-auto mt-3 w-12 h-0.5 rounded-full bg-[#8B0000]" />
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map(({ label, bangla, slug, image, border, count }) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className={[
                "group flex flex-col items-center text-center",
                "bg-white border rounded-2xl overflow-hidden",
                border,
                "hover:shadow-lg hover:-translate-y-1",
                "transition-all duration-200",
              ].join(" ")}
            >
              {/* Image area */}
              <div className="relative w-full aspect-square overflow-hidden bg-[#fdf5ee]">
                <Image
                  src={image}
                  alt={label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text area */}
              <div className="w-full px-3 py-3 sm:py-4">
                <p className="text-[13px] sm:text-sm font-semibold text-[#2c1a0e] leading-tight">
                  {label}
                </p>
                <p className="text-[11px] text-[#a07850] mt-0.5">{bangla}</p>
                <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#fdf5ee] text-[#8B0000] border border-[#f2d5c4]">
                  {count} item{count !== 1 ? "s" : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── View all — centered below cards ── */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B0000] border border-[#8B0000] px-6 py-2.5 rounded-xl hover:bg-[#8B0000] hover:text-white transition-all duration-200"
          >
            View all categories
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

      </div>
    </section>
  );
}