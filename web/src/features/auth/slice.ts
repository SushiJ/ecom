import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getLocalStorage } from "../../lib/localStorage";
import { RootState } from "../../store";

type initialState = {
  userInfo: Record<string, string>;
};

const initialState: initialState = {
  userInfo: getLocalStorage("user") ? getLocalStorage("user") : null,
};

type ActionType = {
  userInfo: Record<string, string>;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<ActionType>) => {
      state.userInfo = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const selectUserInfo = (state: RootState) => state.auth.userInfo;

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;
