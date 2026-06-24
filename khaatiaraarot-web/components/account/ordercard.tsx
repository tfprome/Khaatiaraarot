import { Package } from "lucide-react";
import { Order } from "@/Types/orderTypes";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#f0e8e7] bg-white hover:border-[#d4b8b7] transition-colors">
      <div className="w-11 h-11 rounded-xl bg-[#f9f1f0] flex items-center justify-center flex-shrink-0">
        <Package className="w-5 h-5 text-[#5B1A18]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#2d1010] truncate">Order #{order.id}</p>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLES[order.status]}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-xs text-[#9b7b7a]">{order.date}</p>
          <span className="text-[#d4b8b7]">·</span>
          <p className="text-xs text-[#9b7b7a]">{order.items} item{order.items !== 1 ? "s" : ""}</p>
          <span className="text-[#d4b8b7]">·</span>
          <p className="text-xs font-semibold text-[#5B1A18]">৳{order.total}</p>
        </div>
      </div>
    </div>
  );
}