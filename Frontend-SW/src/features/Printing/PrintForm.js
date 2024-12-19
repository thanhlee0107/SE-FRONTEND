import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  IDPrinter: "",
  Name: "",
  Type: "",
  Amount: 0,
  Size: "",
  Color: false,
  File: null, // URL or null
  Side: "Single", // Single or Double
  PageNumber: 0,
};

const PrintFormSlice = createSlice({
  name: "PrintForm",
  initialState,
  reducers: {
    modify(state, action) {
      const payload = action.payload;
      
      if (typeof payload === "object" && payload !== null) {
        Object.entries(payload).forEach(([key, value]) => {
          if (state.hasOwnProperty(key)) {
            state[key] = value; // Update the state dynamically
          } else {
            console.warn(`Key "${key}" does not exist in the state.`);
          }
        });
      } else {
        console.error("Payload must be an object containing key-value pairs.");
      }
      console.log(state);
    },
    reset(state) {
      // Reset each field to its initial state
      Object.assign(state, initialState);
    },
  },
});

export const { modify, reset } = PrintFormSlice.actions;

export default PrintFormSlice.reducer;
