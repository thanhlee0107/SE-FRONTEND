import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification } from "@/features/Notification/toastNotificationSlice";

const ToastNotification = () => {
  const notifications = useSelector((state) => state.toastNotifications);
  const dispatch = useDispatch();

  return (
    <div className="fixed bottom-4 right-4 space-y-8 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`alert shadow-lg ${
            notification.type === "success"
              ? "alert-success"
              : notification.type === "error"
              ? "alert-error"
              : notification.type === "warning"
              ? "alert-warning"
              : notification.type === "info"
              ? "alert-info"
              : ""
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" && (
             <svg
             xmlns="http://www.w3.org/2000/svg"
             className="h-6 w-6 shrink-0 stroke-current"
             fill="none"
             viewBox="0 0 24 24">
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
            )}
            {notification.type === "error" && (
             <svg
             xmlns="http://www.w3.org/2000/svg"
             className="h-6 w-6 shrink-0 stroke-current"
             fill="none"
             viewBox="0 0 24 24">
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
            )}
            {notification.type === "warning" && (
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            )}
            {notification.type === "info" && (   <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0 stroke-current">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>)}
              {notification.type === "" && (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info h-6 w-6 shrink-0">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>)}
            <span>{notification.message}</span>
          </div>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-black text-black hover:bg-gray-200 hover:text-gray-900"
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
