import { createSlice } from "@reduxjs/toolkit";

import { getLocalStorage } from "../../lib/localStorage";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { Product } from "../../types";

type InitialState = {
  products: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
};

const cartItems = getLocalStorage("cart");

const initialState: InitialState = cartItems
  ? cartItems
  : { cart: [], totalAmount: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const newProduct = action.payload;

      const existingProduct = state.products.find(
        ({ product }) => product._id === newProduct._id,
      );

      if (!existingProduct) {
        state.products.push({
          product: newProduct,
          quantity: 1,
          price: newProduct.price,
        });
        state.totalAmount += newProduct.price;
        return;
      }

      state.products.map((p) => {
        if (p.product._id === existingProduct.product._id) {
          p.quantity += 1;
          p.price += p.quantity * p.product.price;
        }
      });
      state.totalAmount += existingProduct.product.price;
    },
  },
});

export const selectCartItems = (state: RootState) => state.cart.products;

export default cartSlice.reducer;
