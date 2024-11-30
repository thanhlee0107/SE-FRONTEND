import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { NavBar } from "./NavBar";
import { FullSideBar } from "./FullSideBar";
import { Footer } from "./Footer";
import HomeIcon from "/src/assets/home.svg?react";
import { Link } from "react-router-dom";

export const LayOut = ({
  title = "BKPortal",
  breadcrumb = "Trang chủ",
  channel1 = "Ứng Dụng",
  channel2 = "BKPortal",
  children,
}) => {
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
          <Link to={"/home"}>
          <h1 className="text-white text-xl font-bold p-3">
            {isCollapsed ? "Bk" : "myBk/App"}
          </h1>
          </Link>
          
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
            <h1 className="text-xl font-bold m-2">{channel1}</h1>
            <p className="flex-grow text-gray-400 text-sm">{channel2}</p>
            <div className="breadcrumbs text-sm font-sans mr-1">
              <ul className="flex items-end">
                <li className="flex fle items-end">
                  <a>
                    <HomeIcon className="h-4 w-4 mr-2" />
                    {title}
                  </a>
                </li>
                <li>
                  <a className="text-gray-400 mr-2">{breadcrumb}</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main */}
          <div className={`flex-grow  `}>
          {children}
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

// Define PropTypes
LayOut.propTypes = {
  title: PropTypes.string, // title should be a string
  breadcrumb: PropTypes.string, // breadcrumb should be a string
  children: PropTypes.node, // children can be any valid React node
  channel1: PropTypes.string, // channel1 should be a string
  channel2: PropTypes.string, // channel2 should be a string
};



export default LayOut;