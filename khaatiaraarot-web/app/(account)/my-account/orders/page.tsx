"use client";

import { ShoppingBag } from "lucide-react";
import AccountPageHeader from "@/components/account/accountpageHeader";
import EmptyState from "@/components/account/emptystate";
import OrderCard from "@/components/account/ordercard";
import { Order } from "@/Types/orderTypes";
import { useState, useEffect } from "react";
import { getOrders } from "@/lib/orderApi";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'
import PaginationControls from "@/components/pagination/paginationcontrol";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);
  console.log(isAuthenticated)

  useEffect(() => {
    const handleOrders = async () => {
      try {
        const res = await getOrders(page, limit);
        setOrders(res.data.data);
        setTotal(res.data.total)
      } catch (error: any) {
        if (error?.status === 401) {
          router.push("/login");
          toast("Please login to view your profile", {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            className: 'cart-success-toast'
          });
        }
        //console.log("Failed to fetch orders:", error);
      }
    };
    handleOrders();
  }, [page,limit]);

  const totalPages = Math.ceil(total / limit);
  return (
    <>
      <AccountPageHeader title="My Orders" description="Track and view your past orders" />
      <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm p-5 sm:p-7">
        {orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            message="When you place an order, it'll show up here."
            action={{ label: "Start shopping", href: "/shop" }}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}