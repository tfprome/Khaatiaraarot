import { CartProduct } from "@/Types/cartTypes";
import api from "./axiosinterceptor";
import { ProductDetailstype } from "@/Types/ProductTypes";

export const addToCart = async (
  productId: string,
  quantity: number = 1
) => {
  const { data } = await api.post(
    "/api/v1/cart/items",
    {
      productId,
      quantity,
    }
  );
  return data;
};

export const fetchCart = async () => {
  const { data } = await api.get("/api/v1/cart");
  return data;
};

export const updateCartItem = async (
  productId: string,
  quantity: number
) => {
  const {data}=await api.patch(`/api/v1/cart/items/${productId}`, {
    quantity,
  });
  return data;
};

export const deleteCartItem = async (productId: string) => {
  return api.delete(`/api/v1/cart/items/${productId}`);
};

export const saveBuyNowItem = (product: ProductDetailstype) => {
  localStorage.setItem(
    "buyNowItem",
    JSON.stringify({
      product,
      quantity: 1,
    })
  );
};

export const getBuyNowItem = () => {
  const item = localStorage.getItem("buyNowItem");

  if (!item) return null;

  return JSON.parse(item);
};

export const clearBuyNowItem = () => {
  localStorage.removeItem("buyNowItem");
};