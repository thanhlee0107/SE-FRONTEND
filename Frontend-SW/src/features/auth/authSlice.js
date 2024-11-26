import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

const initialState = {
  token: localStorage.getItem("jwt") || null,
  role: localStorage.getItem("jwt") ? jwtDecode(localStorage.getItem("jwt")).payload.role : null, // Decode role from JWT
  isAuthenticated: !!localStorage.getItem("jwt"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.role = jwtDecode(action.payload).payload.role; // Extract role from token
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem("jwt", action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      // Remove from localStorage
      localStorage.removeItem("jwt");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;