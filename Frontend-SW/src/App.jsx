import { useEffect, useState } from "react";
import { LandingPage } from "./Page/landingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./Page/login";
import { HomePage } from "./Page/HomePage";
import { ProtectedRoute } from "./protectedRoute";
import { PrintingPage } from "./Page/PrintingPage";
import { AdminHomePage } from "./Page/AdminHomePage";
import { PrinterMangement } from "./Page/PrinterMangement";
import { useSelector,useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { addNotificationWithTimeout } from "@/features/Notification/toastNotificationSlice";

function App() {
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  useEffect(() => {
    const validateToken = async () => {
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
          
          dispatch(logout());

          
          dispatch(
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
    };

    validateToken(); // Call the async function
  }, [token, dispatch]); // Dependencies for the useEffect

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              {role === "user" ? <HomePage /> : <AdminHomePage />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/printing-service"
          element={
            <ProtectedRoute>
              <PrintingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute>
              {role === "user" ?null:<AdminHomePage />}
            </ProtectedRoute>
          }
        />
         <Route
          path="/printer-manage"
          element={
            <ProtectedRoute>
              {role === "user" ?null:<PrinterMangement />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
