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
    }};

export interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  total: number;
  items: number;
}