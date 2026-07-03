import api from "./axiosinterceptor";
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