export interface CartItem {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    unit: string;
    image: string;
  }

export interface CartContextValue {
    items: CartItem[];
    totalQty: number;
    subtotal: number;
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
  }

  export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}