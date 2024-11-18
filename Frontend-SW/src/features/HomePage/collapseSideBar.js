import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCollapsed: false,
};

const sidebarColapseSlice = createSlice({
  name: "sidebarColapse",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isCollapsed = !state.isCollapsed;
    },
  },
});

export const { toggleSidebar } = sidebarColapseSlice.actions;
export default sidebarColapseSlice.reducer;