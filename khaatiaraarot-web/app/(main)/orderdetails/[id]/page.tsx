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
  Receipt,
  User,
  Hash,
  Phone,
} from "lucide-react";
import { Orderdetails } from "@/Types/orderTypes";
import { OrderDetailsPageSkeleton } from "@/components/skeleton/orderDetailsPageSkeleton";
import { CancelModal } from "@/components/orderdetailspage/CancelModal";
import { StatusTimeline,STATUS_CONFIG } from "@/components/orderdetailspage/statustimeline";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PAYMENT_STATUS_CONFIG: Record<Orderdetails["paymentStatus"], { label: string; color: string; bg: string }> = {
  unpaid:   { label: "Unpaid",   color: "text-red-600", bg: "bg-red-50" },
  paid:     { label: "Paid",     color: "text-green-600", bg: "bg-green-50" },
  refunded: { label: "Refunded", color: "text-blue-600", bg: "bg-blue-50" },
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

// ─── Section card ─────────────────────────────────────────────────────────────
function Card({ title, icon: Icon, children, className = "" }: { title: string; icon: any; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#f0e8e7] shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#f0e8e7] bg-white">
        <Icon size={16} className="text-[#5B1A18]" />
        <h2 className="text-sm font-bold text-[#2d1010]">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  // CHANGED: Use orderNumber instead of id
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Orderdetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        // CHANGED: Fetch by order number string
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
    } catch { } finally {
      setCancelling(false);
    }
  };

  if (loading) return <OrderDetailsPageSkeleton />;
  if (!order) return null;

  const statusCfg = STATUS_CONFIG[order.status];
  const StatusIcon = statusCfg.icon;
  const paymentCfg = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const canCancel = order.status === "pending" || order.status === "confirmed";
  
  // Determine if we should show the "Pay Now" button (Not cash, and unpaid, and not cancelled)
  const requiresDigitalPayment = order.paymentMethod !== "cash" && order.paymentStatus === "unpaid" && order.status !== "cancelled";

  return (
    <>
      {showCancelModal && (
        <CancelModal orderNumber={order.orderNumber} onConfirm={handleCancel} onClose={() => setShowCancelModal(false)} loading={cancelling} />
      )}

      <div className="min-h-screen bg-[#fdf8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#9b7b7a] mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#5B1A18] transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link href="/my-account/orders" className="hover:text-[#5B1A18] transition-colors">My Orders</Link>
            <ChevronRight size={13} />
            <span className="text-[#2d1010] font-medium">{order.orderNumber}</span>
          </nav>

          {/* ── Catchy Header Banner ── */}
          <div className="relative bg-gradient-to-r from-[#5B1A18] to-[#8B3A31] rounded-2xl p-6 mb-6 text-white overflow-hidden shadow-lg">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Hash size={20} className="opacity-80" />
                  {order.orderNumber}
                </h1>
                <p className="text-sm text-white/70 mt-1">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-white/20 backdrop-blur-sm border border-white/20`}>
                  <StatusIcon size={15} />
                  {statusCfg.label}
                </span>
                {canCancel && (
                  <button onClick={() => setShowCancelModal(true)} className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Order items */}
              <Card title="Order Items" icon={Package}>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-3 rounded-xl bg-[#fdf8f7] border border-transparent hover:border-[#f0e8e7] transition-colors">
                      {/* Catchy Initial Placeholder */}
                      <div className="w-16 h-16 rounded-xl bg-[#5B1A18]/10 flex items-center justify-center flex-shrink-0 text-[#5B1A18] font-bold text-lg">
                        {item.productSnapshot.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#2d1010] truncate">{item.productSnapshot.name}</p>
                        <p className="text-xs text-[#9b7b7a] mt-1 capitalize">{item.productSnapshot.sourceRegion} · Per {item.productSnapshot.unit}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-[#9b7b7a] bg-white px-2 py-1 rounded-md border border-[#f0e8e7]">৳{item.unitPrice} × {item.quantity}</span>
                          <p className="text-sm font-extrabold text-[#2d1010]">৳{item.totalPrice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sleek Receipt Summary */}
                <div className="mt-6 bg-[#fdf8f7] rounded-xl p-4 space-y-3 border border-[#f0e8e7]">
                  {[
                    { label: "Subtotal", value: `৳${order.subtotal}`, hide: false },
                    { label: "Delivery Fee", value: parseFloat(order.deliveryFee) === 0 ? "Free" : `৳${order.deliveryFee}`, hide: false },
                    { label: "Discount", value: parseFloat(order.discount) > 0 ? `-৳${order.discount}` : "—", hide: false },
                  ].filter(r => !r.hide).map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-[#9b7b7a]">{label}</span>
                      <span className={`font-medium ${label === 'Discount' && value !== '—' ? 'text-green-600' : 'text-[#2d1010]'}`}>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-lg font-extrabold pt-3 border-t border-dashed border-[#d4b8b7]">
                    <span className="text-[#2d1010]">Total</span>
                    <span className="text-[#5B1A18]">৳{order.total}</span>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card title="Delivery Address" icon={MapPin}>
                <div className="space-y-3">
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
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#9b7b7a] uppercase tracking-wide">Shipping Address</p>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-[#9b7b7a] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#4a2020] leading-relaxed">
                        {order.shippingAddressSnapshot.line1}, {order.shippingAddressSnapshot.city}, {order.shippingAddressSnapshot.district}
                        {order.shippingAddressSnapshot.postalCode && ` - ${order.shippingAddressSnapshot.postalCode}`}
                      </span>
                    </div>
                  </div>
                  {order.shippingAddressSnapshot.line2 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-[#9b7b7a] uppercase tracking-wide">Billing Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-[#9b7b7a] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[#4a2020] leading-relaxed">
                          {order.shippingAddressSnapshot.line2}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Payment */}
              <Card title="Payment Info" icon={CreditCard}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f0e8e7] flex items-center justify-center"><User size={14} className="text-[#5B1A18]" /></div>
                    <div>
                      <p className="text-sm font-bold text-[#2d1010]">{order.shippingAddressSnapshot.fullName}</p>
                      <p className="text-xs text-[#9b7b7a]">{order.shippingAddressSnapshot.phone}</p>
                    </div>
                  </div>
                  <div className="ml-11 pl-4 border-l-2 border-[#f0e8e7]">
                    <p className="text-sm text-[#4a2020] leading-relaxed">
                      {order.shippingAddressSnapshot.line1}{order.shippingAddressSnapshot.line2 && `, ${order.shippingAddressSnapshot.line2}`}{`, ${order.shippingAddressSnapshot.city}`}{`, ${order.shippingAddressSnapshot.district}`}{order.shippingAddressSnapshot.postalCode && ` - ${order.shippingAddressSnapshot.postalCode}`}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              {order.notes && (
                <Card title="Order Notes" icon={Receipt}>
                  <p className="text-sm text-[#4a2020] italic bg-[#fdf8f7] p-3 rounded-lg border border-[#f0e8e7]">"{order.notes}"</p>
                </Card>
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-6">
              
              {/* Timeline */}
              <Card title="Order Timeline" icon={Clock}>
                <StatusTimeline history={order.statusHistory} />
              </Card>

              {/* Payment Info & Pay Now (Moved Here) */}
              <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#f0e8e7]">
                  <CreditCard size={16} className="text-[#5B1A18]" />
                  <h2 className="text-sm font-bold text-[#2d1010]">Payment Details</h2>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9b7b7a]">Method</span>
                    <span className="text-sm font-bold px-2.5 text-[#2d1010]">{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9b7b7a]">Status</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${paymentCfg.bg} ${paymentCfg.color}`}>{paymentCfg.label}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9b7b7a]">Total Due</span>
                    <span className="text-xl font-extrabold px-2.5 text-[#5B1A18]">৳{order.total}</span>
                  </div>

                  {/* ── Catchy Pay Now Button ── */}
                  {requiresDigitalPayment && (
                    <button className="w-full mt-2 py-3.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer bg-[#5A1B18] hover:from-pink-600 hover:to-rose-700">
                      {/* <Zap size={18} /> */}
                      Pay Now via {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile cancel reminder (only shows if payment is on right side and user is on mobile) */}
              {canCancel && (
                <div className="lg:hidden bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-xs text-red-600 font-medium mb-3">Changed your mind? You can cancel this order right now.</p>
                  <button onClick={() => setShowCancelModal(true)} className="w-full py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer">
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