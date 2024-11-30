import { logout } from "./authSlice";
import { addNotificationWithTimeout } from "../Notification/toastNotificationSlice";
import { resetAllSteps } from "@/features/PrintingStep/printingStepSlice";
import { reset } from "@/features/Printing/PrintForm";
let tokenCheckInterval;

const tokenValidationMiddleware = (store) => (next) => async (action) => {
  const { auth } = store.getState();
  

  if (action.type === "auth/loginSuccess") {
    // Clear any existing interval
    
    if (tokenCheckInterval) clearInterval(tokenCheckInterval);
    
    // Set up token validation check every 60 minutes
    tokenCheckInterval = setInterval(async () => {
      let token = auth.token; // Get the current token from Redux state
      if (!token) {
        token=action.payload;
      }
      if (token) {
        
        try {
          console.log("Validating token with server...");
          const response = await fetch("http://localhost:3003/auth/verify", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            // Token is invalid or expired
            store.dispatch(logout());

            // Dispatch a toast notification for token expiration
            store.dispatch(
              addNotificationWithTimeout({
                id: Date.now(),
                message: "Session expired. Please log in again.",
                type: "error",
              })
            );
          }
        } catch (error) {
          console.error("Error validating token with server:", error);
        }
      }
    }, 60*60*1000); // Run every 60 minutes
  }

  if (action.type === "auth/logout") {
    // Clear the interval when the user logs out
    clearInterval(tokenCheckInterval);
    tokenCheckInterval = null;
    store.dispatch(resetAllSteps());
    store.dispatch(reset())
  }

  return next(action); // Continue with the next middleware or reducer
};

export default tokenValidationMiddleware;