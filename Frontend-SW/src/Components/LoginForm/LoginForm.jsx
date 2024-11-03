import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { notification } from "antd";
import "./LoginForm.css";
import { FaUser, FaClock } from "react-icons/fa";
// import PropTypes from "prop-types";
import { loginApi } from "../../api/API";

const LoginForm = ({ setIsAuthenticated, setUserData }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission
  const onFinish = async (e) => {
    e.preventDefault();
    const { email, password } = formValues;

    const res = await loginApi(email, password);
    // debugger;
    if (res && res.EC === 0) {
      //depend on backend return res => will be set again
      localStorage.setItem("access_token", res?.access_token);
      notification.success({
        message: "Login SUCCESS",
        description: "Success",
      });
      setIsAuthenticated(true);
      setUserData(res.user);
      navigate("/");
    } else {
      notification.error({
        message: "Login Failed",
        description: res?.EM ?? "error",
      });
    }
    console.log(">>Success:", res);
  };

  return (
    <div className="login">
      <div className="wrapper">
        <form action="" onSubmit={onFinish}>
          {" "}
          {/*onSubmit={handleSubmit} */}
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Username"
              name="email"
              value={formValues.email} // Bind value to state
              onChange={handleChange} // Update state on change
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formValues.password} // Bind value to state
              onChange={handleChange} // Update state on change
              required
            />
            <FaClock className="icon" />
          </div>
          <div className="member-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>
              Don't have an account? <NavLink to="/register">Register</NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// LoginForm.prototype = {
//   setToken: PropTypes.func.isRequired,
// };

export default LoginForm;
