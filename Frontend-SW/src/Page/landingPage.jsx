import React from "react";
import { useNavigate,NavLink } from "react-router-dom";
import { Component2 } from "@/Components/landingPage/Component2";

export const LandingPage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  }
  
  return (
    <div className="bg-white flex flex-col items-center justify-center w-full gap-12 p-16">
   
   {/* Logo */}
   <div >
    <img src="/bk_logo.png" alt="BK Logo" className="w-52 h-auto" />
   </div>

        <div className="flex flex-col  md:flex-row gap-12" >
          
          <Component2
            className="!h-[143.52px] !flex-[0_0_auto]"
            hover={false}
            text="Người dùng khách"
            variant="two"
            onClick={handleClick}
          />
          <NavLink to="/login">
          <Component2
            className="!h-[143.52px] !flex-[0_0_auto]"
            hover={false}
            text="Cán Bộ/Sinh Viên"
            variant="four"
            onClick={handleClick}
          />
          </NavLink>
    </div>
    </div>
  );
};