"use client";

import CartDrawer from "./cartdrawer";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export default function CartDrawerWrapper() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const items = useAppSelector(
    (state) => state.cart.items
  );

  return (
    <CartDrawer
      onCheckout={() => router.push("/checkout")}
      onViewCart={() => router.push("/cart")}
    />
  );
}