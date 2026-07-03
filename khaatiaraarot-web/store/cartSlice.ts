import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "@/Types/cartTypes";

const initialState: CartState = {
  items: [],
  isOpen: false,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openCart(state) {
      state.isOpen = true;
    },

    closeCart(state) {
      state.isOpen = false;
    },
    setItemCount(state, action: PayloadAction<number>) {
      state.itemCount = action.payload;
    }
  },
});

export const {
  openCart,
  closeCart,
  setItemCount,
} = cartSlice.actions;

export default cartSlice.reducer;