import { useState } from "react";
import { LandingPage } from "./Page/landingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./Page/login";
import { HomePage } from "./Page/HomePage";
import { ProtectedRoute } from "./protectedRoute";
import { PrintingPage } from "./Page/PrintingPage";
import { AdminHomePage } from "./Page/AdminHomePage";
import { PrinterMangement } from "./Page/PrinterMange";
import { useSelector } from "react-redux";
function App() {
  const role= useSelector((state) => state.auth.role);
  

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
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
