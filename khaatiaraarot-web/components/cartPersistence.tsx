"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/store/hooks";
import { useAppSelector } from "@/store/hooks";

import { hydrateCart } from "../store/cartSlice";

export default function CartPersistence() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(
    (state) => state.cart.items
  );

  // Load cart once
  useEffect(() => {
    const storedCart =
      localStorage.getItem("cart");

    if (storedCart) {
      dispatch(
        hydrateCart(JSON.parse(storedCart))
      );
    }
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