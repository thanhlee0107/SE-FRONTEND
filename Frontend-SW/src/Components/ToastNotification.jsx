import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification } from "@/features/Notification/toastNotificationSlice";

const ToastNotification = () => {
  const notifications = useSelector((state) => state.toastNotifications);
  const dispatch = useDispatch();

  return (
    <div className="fixed bottom-4 right-4 space-y-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-4 p-4 border-l-4 rounded shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-700 border-green-500"
              : notification.type === "error"
              ? "bg-red-100 text-red-700 border-red-500"
              : notification.type === "warning"
              ? "bg-yellow-100 text-yellow-700 border-yellow-500"
              : "bg-gray-100 text-gray-700 border-gray-500"
          }`}
        >
          <span>{notification.message}</span>
          <button
            className="text-xl font-bold text-gray-700 hover:text-gray-900"
            onClick={() => dispatch(removeNotification(notification.id))}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;