"use client";

import CartDrawer from "./cartdrawer";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeItem,
  updateQuantity,
} from "@/store/cartSlice";
import { useEffect } from "react";

export default function CartDrawerWrapper() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const items = useAppSelector(
    (state) => state.cart.items
  );

//   useEffect(() => {
//   console.log("CartDrawerWrapper mounted");
// }, []);

  return (
    <CartDrawer
      onUpdateQuantity={(id:string, quantity:number) =>
        dispatch(updateQuantity({ id, quantity }))
      }
      onRemoveItem={(id:string) =>
        dispatch(removeItem(id))
      }
      onCheckout={() => router.push("/checkout")}
      onViewCart={() => router.push("/cart")}
    />
  );
}