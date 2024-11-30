import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { addNotificationWithTimeout } from "../features/Notification/toastNotificationSlice";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  if (isAuthenticated) {
    if (role === "user") {
      return <Navigate to="/home" />;
    } else {
      return <Navigate to="/admin-home" />;
    }
  }

  // Regex pattern to validate an email ending with @hcmut.edu.vn
  const emailPattern = /^[a-zA-Z0-9._%+-]+@hcmut\.edu\.vn$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the username is a valid HCMUT email and if the password is at least 6 characters
    if (!emailPattern.test(email)) {
      setError(
        "Username must be a valid HCMUT email (e.g., user@hcmut.edu.vn)."
      );
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError(""); // Clear any existing errors if inputs are valid

    try {
      const response = await fetch("http://localhost:3003/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 401) {
        setError("Invalid username or password. Please try again.");
        return;
      }

      const data = await response.json();

      if (response.ok && data.accessToken) {
        dispatch(loginSuccess(data.accessToken));
        
        dispatch(
          addNotificationWithTimeout({
            id: Date.now(),
            message: "Login successful! Welcome back.",
            type: "success",
          })
        );

        navigate("/home");
      }
    } catch (error) {
      dispatch(
        addNotificationWithTimeout({
          id: Date.now(),
          message: "An error occurred while logging in.",
          type: "error",
        })
      );
      console.error("Login error:", error);
    }
  };

  const handleClear = () => {
    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <div className="bg-[#e2e2e2] flex flex-col items-center w-full h-full">
      <div className="bg-slate-50 w-[85%] max-w-[1280px]  relative pt-2">
        {/* Header Section */}
        <div className="flex items-center bg-[#210f7a] p-4 ">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img className="h-12 w-12" src="/bk_logo.png" alt="BK Logo" />
            <h1 className="font-sans ml-4 text-white font-bold text-3xl">
              Central Authentication Service
            </h1>
          </div>
        </div>

        <div className="flex  bg-white rounded-lg shadow-lg p-0 md:p-4">
          {/* Login Form */}

          {/* Login Form Section */}
          <div className="bg-[#e2e2e2] p-6 rounded-lg shadow-md w-full md:w-2/3">
            <h2 className="text-[#990033] font-semibold text-2xl mb-4">
              Enter your Username and Password
            </h2>

            {/* Error Message */}
            {error && <p className="text-red mb-4">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Input */}
              <label className="flex flex-col">
                <span className="text-[#777] font-semibold">Username</span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full md:w-3/4 mt-1 p-2 bg-[#e8f0fe] rounded border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              {/* Password Input */}
              <label className="flex flex-col">
                <span className="text-[#777] font-semibold">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full md:w-3/4 mt-1 p-2 bg-[#e8f0fe] rounded border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              {/* Warning Checkbox */}
              <div className="flex items-center pb-1 mb-2 border-b border-b-gray-300 ">
                <input type="checkbox" className="mr-2" />
                <span className="text-[#777]">
                  Warn me before logging me into other sites.
                </span>
              </div>

              {/* Action Buttons */}
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#006dcc] text-white rounded shadow hover:bg-[#005bb5]"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>

              {/* Change Password Link */}
              <div className="mt-4">
                <a href="#" className="text-[#0000ee] underline text-m">
                  Change password?
                </a>
              </div>
            </form>
          </div>

          {/* Information Section */}
          <div className="hidden md:block bg-white p-2 ml-2  w-full ">
            <h2 className="text-[#990033] font-semibold text-lg ">Languages</h2>
            <div className="flex ml-2  gap-4 mb-2">
              <a href="#" className="text-[#0000ee] underline">
                Vietnamese
              </a>
              <a href="#" className="text-[#0000ee] underline">
                English
              </a>
            </div>

            <h3 className="text-[#990033] font-semibold ">Please note</h3>
            <p className="text-m ml-2 mb-1">
              The Login page enables single sign-on to multiple websites at
              HCMUT. This means that you only have to enter your user name and
              password once for websites that subscribe to the Login page.
            </p>
            <p className="text-m ml-2 mb-1">
              You will need to use your HCMUT Username and password to login to
              this site. The "HCMUT" account provides access to many resources
              including the HCMUT Information System, e-mail, ...
            </p>
            <p className="text-m ml-2 mb-1">
              For security reasons, please Exit your web browser when you are
              done accessing services that require authentication!
            </p>

            <h3 className="text-[#990033] font-semibold mb-1">
              Technical support
            </h3>
            <p className="text-m ml-2">
              E-mail:{" "}
              <a
                href="mailto:support@hcmut.edu.vn"
                className="text-[#0000ee] underline"
              >
                support@hcmut.edu.vn
              </a>
              <br />
              Tel: (84-8) 38647256 - 5200
            </p>
          </div>
        </div>
      </div>
      <div className="w-[85%] pb-16">
        <div className=" text-gray-600 text-m mt-4">
          <p>
            Copyright © 2011 - 2012 Ho Chi Minh University of Technology. All
            rights reserved.
          </p>
          <p className="text-[#0000ee] underline mt-2">
            Powered by Jasig CAS 3.5.1
          </p>
        </div>
      </div>
    </div>
  );
};
