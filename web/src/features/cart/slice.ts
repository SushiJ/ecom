import { createSlice } from "@reduxjs/toolkit";

import { getLocalStorage } from "../../lib/localStorage";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { Product } from "../../types";

type AddToCart = {
  data: Product;
  quantity: number;
};

type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type InitialState = {
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
};

const cartItems = getLocalStorage("cart");

// TODO: add more payment providers
const initialState: InitialState = cartItems
  ? cartItems
  : {
      products: [],
      totalAmount: 0,
      shippingAddress: {},
      paymentMethod: "PayPal",
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCart>) => {
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
        localStorage.setItem("cart", JSON.stringify(state));
        return;
      }

      existingProduct.quantity += newProduct.quantity;
      state.totalAmount += existingProduct.product.price * newProduct.quantity;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    // TODO: Ability to remove products 1 by 1;
    removeFromCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      let productQuantity: number | null = null;
      state.products = state.products.filter((p) => {
        productQuantity = p.quantity;
        return p.product._id !== product._id;
      });
      if (productQuantity) {
        state.totalAmount -= product.price * productQuantity;
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    resetCart: (state) => {
      state.products = [];
      state.totalAmount = 0;
      (state.paymentMethod = ""), (state.shippingAddres = {});
    },
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const selectCartItems = (state: RootState) => state.cart.products;

export const { addToCart, removeFromCart, resetCart, saveShippingAddress } =
  cartSlice.actions;

export default cartSlice.reducer;
