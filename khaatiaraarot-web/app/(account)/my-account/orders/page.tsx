"use client";

import { ShoppingBag } from "lucide-react";
import AccountPageHeader from "@/components/account/accountpageHeader";
import EmptyState from "@/components/account/emptystate";
import OrderCard, { Order } from "@/components/account/ordercard";

// Replace with real API fetch when ready
const MOCK_ORDERS: Order[] = [];

export default function OrdersPage() {
  return (
    <>
      <AccountPageHeader title="My Orders" description="Track and view your past orders" />
      <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm p-5 sm:p-7">
        {MOCK_ORDERS.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            message="When you place an order, it'll show up here."
            action={{ label: "Start shopping", href: "/shop" }}
          />
        ) : (
          <div className="space-y-3">
            {MOCK_ORDERS.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}