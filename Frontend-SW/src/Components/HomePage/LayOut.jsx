import React from "react";
import { useSelector } from "react-redux";
import { LogOut } from "../logOut";
import { NavBar } from "./NavBar";
import { FullSideBar } from "./FullSideBar";


export const LayOut = () => {
  const isCollapsed = useSelector((state) => state.sidebarColapse.isCollapsed);

  return (
    <div className="flex flex-col">
      {/* Header + NavBar */}
      <div className="flex flex-col md:flex-row">
        {/* Header of Side Bar */}
        <div
          className={`flex flex-row ${
            isCollapsed ? "md:w-[5vw]" : "md:w-[20vw]"
          } bg-[#367FA9] items-center justify-center transition-all duration-500`}
        >
          <h1
            className={`text-white text-xl font-bold p-2 `}
          >
            {isCollapsed ? "Bk" : "myBk/App"}
          </h1>
        </div>
        {/* NavBar */}
        <NavBar />
      </div>

      <div className="relative flex flex-row w-screen">
        {/* Sider */}
        <div
          className={`relative z-10 bg-gray-100 transition-all duration-500 h-full ${
            isCollapsed ? "md:w-[5vw]" : "md:w-[20vw]"
          }`}
        >
          <FullSideBar />
        </div>
        {/* Body */}
        <div className="relative z-0 flex-grow bg-white p-4 overflow-auto">
          <h1>Body</h1>
          <LogOut />
          <h1>Home Page</h1>
        </div>
      </div>
    </div>
  );
};
