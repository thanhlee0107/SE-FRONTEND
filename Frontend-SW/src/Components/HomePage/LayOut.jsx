import React from "react";
import { useSelector } from "react-redux";
import { LogOut } from "../logOut";
import { NavBar } from "./NavBar";
import { FullSideBar } from "./FullSideBar";
import { Footer } from "./Footer";
import HomeIcon from "/src/assets/home.svg?react";
import { HomeDashBoard } from "./HomeDashBoard";

export const LayOut = () => {
  const isCollapsed = useSelector((state) => state.sidebarColapse.isCollapsed);

  return (
    <div className="flex flex-col min-h-screen  ">
      {/* Header + NavBar */}
      <div className="flex flex-col md:flex-row ">
        {/* Header of Side Bar */}
        <div
          className={`flex flex-row ${
            isCollapsed ? "md:w-[5vw]" : "md:w-[20vw]"
          } bg-[#367FA9] items-center justify-center transition-all duration-500`}
        >
          <h1 className="text-white text-xl font-bold p-3">
            {isCollapsed ? "Bk" : "myBk/App"}
          </h1>
        </div>
        {/* NavBar */}
        <NavBar />
      </div>

      <div className={`flex flex-row flex-grow bg-outerSpace `}>
        {/* Sider */}
        <div
          className={`bg-outerSpace transition-all duration-500 ${
            isCollapsed ? "md:w-[5vw]" : "md:w-[20vw]"
          } h-full`}
        >
          <FullSideBar />
        </div>

        {/* Body */}
        <div className="relative flex flex-col flex-grow bg-[#ecf0f5] ">
          {/* Header*/}
          <div className="flex flex-row items-baseline p-1 border-b bg-[#ecf0f5]">
            {/* Title */}
            <h1 className="text-xl font-bold m-2">Ứng dụng</h1>
            <p className="flex-grow text-gray-400 text-sm">BKPortal</p>
            <div className="breadcrumbs text-sm font-sans mr-1">
              <ul className="flex items-end">
                <li className="flex fle items-end">
                  <a>
                    <HomeIcon className="h-4 w-4 mr-2" />
                    BKPortal
                  </a>
                </li>
                <li>
                  <a className="text-gray-400">Trang chủ</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main */}
          <div className={`flex-grow  `}>
            {isCollapsed ? <HomeDashBoard /> : <HomeDashBoard />}
          </div>

          {/* Footer */}
          <footer className="p-3 bg-white border ">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
};
