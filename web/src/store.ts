import { configureStore } from "@reduxjs/toolkit";

import { api } from "./features/api";
import cartSliceReducer from "./features/cart/slice";
import authSliceReducer from "./features/auth/slice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
