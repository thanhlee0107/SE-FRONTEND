import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toggleSidebar } from "@/features/HomePage/collapseSideBar";
import { jwtDecode } from "jwt-decode";
import { LogOut } from "./logOut";
import MessageIcon from "/src/assets/message-svgrepo-com.svg?react";
import NotificationIcon from "/src/assets/Notification.svg?react";

export const NavBar = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("jwt");

  // State for DreopDown Setting
  const [isSettingOpen, setSettingOpen] = useState(false);

  //State for Notification
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  //State for Message
  const [isMessageOpen, setMessageOpen] = useState(false);

  const decodedToken = token ? jwtDecode(token) : null;

  const name = decodedToken?.payload.name || "Unknown User";

  return (
    <nav className="bg-[#3c8dbc] text-white flex items-center  flex-grow">
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
      {/* Place Holder */}
      <div className=" flex-grow items-center"></div>
      {/* Message */}
      <div className="  dropdown dropdown-bottom">
        <div className="">
          <button
            onClick={() => setMessageOpen(!isMessageOpen)}
            className="btn text-white text-lg rounded-none border-none bg-[#3c8dbc] hover:bg-[#367FA9] "
          >
            {/* Message Icon */}
            <div className="indicator scale-75">
              {/* Notification Icon */}
              <MessageIcon className="fill-white w-6 h-6" />

              {/* Badge */}
              <div className="indicator-item badge badge-secondary bg-red ">
                99
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Notification */}
      <div className="  dropdown dropdown-bottom">
        <div className="">
          <button
            onClick={() => setMessageOpen(!isMessageOpen)}
            className="btn text-white text-lg rounded-none border-none bg-[#3c8dbc] hover:bg-[#367FA9] "
          >
            {/* Message Icon */}
            <div className="indicator scale-75">
              {/* Notification Icon */}
              <NotificationIcon className="fill-white w-6 h-6" />

              {/* Badge */}
              <div className="indicator-item badge badge-secondary bg-red">
                99
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Avatar and Select Language */}
      <div className="flex items-center gap-2 dropdown dropdown-bottom">
        <div className="">
          <button
            onClick={() => setSettingOpen(!isSettingOpen)}
            className="btn text-white text-lg rounded-none border-none mt-0 mb-0 bg-[#3c8dbc] hover:bg-[#367FA9]"
          >
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3c8dbc] font-bold">
                {name.charAt(0)}
              </div>
              {/* Name User */}
              <div className="text-white">{name}</div>
            </div>
          </button>
        </div>
        {isSettingOpen && (
          <div className="dropdown-content menu bg-gray-200 mt-0.5 z-[1] w-full p-2 shadow ">
            <div className="menu-title font-semibold text-black">
              Hello, {name}
            </div>
            <LogOut />
          </div>
        )}
      </div>
      {/* Language Selector */}
      <div className="flex items-center gap-2 mr-2">
        {/* Vietnamese Flag */}
        <button
          onClick={() => console.log("Switched to Vietnamese")}
          className="flex items-center justify-center bg-[#367FA9] hover:bg-[#2b6690] focus:outline-none"
          aria-label="Switch to Vietnamese"
        >
          <img src="./src/assets/VN-flags.png" alt="Vietnamese Flag" />
        </button>

        {/* English Flag */}
        <button
          onClick={() => console.log("Switched to English")}
          className="flex items-center justify-center  bg-[#367FA9] hover:bg-[#2b6690] focus:outline-none"
          aria-label="Switch to English"
        >
          <img src="./src/assets/Eng-flags.png" alt="English Flag" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
