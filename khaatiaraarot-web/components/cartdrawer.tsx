"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShoppingBagIcon,
  ShoppingCartSimple,
  X,
  Plus,
  MinusIcon,
  LockKeyIcon
} from "@phosphor-icons/react";
import { CartItem } from "@/Types/cartTypes";
import { useAppDispatch } from "@/store/hooks";
import { useAppSelector } from "@/store/hooks";
import { closeCart, openCart, removeItem, updateQuantity } from "@/store/cartSlice";

interface CartDrawerProps {
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout?: () => void;
  onViewCart?: () => void;
}

const FREE_DELIVERY_THRESHOLD = 500;

function fmt(n: number) {
  return `৳${Math.round(n).toLocaleString("en-IN")}`;
}

function ItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-3 py-3 border-b border-[#e4eede] last:border-0 group relative">
      <div className="w-14 h-14 shrink-0 rounded-xl bg-[#eef6e4] border border-[#d0e8c0] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-1.5"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://placehold.co/56x56/eef6e4/3a7a30?text=${item.name.slice(0, 2)}`;
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#5B1A18] leading-tight truncate">
              {item.name}
            </p>
            <p className="text-[11px] text-[#9aaa88] mt-0.5">{item.unit}</p>
          </div>
          <button
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#b0b8a0] hover:text-red-500 shrink-0 mt-0.5"
          >
            <X size={13} weight="bold" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[13px] font-semibold text-[#2d6a2d]">
              {fmt(item.price * item.quantity)}
            </span>
            {item.originalPrice && (
              <span className="text-[11px] line-through text-[#b0b8a0]">
                {fmt(item.originalPrice * item.quantity)}
              </span>
            )}
          </div>

          <div className="flex items-center bg-[#eef6e4] border border-[#c8ddb0] rounded-lg overflow-hidden">
            <button
              onClick={onDecrease}
              aria-label="Decrease quantity"
              className="w-7 h-7 flex items-center justify-center text-[#2d6a2d] hover:bg-[#d8ecc8] transition-colors"
            >
              <MinusIcon size={12} weight="bold" />
            </button>
            <span className="w-6 text-center text-[12px] font-semibold text-[#1a3a1a]">
              {item.quantity}
            </span>
            <button
              onClick={onIncrease}
              aria-label="Increase quantity"
              className="w-7 h-7 flex items-center justify-center text-[#2d6a2d] hover:bg-[#d8ecc8] transition-colors"
            >
              <Plus size={12} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer({
  onCheckout,
  onViewCart,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  // const [isOpen, setIsOpen] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const prevCount = useRef(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.cart.isOpen);
  const items = useAppSelector((state) => state.cart.items);

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings = items.reduce(
    (s, i) => s + ((i.originalPrice ?? i.price) - i.price) * i.quantity,
    0
  );
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const deliveryPct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  useEffect(() => {
    if (totalQty > prevCount.current) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 300);
      prevCount.current = totalQty;
      return () => clearTimeout(t);
    }
    prevCount.current = totalQty;
  }, [totalQty]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node))
        dispatch(closeCart());
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeCart());
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleIncrease(id: string, qty: number) {
    dispatch(updateQuantity({ id, quantity: qty + 1 }));
  }

  function handleDecrease(id: string, qty: number) {
    if (qty <= 1) {
      dispatch(removeItem(id));
    } else {
      dispatch(updateQuantity({ id, quantity: qty - 1 }));
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => dispatch(openCart())}
        aria-label={`Open cart, ${totalQty} items`}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#5A1A18] cursor-pointer shadow-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
      >
        <ShoppingBagIcon size={24} weight="bold" />
        {totalQty > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-[11px] font-semibold flex items-center justify-center bg-[#d4611e] text-white transition-transform duration-200 ${badgePulse ? "scale-150" : "scale-100"
              }`}
          >
            {totalQty}
          </span>
        )}
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full z-70 w-90 max-w-full flex flex-col bg-[#fafcf7] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#5B1A18] shrink-0">
          <div>
            <h2 className="text-white font-semibold text-[15px]">Your cart</h2>
            <p className="text-[#FC8F0A] text-[11px] mt-0.5">
              {totalQty === 0
                ? "No items yet"
                : `${totalQty} item${totalQty !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <X size={15} weight="bold" />
          </button>
        </div>

        {/* Delivery banner */}
        {totalQty > 0 && remaining > 0 && (
          <div className="px-5 py-3 bg-[#fffbf0] border-b border-[#f0e8c0] shrink-0">
            <p className="text-[11px] text-[#7a6010] mb-1.5">
              Add{" "}
              <span className="font-semibold text-[#c07010]">{fmt(remaining)}</span>{" "}
              more for free delivery!
            </p>
            <div className="h-1.5 rounded-full bg-[#ede0a0] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#e0a020] transition-all duration-500"
                style={{ width: `${deliveryPct}%` }}
              />
            </div>
          </div>
        )}
        {totalQty > 0 && remaining === 0 && (
          <div className="px-5 py-2.5 bg-[#eef8e4] border-b border-[#b8e098] text-center shrink-0">
            <p className="text-[11px] font-semibold text-[#5B1A18]">
              You unlocked free delivery!
            </p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#FCEBEB] flex items-center justify-center text-[#5A1A18]">
                <ShoppingBagIcon size={32} weight="duotone" />
              </div>
              <div>
                <p className="font-semibold text-[#5B1A18] text-[13px]">
                  Your cart is empty
                </p>
                <p className="text-[11px] text-[#5B1A18] mt-1">
                  Add some fresh products
                </p>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="mt-1 px-5 py-2 rounded-full bg-[#5B1A18] text-white text-[12px] font-semibold hover:scale-105 active:scale-95 transition-transform"
              >
                Start shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onIncrease={() => handleIncrease(item.id, item.quantity)}
                onDecrease={() => handleDecrease(item.id, item.quantity)}
                onRemove={() => dispatch(removeItem(item.id))}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#d0e8c0] px-5 pt-4 pb-6 bg-white shrink-0 space-y-1.5">
            {savings > 0 && (
              <div className="flex justify-between text-[12px]">
                <span className="text-[#6a8a60]">You save</span>
                <span className="font-semibold text-[#5B1A18]">−{fmt(savings)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[#5B1A18] text-[13px]">Subtotal</span>
              <span className="font-semibold text-[#5B1A18] text-[17px]">{fmt(subtotal)}</span>
            </div>
            <p className="text-[10px] text-[#5B1A18] pb-2">
              Delivery calculated at checkout
            </p>
            <button
              onClick={() => { onCheckout?.(); dispatch(closeCart()); }}
              className="w-full py-3 rounded-xl bg-[#5B1A18] hover:bg-[#5B1A18] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              <LockKeyIcon size={15} weight="bold" />
              Checkout
            </button>
            <button
              onClick={() => { onViewCart?.(); dispatch(closeCart()); }}
              className="w-full py-2.5 rounded-xl border border-[#FCEBEB] text-[#5B1A18] font-semibold text-[12px] flex items-center justify-center gap-2 hover:bg-[#eef6e4] transition-colors"
            >
              <ShoppingBagIcon size={14} weight="regular" />
              View cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}