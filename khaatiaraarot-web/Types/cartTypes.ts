import { StaticImageData } from "next/image";

export interface CartItem {
  id: string
  quantity: number
  product: CartProduct
}

export interface CartProduct {
  id: string
  name: string
  slug: string
  unit: string
  price: number
  originalPrice: any
  stockQty: number
  image: any
}


export interface CartDrawerProps {
  onCheckout?: () => void;
  onViewCart?: () => void;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
}