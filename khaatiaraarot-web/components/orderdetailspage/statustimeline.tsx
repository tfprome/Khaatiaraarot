import { Orderdetails } from "@/Types/orderTypes";
import { Clock, CheckCircle, Package, Truck, XCircle } from "lucide-react";

export const STATUS_CONFIG: Record<Orderdetails["status"], { label: string; color: string; bg: string; border: string; icon: any }> = {
  pending:    { label: "Pending",    color: "text-yellow-700", bg: "bg-yellow-50",  border: "border-yellow-200", icon: Clock },
  confirmed:  { label: "Confirmed",  color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   icon: CheckCircle },
  processing: { label: "Processing", color: "text-purple-700", bg: "bg-purple-50",  border: "border-purple-200", icon: Package },
  shipped:    { label: "Shipped",    color: "text-indigo-700", bg: "bg-indigo-50",  border: "border-indigo-200", icon: Truck },
  delivered:  { label: "Delivered",  color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200",  icon: CheckCircle },
  cancelled:  { label: "Cancelled",  color: "text-red-700",    bg: "bg-red-50",     border: "border-red-200",    icon: XCircle },
};



function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-BD", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function StatusTimeline({ history }: { history: any[] }) {
  return (
    <div className="space-y-0">
      {history.map((entry, i) => {
        const cfg = STATUS_CONFIG[entry.status as Orderdetails["status"]] ?? STATUS_CONFIG.pending;
        const Icon = cfg.icon;
        const isLast = i === history.length - 1;
        return (
          <div key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${cfg.bg} ${cfg.border}`}>
                <Icon size={14} className={cfg.color} />
              </div>
              {!isLast && <div className="w-0.5 h-6 bg-[#f0e8e7] my-1" />}
            </div>
            <div className="pb-4 min-w-0">
              <p className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</p>
              <p className="text-xs text-[#9b7b7a]">{entry.note}</p>
              <p className="text-xs text-[#9b7b7a] mt-0.5">{formatDateShort(entry.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}