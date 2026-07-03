import api from "./axiosinterceptor";

export const addToWish = async (
    productId: string,
) => {
    const res = await api.post(
        "/api/v1/wishlist/items",
        {
            productId,
        }
    );

    return res.data;
};

export const fetchWishlist = async (page: number, limit: number) => {
    try {
        const res = await api.get("/api/v1/wishlist");
        return res.data
    } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        throw err
    }
};

export const removefromwishlist = async (id:string) => {
    try {
        const res = await api.delete(`/api/v1/wishlist/items/${id}`);
        return res.data
    } catch (err) {
        console.error("Failed to delete item:", err);
        throw err
    }
};