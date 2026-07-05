export type paymentpayloadtype = {
    paymentMethod: string;
    notes: string;
    address: {
        fullName: string;
        phone: string;
        line1: string;
        line2?: string;
        city: string;
        district: string;
        postalCode?: string;
    };
    items?: { productId: string; quantity: number }[];
};

export interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  total: number;
  items: number;
  createdAt: string
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode?: string;
}

export interface ProductSnapshot {
  name: string;
  unit: string;
  price: string;
  sourceRegion: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productSnapshot: ProductSnapshot;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface StatusHistory {
  id: string;
  orderId: string;
  status: string;
  note: string;
  changedBy: string;
  createdAt: string;
}

export interface Orderdetails {
  id: string;
  userId: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "unpaid" | "paid" | "refunded";
  subtotal: string;
  deliveryFee: string;
  discount: string;
  total: number;
  notes: string;
  source: string;
  shippingAddressSnapshot: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  statusHistory: StatusHistory[];
}