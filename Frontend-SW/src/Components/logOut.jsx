import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { addNotificationWithTimeout } from "../features/Notification/toastNotificationSlice";

const LogOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Clear authentication state
    dispatch(
      addNotificationWithTimeout({
        message: "You have been logged out.",
        type: "info",
      })
    );
    navigate("/login"); // Navigate to the login page
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Log Out
    </button>
  );
};

export default LogOut;