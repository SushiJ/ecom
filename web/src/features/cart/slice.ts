import { createSlice } from "@reduxjs/toolkit";

import { getLocalStorage } from "../../lib/localStorage";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { Product } from "../../types/product";

type AddToCart = {
  data: Product;
  quantity: number;
};

type TUpdateQuantityOfItem = AddToCart;

type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
};

type InitialState = {
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress?: ShippingAddress;
  paymentMethod: string;
};

// TODO: need different way than an enum
type Payment = "paypal" | "razorpay" | "stripe";

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
        ({ product }) => product._id === newProduct.data._id
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
    // TODO: Round out the numbers
    removeFromCart: (state, action: PayloadAction<Product["_id"]>) => {
      const productId = action.payload;

      let productQuantity: number | null = null;

      const productToRemove = state.products.find(p => p.product._id === productId);
      if (!productToRemove) return;

      state.products = state.products.filter(p => {
        productQuantity = productToRemove.quantity;
        return p.product._id !== productId;
      });

      if (!productQuantity) return;

      state.totalAmount -= productToRemove.product.price * productQuantity;

      localStorage.setItem("cart", JSON.stringify(state));
    },
    updateQuantityOfItem: (state, action: PayloadAction<TUpdateQuantityOfItem>) => {
      const p = action.payload.data;

      let productQuantity: number = action.payload.quantity;

      const product = state.products.find(({ product }) => product._id === p._id);
      if (!product) return;

      product.quantity = productQuantity;
      state.totalAmount = product.product.price * productQuantity;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    resetCart: state => {
      state.products = [];
      state.totalAmount = 0;
      localStorage.setItem("cart", "");
    },
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    savePaymentMethod: (state, action: PayloadAction<Payment>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const selectCartItems = (state: RootState) => state.cart.products;

export const {
  addToCart,
  removeFromCart,
  resetCart,
  saveShippingAddress,
  savePaymentMethod,
  updateQuantityOfItem,
} = cartSlice.actions;

export default cartSlice.reducer;
