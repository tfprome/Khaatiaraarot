"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/store/hooks";
import { useAppSelector } from "@/store/hooks";

export default function CartPersistence() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(
    (state) => state.cart.items
  );

  // Load cart once
  useEffect(() => {
    const storedCart =
      localStorage.getItem("cart");
  }, [dispatch]);

  // Save whenever cart changes
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(items)
    );
  }, [items]);

  return null;
}