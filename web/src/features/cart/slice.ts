import { createSlice } from "@reduxjs/toolkit";

import { getLocalStorage } from "../../lib/localStorage";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { Product } from "../../types";

type InitialState = {
  items: Array<Product>;
};
const cartItems = getLocalStorage("cart");

const initialState: InitialState = cartItems ? cartItems : { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const item = action.payload;

      const existItem = state.items.find((p) => p._id === item._id);
      if (!existItem) {
        state.items.push(item);
        return;
      }
    },
  },
});

export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
