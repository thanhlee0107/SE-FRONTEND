import PropTypes from "prop-types";
import React from "react";
import variant1 from "@/assets/landingPage/1.svg";
import variant2 from "@/assets/landingPage/2.svg";
import variant3 from "@/assets/landingPage/3.svg";
import variant4 from "@/assets/landingPage/4.svg";

export const Component1 = ({ variant, className }) => {
  return (
    <img
      className={`left-0 top-0 absolute ${["four", "two"].includes(variant) ? "w-11" : "w-12"} ${["four", "two"].includes(variant) ? "h-[50px]" : "h-[55px]"} ${className}`}
      alt="Variant"
      src={
        variant === "two"
          ? variant2
          : variant === "three"
            ? variant3
            : variant === "four"
              ? variant4
              : variant1
      }
    />
  );
};

Component1.propTypes = {
  variant: PropTypes.oneOf(["two", "four", "three", "one"]),
};