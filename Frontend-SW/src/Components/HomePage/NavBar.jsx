import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toggleSidebar } from "@/features/HomePage/collapseSideBar";
import { jwtDecode } from "jwt-decode";
export const NavBar = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("jwt");

  const decodedToken = token ? jwtDecode(token) : null;

  const name = decodedToken?.payload.name || "Unknown User";

  return (
    <nav className="bg-[#3c8dbc] text-white flex items-center flex-grow">
      {/* Hamburger */}
      <div className="flex items-center hover:bg-[#367FA9] h-full p-2">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="focus:outline-none focus:ring-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="white"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <div className=" flex-grow items-center"></div>

      {/* Avatar and Select Language */}
      <div className="flex items-center gap-2 mr-4">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3c8dbc] font-bold">
          {name.charAt(0)}
        </div>
        {/* Name User */}
        <div className=" flex items-center">
          <p className="text-base">{name}</p>
        </div>
      </div>
      {/* Language Selector */}
      <div className="flex items-center gap-2 mr-2">
        {/* Vietnamese Flag */}
        <button
          onClick={() => console.log("Switched to Vietnamese")}
          className="flex items-center justify-center bg-[#367FA9] hover:bg-[#2b6690] focus:outline-none"
          aria-label="Switch to Vietnamese"
        >
          <img
            src="./src/assets/VN-flags.png" 
            alt="Vietnamese Flag"
            
          />
        </button>

        {/* English Flag */}
        <button
          onClick={() => console.log("Switched to English")}
          className="flex items-center justify-center  bg-[#367FA9] hover:bg-[#2b6690] focus:outline-none"
          aria-label="Switch to English"
        >
          <img
            src="./src/assets/Eng-flags.png" 
            alt="English Flag"
            
          />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
