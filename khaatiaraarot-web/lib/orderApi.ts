import api from "./axiosinterceptor";
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
import { paymentpayloadtype } from "@/Types/orderTypes";

export const createOrder = async (payload: paymentpayloadtype,idempotecyKey:string) => {
  const token = localStorage.getItem("userToken");

  return api.post(
    'api/v1/orders',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "idempotency-key": idempotecyKey,
      },
    }
  );
};

export const getOrders = async (page:number,limit:number) => {
  return api.get(`/api/v1/orders?page=${page}&limit=${limit}`);
};