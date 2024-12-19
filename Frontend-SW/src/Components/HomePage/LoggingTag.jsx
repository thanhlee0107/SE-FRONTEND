import React from "react";
import TagIcon from "/src/assets/Tag.svg?react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const LastLoginCard = () => {

  const [lastLoginTime, setLastLoginTime] = useState("Unknown");

  useEffect(() => {
    
    const token = localStorage.getItem("jwt"); 
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.iat) {
          const date = new Date(decoded.iat * 1000); 
          setLastLoginTime(date.toLocaleString()); 
        }
      } catch (error) {
        console.error("Failed to decode JWT", error);
      }
    }
  }, []);


  return (
    <div className="flex flex-row bg-cyan-400 text-white m-2 ">
      {/* Icon Section */}
      <div className="bg-[#009abf] flex items-center justify-center p-2">
        <TagIcon className="w-10 h-10" />
      </div>

      {/* Text Section */}
      <div className="flex flex-col justify-center ml-2 p-2">
        <h3 className="text-base font-semibold">LƯỢT ĐĂNG NHẬP GẦN NHẤT</h3>
        <p className="text-lg font-bold">{lastLoginTime}</p>
        <p className="text-sm">Tổng lượt đăng nhập: None</p>
      </div>
    </div>
  );
};

export default LastLoginCard;
