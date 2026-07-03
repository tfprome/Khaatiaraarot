import { Truck, ShieldCheck, RefreshCw } from "lucide-react";

export function TrustBadges() {
  const badges = [
    { icon: Truck, label: "Rapid Delivery", sub: "On all orders" },
    { icon: ShieldCheck, label: "100% Pure", sub: "Verified quality" },
    { icon: RefreshCw, label: "Easy Returns", sub: "Hassle-free" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 border border-[#f0e8e7] rounded-2xl p-3">
      {badges.map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex flex-col items-center text-center gap-1 py-1">
          <Icon size={18} className="text-[#5B1A18]" />
          <span className="text-xs font-semibold text-[#2d1010]">{label}</span>
          <span className="text-[10px] text-[#9b7b7a]">{sub}</span>
        </div>
      ))}
    </div>
  );
}