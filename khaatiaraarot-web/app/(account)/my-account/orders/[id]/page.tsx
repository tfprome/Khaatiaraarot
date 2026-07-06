"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axiosinterceptor";
import {
  ChevronRight,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
  Receipt,
  Phone,
  User,
  Hash,
} from "lucide-react";
import { ShippingAddress, Orderdetails, StatusHistory, ProductSnapshot, OrderItem } from "@/Types/orderTypes";




// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Orderdetails["status"], { label: string; color: string; bg: string; border: string; icon: any }> = {
  pending:    { label: "Pending",    color: "text-yellow-700", bg: "bg-yellow-50",  border: "border-yellow-200", icon: Clock },
  confirmed:  { label: "Confirmed",  color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   icon: CheckCircle },
  processing: { label: "Processing", color: "text-purple-700", bg: "bg-purple-50",  border: "border-purple-200", icon: Package },
  shipped:    { label: "Shipped",    color: "text-indigo-700", bg: "bg-indigo-50",  border: "border-indigo-200", icon: Truck },
  delivered:  { label: "Delivered",  color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200",  icon: CheckCircle },
  cancelled:  { label: "Cancelled",  color: "text-red-700",    bg: "bg-red-50",     border: "border-red-200",    icon: XCircle },
};

const PAYMENT_STATUS_CONFIG: Record<Orderdetails["paymentStatus"], { label: string; color: string }> = {
  unpaid:   { label: "Unpaid",   color: "text-red-600" },
  paid:     { label: "Paid",     color: "text-green-600" },
  refunded: { label: "Refunded", color: "text-blue-600" },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash:  "Cash on Delivery",
  card:  "Online Payment",
  bkash: "bKash",
  nagad: "Nagad",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-BD", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-BD", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[#f0e8e7] rounded-xl ${className}`} />;
}

function PageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

// ─── Cancel modal ─────────────────────────────────────────────────────────────
function CancelModal({
  orderNumber,
  onConfirm,
  onClose,
  loading,
}: {
  orderNumber: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
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
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#f0e8e7] text-sm font-semibold text-[#9b7b7a] hover:border-[#d4b8b7] transition-colors"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Status timeline ──────────────────────────────────────────────────────────
function StatusTimeline({ history }: { history: StatusHistory[] }) {
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

// ─── Section card ─────────────────────────────────────────────────────────────
function Card({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#f0e8e7]">
        <Icon size={16} className="text-[#5B1A18]" />
        <h2 className="text-sm font-bold text-[#2d1010]">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Orderdetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/v1/orders/${id}`);
        setOrder(data.data ?? data);
      } catch {
        router.push("/my-account/orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      await api.patch(`/api/v1/orders/${order.id}/cancel`);
      setOrder((prev) => prev ? { ...prev, status: "cancelled" } : prev);
      setShowCancelModal(false);
    } catch {
      // handle error — add toast here if needed
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <PageSkeleton />;
  if (!order) return null;

  const statusCfg = STATUS_CONFIG[order.status];
  const StatusIcon = statusCfg.icon;
  const paymentCfg = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const canCancel = order.status === "pending";

  return (
    <>
      {showCancelModal && (
        <CancelModal
          orderNumber={order.orderNumber}
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          loading={cancelling}
        />
      )}

      <div className="min-h-screen bg-[#fdf8f7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#9b7b7a] mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#5B1A18] transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link href="/my-account/orders" className="hover:text-[#5B1A18] transition-colors">My Orders</Link>
            <ChevronRight size={13} />
            <span className="text-[#2d1010] font-medium">{order.orderNumber}</span>
          </nav>

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#2d1010]">Order Details</h1>
              <div className="flex items-center gap-2 mt-1">
                <Hash size={13} className="text-[#9b7b7a]" />
                <span className="text-sm text-[#9b7b7a] font-medium">{order.orderNumber}</span>
                <span className="text-[#d4b8b7]">·</span>
                <span className="text-xs text-[#9b7b7a]">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            {/* Status badge + cancel */}
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                <StatusIcon size={13} />
                {statusCfg.label}
              </span>
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left column — items + address + payment */}
            <div className="lg:col-span-2 space-y-4">

              {/* Order items */}
              <Card title="Order Items" icon={Package}>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 py-3 border-b border-[#f0e8e7] last:border-0 last:pb-0">
                      {/* Product icon placeholder */}
                      <div className="w-12 h-12 rounded-xl bg-[#f9f1f0] flex items-center justify-center flex-shrink-0">
                        <Package size={20} className="text-[#9b7b7a]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#2d1010] truncate">
                          {item.productSnapshot.name}
                        </p>
                        <p className="text-xs text-[#9b7b7a] mt-0.5">
                          {item.productSnapshot.sourceRegion} · per {item.productSnapshot.unit}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#9b7b7a]">৳{item.unitPrice} × {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-[#5B1A18] flex-shrink-0">
                        ৳{item.totalPrice}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price summary */}
                <div className="mt-4 pt-4 border-t border-[#f0e8e7] space-y-2">
                  {[
                    { label: "Subtotal",     value: `৳${order.subtotal}` },
                    { label: "Delivery Fee", value: parseFloat(order.deliveryFee) === 0 ? "Free" : `৳${order.deliveryFee}` },
                    { label: "Discount",     value: parseFloat(order.discount) > 0 ? `-৳${order.discount}` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-[#9b7b7a]">{label}</span>
                      <span className="text-[#2d1010]">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-[#f0e8e7]">
                    <span className="text-[#2d1010]">Total</span>
                    <span className="text-[#5B1A18]">৳{order.total}</span>
                  </div>
                </div>
              </Card>

              {/* Shipping address */}
              <Card title="Delivery Address" icon={MapPin}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[#9b7b7a]" />
                    <span className="text-sm font-semibold text-[#2d1010]">
                      {order.shippingAddressSnapshot.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#9b7b7a]" />
                    <span className="text-sm text-[#4a2020]">
                      {order.shippingAddressSnapshot.phone}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-[#9b7b7a] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#4a2020] leading-relaxed">
                      {order.shippingAddressSnapshot.line1}
                      {order.shippingAddressSnapshot.line2 && `, ${order.shippingAddressSnapshot.line2}`}
                      {`, ${order.shippingAddressSnapshot.city}`}
                      {`, ${order.shippingAddressSnapshot.district}`}
                      {order.shippingAddressSnapshot.postalCode && ` - ${order.shippingAddressSnapshot.postalCode}`}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Payment */}
              <Card title="Payment Info" icon={CreditCard}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9b7b7a]">Method</span>
                    <span className="text-sm font-semibold text-[#2d1010]">
                      {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9b7b7a]">Status</span>
                    <span className={`text-sm font-semibold ${paymentCfg.color}`}>
                      {paymentCfg.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9b7b7a]">Source</span>
                    <span className="text-sm font-semibold text-[#2d1010] capitalize">{order.source}</span>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              {order.notes && (
                <Card title="Order Notes" icon={Receipt}>
                  <p className="text-sm text-[#4a2020]">{order.notes}</p>
                </Card>
              )}
            </div>

            {/* Right column — status timeline */}
            <div className="space-y-4">
              <Card title="Order Timeline" icon={Clock}>
                <StatusTimeline history={order.statusHistory} />
              </Card>

              {/* Cancel reminder on mobile */}
              {canCancel && (
                <div className="lg:hidden bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-xs text-red-600 font-medium mb-3">
                    You can still cancel this order since it hasn't been confirmed yet.
                  </p>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}