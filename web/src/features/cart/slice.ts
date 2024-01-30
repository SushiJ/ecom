import { createSlice } from "@reduxjs/toolkit";

import { getLocalStorage } from "../../lib/localStorage";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { Product } from "../../types";

type ActionType = {
  data: Product;
  quantity: number;
};

type InitialState = {
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  totalAmount: number;
};

const cartItems = getLocalStorage("cart");

const initialState: InitialState = cartItems
  ? cartItems
  : { products: [], totalAmount: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ActionType>) => {
      const newProduct = action.payload;

      const existingProduct = state.products.find(
        ({ product }) => product._id === newProduct.data._id,
      );

      if (!existingProduct) {
        state.products.push({
          product: newProduct.data,
          quantity: newProduct.quantity,
        });
        state.totalAmount += newProduct.data.price * newProduct.quantity;
        return;
      }

      existingProduct.quantity += newProduct.quantity;
      state.totalAmount += existingProduct.product.price * newProduct.quantity;
    },
    // TODO: Ability to remove products 1 by 1;
    removeFromCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      state.products = state.products.filter(
        (p) => p.product._id !== product._id,
      );
    },
    resetCart: (state) => {
      state.products = [];
      state.totalAmount = 0;
    },
  },
});

export const selectCartItems = (state: RootState) => state.cart.products;

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
