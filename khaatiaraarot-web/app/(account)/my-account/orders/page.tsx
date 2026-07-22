"use client";

import { ShoppingBag } from "lucide-react";
import AccountPageHeader from "@/components/account/accountpageHeader";
import EmptyState from "@/components/account/emptystate";
import OrderCard from "@/components/account/ordercard";
import { Orderdetails } from "@/Types/orderTypes";
import { useState, useEffect } from "react";
import axios from "axios";
import { getOrders } from "@/lib/orderApi";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'
import PaginationControls from "@/components/pagination/paginationcontrol";
import OrdersPageSkeleton from "@/components/skeleton/orderpageSkeleton";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Orderdetails[]>([])
  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
   const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);
  //console.log(isAuthenticated)

  useEffect(() => {
    const handleOrders = async () => {
      try {
        const res = await getOrders(page, limit);
        setOrders(res.data.data);
        setTotal(res.data.total)
      } catch (error: any) {
        if (axios.isAxiosError(error) && error?.response?.status === 401) {
          router.push("/login");
          toast("Please login to view your profile", {
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            className: 'success-toast'
          });
        }
        //console.log("Failed to fetch orders:", error);
      }
      finally {
        setIsLoading(false); // Set loading to false after the request is complete
      }
    };
    handleOrders();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

   if (isLoading) {
    return (
      <>
        <AccountPageHeader title="My Orders" description="Track and view your past orders" />
        <OrdersPageSkeleton />
      </>
    );
  }
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
      </div>

      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}