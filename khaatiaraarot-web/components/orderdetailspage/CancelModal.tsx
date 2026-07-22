import { AlertCircle } from "lucide-react";

export function CancelModal({ orderNumber, onConfirm, onClose, loading }: { orderNumber: string; onConfirm: () => void; onClose: () => void; loading: boolean; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-[#2d1010] text-center mb-1">Cancel Order?</h3>
        <p className="text-sm text-[#9b7b7a] text-center mb-6">
          Are you sure you want to cancel <span className="font-semibold text-[#2d1010]">{orderNumber}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl cursor-pointer border-2 border-[#f0e8e7] text-sm font-semibold text-[#9b7b7a] hover:border-[#d4b8b7] transition-colors">Keep Order</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 cursor-pointer text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60">
            {loading ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}