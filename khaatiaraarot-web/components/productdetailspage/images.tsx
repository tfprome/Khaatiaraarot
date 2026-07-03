import { useState } from "react";
const PLACEHOLDER = "/Images/placeholder-product.png"; // your placeholder

export function getInitial(name: string) {
    const initials = name
        ?.trim()
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

    return (
        <div className="w-full h-full flex items-center justify-center text-black font-bold text-lg sm:text-xl">
            {initials}
        </div>
    );
}

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const imgs = images.length > 0 ? images : [PLACEHOLDER];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f9f1f0] border border-[#f0e8e7]">
        <img
          src={imgs[active]}
          alt={name}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Thumbnails */}
      {imgs? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-18 h-18 rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-[#5B1A18]" : "border-[#f0e8e7] hover:border-[#d4b8b7]"
                }`}
            >
              <img src={src} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      ):getInitial(name)}
    </div>
  );
}