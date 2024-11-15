import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const toastNotificationSlice = createSlice({
  name: "toastNotifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // Ensure the notification has required properties
      const { id, message, type } = action.payload;
      if (id && message && type) {
        state.push(action.payload); // Add notification
      } else {
        console.error("Invalid notification payload", action.payload);
      }
    },
    removeNotification: (state, action) => {
      // Safely remove notification by ID
      const id = action.payload;
      return state.filter((notification) => notification.id !== id);
    },
  },
});

export const { addNotification, removeNotification } =
  toastNotificationSlice.actions;


  export const addNotificationWithTimeout = (notification) => (dispatch) => {
    const id = notification.id || Date.now();
    dispatch(addNotification({ ...notification, id }));
  
    
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, 5000);
  };


export default toastNotificationSlice.reducer;