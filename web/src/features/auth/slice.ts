import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getLocalStorage } from "../../lib/localStorage";

type initialState = {
	userInfo: {
		_id: string;
		name: string;
		email: string;
		role: string;
	};
};

const initialState: initialState = {
	userInfo: getLocalStorage("user") ? getLocalStorage("user") : null,
};

type ActionType = {
	_id: string;
	name: string;
	email: string;
	role: string;
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
			state.userInfo = {
				role: "",
				_id: "",
				name: "",
				email: "",
			};
			localStorage.removeItem("user");
		},
	},
});

export const { setCredentials, resetCreds } = authSlice.actions;

export default authSlice.reducer;
