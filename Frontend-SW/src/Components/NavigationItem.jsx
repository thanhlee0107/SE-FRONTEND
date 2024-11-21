import React from "react";
import { Link } from "react-router-dom";

const NavigationItem = ({ submenu, link }) => {
  return (
    <Link to={link} className="flex items-center">
      {/* Icon */}
      <span className="ml-2 mr-2 ">
        <svg
          className="h-4 w-4"
          viewBox="0 0 14 15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 14.9651C8.27604 14.9469 9.44271 14.637 10.5 14.0354C11.5573 13.4156 12.4141 12.5588 13.0703 11.4651C13.6901 10.3531 14 9.18644 14 7.96509C14 6.74373 13.6901 5.57707 13.0703 4.46509C12.4141 3.37134 11.5573 2.51457 10.5 1.89478C9.44271 1.29321 8.27604 0.983317 7 0.965088C5.72396 0.983317 4.55729 1.29321 3.5 1.89478C2.44271 2.51457 1.58594 3.37134 0.929688 4.46509C0.309896 5.57707 0 6.74373 0 7.96509C0 9.18644 0.309896 10.3531 0.929688 11.4651C1.58594 12.5588 2.44271 13.4156 3.5 14.0354C4.55729 14.637 5.72396 14.9469 7 14.9651ZM4.8125 7.96509C4.83073 8.7854 5.19531 9.41431 5.90625 9.85181C6.63542 10.2528 7.36458 10.2528 8.09375 9.85181C8.80469 9.41431 9.16927 8.7854 9.1875 7.96509C9.16927 7.14478 8.80469 6.51587 8.09375 6.07837C7.36458 5.67733 6.63542 5.67733 5.90625 6.07837C5.19531 6.51587 4.83073 7.14478 4.8125 7.96509ZM7 11.4651C6.36198 11.4651 5.77865 11.3101 5.25 11.0002C4.72135 10.6903 4.29297 10.262 3.96484 9.71509C3.65495 9.16821 3.5 8.58488 3.5 7.96509C3.5 7.3453 3.65495 6.76196 3.96484 6.21509C4.29297 5.66821 4.72135 5.23983 5.25 4.92993C5.77865 4.62004 6.36198 4.46509 7 4.46509C7.63802 4.46509 8.22135 4.62004 8.75 4.92993C9.27865 5.23983 9.70703 5.66821 10.0352 6.21509C10.3451 6.76196 10.5 7.3453 10.5 7.96509C10.5 8.58488 10.3451 9.16821 10.0352 9.71509C9.70703 10.262 9.27865 10.6903 8.75 11.0002C8.22135 11.3101 7.63802 11.4651 7 11.4651Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {/* Text */}
      <span className="text-sm text-align-center ">
        {submenu}
      </span>
    </Link>
  );
};

export default NavigationItem;