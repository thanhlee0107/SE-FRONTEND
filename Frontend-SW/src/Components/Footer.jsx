import React from "react";

export const Footer = () => {
  return (
    <div className=" flex flex-row text-sm justify-center items-center">
      <span className="flex-grow">
        <span className="text-black font-bold">Copyright © 2024</span>
        <span className="text-[#3c8dbc] font-bold"> Academic Affairs Office. </span>
        <span className="text-black">All right reserved.</span>
      </span>

      <span className="">
        <span className="text-black font-bold">Version: </span>
        <span className="text-black "> 1.0.0</span>
      </span>
    </div>
  );
};
