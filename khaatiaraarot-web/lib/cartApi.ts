import api from "./axiosinterceptor";

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
  try {
    const { data } = await api.get("/api/v1/cart");
    return data
  } catch (err) {
    console.error("Failed to fetch cart:", err);
  }
};

export const updateCartItem = async (
  productId: string,
  quantity: number
) => {
  return api.patch(`/api/v1/cart/items/${productId}`, {
    quantity,
  });
};

export const deleteCartItem = async (productId: string) => {
  return api.delete(`/api/v1/cart/items/${productId}`);
};