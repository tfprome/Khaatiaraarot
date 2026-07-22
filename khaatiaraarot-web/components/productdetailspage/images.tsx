import { useState } from "react";
import { ImageType } from "@/Types/ProductTypes";

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



// 1. Fixed type: removed | string[] because your backend sends objects
export function ImageGallery({ images, name }: { images: ImageType[]; name: string }) {
  const [active, setActive] = useState(0);

  // 2. Early return: If no images, show initials and stop here.
  if (images.length === 0) {
    return (
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#f9f1f0] border border-[#f0e8e7]">
        {getInitial(name)}
      </div>
    );
  }

  // 3. If we get past the if statement, we GUARANTEE images exist.
  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden">
        <img
          src={images[active].url}
          alt={name}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
              active === i
                ? "border-[#5B1A18]"
                : "border-[#f0e8e7] hover:border-[#d4b8b7]"
            }`}
          >
            <img 
              src={img.url} 
              alt={`${name} ${i + 1}`} 
              className="w-full h-full object-contain" 
            />
          </button>
        ))}
      </div>
    </div>
  );
}