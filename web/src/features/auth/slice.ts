import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getLocalStorage } from "../../lib/localStorage";

type initialState = {
  userInfo: {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
};

const initialState: initialState = {
  userInfo: getLocalStorage("user") ? getLocalStorage("user") : null,
};

type ActionType = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<ActionType>) => {
      state.userInfo = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    resetCreds: (state) => {
      state.userInfo = {};
      localStorage.setItem("user", "");
    },
  },
});

export const { setCredentials, resetCreds } = authSlice.actions;

export default authSlice.reducer;
