import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
//fetch api
import axios from "./api/axiosConfig";
//
import React, { useState, useEffect } from "react";
// pages
import Home from "./Components/HomePage/Home";
import Print from "./Components/PrintPage/Print";
import History from "./Components/HistoryPage/History";
import LoginForm from "./Components/LoginForm/LoginForm";
import Payment from "./Components/Payment/Payment";
import Printers from "./Components/Admin/Printers/Printers"
import CreateReport from "./Components/ReportPage/CreateReport/CreateReport";
import OldReport from "./Components/ReportPage/OldReport/OldReport";
import AdHome from "./Components/Admin/AdHome/AdHome"
import Configuration from "./Components/Admin/Configuration/Configuration"
//authenticate
// layouts
import RootLayout from "./Layouts/RootLayout";
import RegisterPage from "./Components/RegisterForm/Register";
// import UserInfo from "./Layouts/UserInfo";

function PrivateRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/login"
          element={
            <LoginForm
              setIsAuthenticated={setIsAuthenticated}
              setUserData={setUserData}
            />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<RootLayout userData={userData} />}>
          <Route
            index
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                {userData?.admin ? <AdHome /> : <Home />}
              </PrivateRoute>
            }
          />
          <Route
            path="print"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Print />
              </PrivateRoute>
            }
          />

          <Route
            path="history"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <History />
              </PrivateRoute>
            }
          />
          <Route
            path="payment"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="printers"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Printers />
              </PrivateRoute>
            }
          />

          <Route
            path="createReport"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <CreateReport/>
              </PrivateRoute>
            }
          />
          <Route
            path="oldReport"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <OldReport/>
              </PrivateRoute>
            }
          />

        </Route>

      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
