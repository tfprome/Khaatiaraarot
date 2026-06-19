import { MapPin, Pencil, Trash2 } from "lucide-react";

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  isDefault?: boolean;
}

export default function AddressCard({ address }: { address: Address }) {
  return (
    <div className={`p-5 rounded-2xl border bg-white transition-colors ${address.isDefault ? "border-[#5B1A18]" : "border-[#f0e8e7] hover:border-[#d4b8b7]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f9f1f0] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-[#5B1A18]" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#2d1010]">{address.label}</span>
            {address.isDefault && (
              <span className="ml-2 text-[10px] font-semibold bg-[#5B1A18] text-white px-2 py-0.5 rounded-full">Default</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg text-[#9b7b7a] hover:text-[#5B1A18] hover:bg-[#f9f1f0] transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg text-[#9b7b7a] hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-3 pl-10 text-sm text-[#9b7b7a] leading-relaxed">
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>{address.city}</p>
      </div>
    </div>
  );
}