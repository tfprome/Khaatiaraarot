import { Package } from "lucide-react";
import { Orderdetails } from "@/Types/orderTypes";
import { useRouter } from "next/navigation";
import { STATUS_CONFIG } from "../orderdetailspage/statustimeline";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-BD", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function OrderCard({ order }: { order:Orderdetails }) {
  const router = useRouter()
  return (
    <div onClick={() => { router.push(`/orderdetails/${order.id}`) }}
      className="flex items-center gap-4 p-4 rounded-2xl border border-[#f0e8e7] bg-white cursor-pointer hover:border-[#d4b8b7] transition-colors">
      <div className="w-11 h-11 rounded-xl bg-[#f9f1f0] flex items-center justify-center flex-shrink-0">
        <Package className="w-5 h-5 text-[#5B1A18]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#2d1010] truncate">Order Number: {order.orderNumber}</p>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0 ${STATUS_CONFIG[order.status].bg} ${STATUS_CONFIG[order.status].color}`}>
            {STATUS_CONFIG[order.status].label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-xs text-[#9b7b7a]">{formatDate(order.createdAt)}</p>
          <span className="text-[#d4b8b7]">·</span>
          <p className="text-xs text-[#9b7b7a]">{order.paymentMethod}</p>
          <span className="text-[#d4b8b7]">·</span>
          <p className="text-xs font-semibold text-[#5B1A18]">৳{order.total}</p>
        </div>
      </div>
    </div>
  );
}