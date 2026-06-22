// "use client";

// import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
// import { CartItem } from '@/Types/cartTypes';
// import { CartContextValue } from '@/Types/cartTypes';


// const CartContext = createContext<CartContextValue | null>(null);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([]);

//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");

//     if (storedCart) {
//       setItems(JSON.parse(storedCart));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(items));
//   }, [items]);

//   const addItem = useCallback((product: Omit<CartItem, "quantity">) => {
//     setItems((prev) => {
//       const existing = prev.find((i) => i.id === product.id);
//       if (existing) {
//         return prev.map((i) =>
//           i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   }, []);

//   const removeItem = useCallback((id: string) => {
//     setItems((prev) => prev.filter((i) => i.id !== id));
//   }, []);

//   const updateQuantity = useCallback((id: string, quantity: number) => {
//     if (quantity <= 0) {
//       setItems((prev) => prev.filter((i) => i.id !== id));
//     } else {
//       setItems((prev) =>
//         prev.map((i) => (i.id === id ? { ...i, quantity } : i))
//       );
//     }
//   }, []);

//   const clearCart = useCallback(() => setItems([]), []);

//   const totalQty = items.reduce((s, i) => s + i.quantity, 0);
//   const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

//   return (
//     <CartContext.Provider
//       value={{ items, totalQty, subtotal, addItem, removeItem, updateQuantity, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
//   return ctx;
// }