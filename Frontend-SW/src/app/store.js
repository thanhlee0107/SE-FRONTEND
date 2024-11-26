import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import toastNotificationReducer from "../features/Notification/toastNotificationSlice";
import tokenValidationMiddleware from "../features/auth/tokenVerifyExpiration";
import sidebarColapseSliceReducer from "../features/HomePage/collapseSideBar";
import stepsReducer from "../features/PrintingStep/printingStepSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    toastNotifications: toastNotificationReducer,
    sidebarColapse: sidebarColapseSliceReducer,
    steps: stepsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenValidationMiddleware),
});