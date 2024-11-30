import React from "react";
import { useSelector } from "react-redux";
import { Menu } from "./Menu";
import { jwtDecode } from "jwt-decode";
import { CollapsedMenu } from "./CollapseMenu";

export const FullSideBar = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const isCollapsed = useSelector((state) => state.sidebarColapse.isCollapsed);
  const role=useSelector((state)=>state.auth.role);
  console.log(role);

  const token = localStorage.getItem("jwt");

  const decodedToken = token ? jwtDecode(token) : null;
  const name = decodedToken?.payload.name || "Unknown User";

  return (
    <div
      className={`relative transition-all duration-300 ${
        isCollapsed ? "md:w-[5vw]" : "md:w-[20vw]"
      } h-full bg-outerSpace`}
    >
      {/* Header Section */}
      <div
        className={`flex items-center gap-2 p-2 transition-opacity duration-300 ${
          isCollapsed ? "justify-center" : "justify-start"
        }`}
      >
        <img
          className={` ${
            isCollapsed ? "mx-auto h-8 w-8" : "ml-2 h-12 w-12"
          } transition-all duration-300 ease-in-out`}
          src="/bk_logo.png"
          alt="BK Logo"
        />
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-white text-base font-bold">{name}</span>
            <span className="text-white text-xs">
              {isAuth && (
                <span className="relative">
                  <span className="h-2 w-2 bg-[#3C763D] rounded-full inline-block align-middle mr-1"></span>
                </span>
              )}
              {role==="admin"?"Phòng Quản Trị":"Khoa Khoa Học và Kỹ Thuật Máy Tính"}
            </span>
          </div>
        )}
      </div>

      {/* Menu Section */}
      <div className={`relative z-10 transition-all duration-700`}>
        <div
          className={`${
            isCollapsed
              ? "opacity-0 scale-80 pointer-events-none"
              : "opacity-100 scale-100"
          } transition-all duration-1000 delay-300 ease-in-out`}
        >
          {!isCollapsed && <Menu />}
        </div>
        <div
          className={`${
            !isCollapsed
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          } transition-all duration-400 ease-in-out`}
        >
          {isCollapsed && <CollapsedMenu />}
        </div>
      </div>
    </div>
  );
};
