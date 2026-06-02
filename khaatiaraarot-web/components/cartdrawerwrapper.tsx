"use client";

import { useCart } from "@/context/cartcontext";
import CartDrawer from "./cartdrawer";
import { useRouter } from "next/navigation";

export default function CartDrawerWrapper() {
  const { items, updateQuantity, removeItem } = useCart();
  const router = useRouter();

  return (
    <CartDrawer
      items={items}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onCheckout={() => router.push("/checkout")}
      onViewCart={() => router.push("/cart")}
    />
  );
}