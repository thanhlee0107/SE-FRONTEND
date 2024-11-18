import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { Menu } from "./Menu";

import { jwtDecode } from "jwt-decode";

export const FullSideBar = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem("jwt");

  const decodedToken = token ? jwtDecode(token) : null;

  const name = decodedToken?.payload.name || "Unknown User";

  return (
    <div className="flex flex-col w-[20vw] h-[100vh]">
      <div className="flex flex-row bg-[#367FA9] items-center justify-center">
        <h1 className="text-white text-2xl font-bold p-4">MyBK/app</h1>
      </div>
      <div className="flex flex-row bg-outerSpace ">
        <img className="h-12 w-12 m-2 " src="/bk_logo.png" alt="BK Logo" />
        <div className="flex flex-col justify-center ml-2">
          <span className="text-white text-base  font-bold">{name}</span>
          <span className="text-white text-xs">
            {isAuth && (
              <span className="relative">
                <span
                  className="h-2 w-2 bg-[#3C763D] rounded-full inline-block align-middle  mr-1"
                ></span>
              </span>
            )}
            Khoa Khoa học và Kỹ thuật Máy tính
          </span>
        </div>
      </div>
      <div className="h-full bg-outerSpace">
      <Menu />
      </div>
      
    </div>
  );
};
