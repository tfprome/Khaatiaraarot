import { useState } from "react";
import { Star } from "lucide-react";

export function Tabs({ description }: { description: string }) {
    const [tab, setTab] = useState<"description" | "details" | "reviews">("description");

    return (
        <div className="mt-10 border border-[#f0e8e7] rounded-2xl overflow-hidden bg-white">
            {/* Tab bar */}
            <div className="flex border-b border-[#f0e8e7]">
                {(["description", "details", "reviews"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-3.5 text-sm font-semibold capitalize transition-colors ${tab === t
                            ? "text-[#5B1A18] border-b-2 border-[#5B1A18] -mb-px bg-white"
                            : "text-[#9b7b7a] hover:text-[#5B1A18]"
                            }`}
                    >
                        {t === "reviews" ? "Reviews (0)" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="p-5 sm:p-7">
                {tab === "description" && (
                    <p className="text-sm text-[#4a2020] leading-relaxed">{description}</p>
                )}
                {tab === "details" && (
                    <p className="text-sm text-[#9b7b7a]">No additional details available.</p>
                )}
                {tab === "reviews" && (
                    <div className="flex flex-col items-center py-8 text-center">
                        <Star className="w-8 h-8 text-[#f0e8e7] mb-3" />
                        <p className="text-sm font-semibold text-[#2d1010]">No reviews yet</p>
                        <p className="text-xs text-[#9b7b7a] mt-1">Be the first to review this product.</p>
                    </div>
                )}
            </div>
        </div>
    );
}