import PropTypes from "prop-types";
import React, { useReducer } from "react";
import { Component1 } from "./Component1";

export const Component2 = ({ 
  text = "Người dùng khách", 
  variant = "one", 
  hover = false, 
  className 
}) => {
  const [state, dispatch] = useReducer(reducer, { variant, hover });

  return (
    <div className={`inline-flex flex-col items-center rounded-[15px] bg-[#ffd85a] relative 
    gap-4 p-6 h-16
    ${className}
    transition-transform duration-300 ease-in-out transform ${state.hover ? "scale-110" : "scale-100"}`}
  onMouseEnter={() => dispatch("mouse_enter")}
  onMouseLeave={() => dispatch("mouse_leave")}
>
  <div className="inline-flex flex-col items-start flex-[0_0_auto] relative">
    <div className="inline-flex items-start flex-[0_0_auto] relative">
      <Component1
        className={
          
             "!relative !w-[43.75px] !h-[49.63px]" 
        }
        variant={state.variant}
      />
    </div>
  </div>
      <div
        className={`inline-flex flex-col items-start flex-[0_0_auto] relative 
          ${!state.hover ? "pt-0 pb-[0.74px] px-0" : "pt-0 pb-[0.81px] px-0"}`}
      >
        <div>
          {text}
        </div>
      </div>
    </div>
  );
};

function reducer(state, action) {
  switch (action) {
    case "mouse_enter":
      return { ...state, hover: true };
    case "mouse_leave":
      return { ...state, hover: false };
    default:
      return state;
  }
}

Component2.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.oneOf(["one","two","three","four"]),
  hover: PropTypes.bool,
  className: PropTypes.string,
  
};
