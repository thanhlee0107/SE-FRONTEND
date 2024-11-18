import React, { useState } from "react";

export const Menu = () => {
  const menus = [
    {
      title: "Sinh viên",
      submenus: ["Thông tin sinh viên", "Thời khóa biểu", "Lịch Thi", "Thông Tin Tuyển Sinh"],
    },
    {
        title: "Dịch vụ sinh viên",
        submenus: [
            "Dịch vụ in ấn",
          "Đăng ký phúc tra điểm thi",
          "Đăng ký xét tốt nghiệp",
          "Đăng ký in thẻ",
          "Đăng ký kiểm tra tiếng Anh",
          "Đăng ký hỗ trợ cước 3G",
          "Đăng ký xác nhận sinh viên",
          "Đăng ký hoãn thi",
          "Đăng ký thông tin văn bằng",
          "Đăng ký rút môn học",
          "Đăng ký thông tin CC tin học",
        ],
      },
      {
        title: "Kết quả học tập",
        submenus: ["Bảng điểm học kỳ", "Tiến độ học tập"],
      },
  ];
  const [openIndexes, setOpenIndexes] = React.useState([]);

  const toggleDropdown = (index) => {
    setOpenIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // Close the dropdown
          : [...prev, index] // Open the dropdown
    );
  };

  return (
    <div className="">
      {menus.map((menu, menuIndex) => (
        <div key={menuIndex} className="relative">
          {/* Menu Title */}
          <button
            className="bg-outerSpace text-[#b8c7ce] hover:text-white px-4 py-4 cursor-pointer w-full text-left flex items-center"
            onClick={() => toggleDropdown(menuIndex)}
          >
            {/* Hamburger Icon on the Left */}
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
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
            </span>

            {/* Menu Title */}
            <span className="text-sm w-56">{menu.title}</span>

            {/* Arrow Icon on the Right */}
            <span
              className={` transform transition-transform duration-300 ${
                openIndexes.includes(menuIndex) ? "rotate-0" : "rotate-90"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transform transition-transform duration-500 `}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>

          {/* Dropdown Submenus */}
          <div
            className={`overflow-hidden transition-[height] duration-1000 ease-in-out`}
            style={{
              height: openIndexes.includes(menuIndex)
                ? `${menu.submenus.length * 40}px`
                : "0px",
            }}
          >
            <ul className="bg-[#2c3b41]">
              {menu.submenus.map((submenu, index) => (
                <li
                  key={index}
                  className={`transition-opacity duration-700 delay-${
                    index * 100
                  }ms ${
                    openIndexes.includes(menuIndex)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <span className="flex items-center px-4 py-2 hover:text-white text-[#b8c7ce]">
                    {/* Icon */}
                    <span className="mr-2 flex items-center">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 14 15"
                        fill="none"
                    
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 14.9651C8.27604 14.9469 9.44271 14.637 10.5 14.0354C11.5573 13.4156 12.4141 12.5588 13.0703 11.4651C13.6901 10.3531 14 9.18644 14 7.96509C14 6.74373 13.6901 5.57707 13.0703 4.46509C12.4141 3.37134 11.5573 2.51457 10.5 1.89478C9.44271 1.29321 8.27604 0.983317 7 0.965088C5.72396 0.983317 4.55729 1.29321 3.5 1.89478C2.44271 2.51457 1.58594 3.37134 0.929688 4.46509C0.309896 5.57707 0 6.74373 0 7.96509C0 9.18644 0.309896 10.3531 0.929688 11.4651C1.58594 12.5588 2.44271 13.4156 3.5 14.0354C4.55729 14.637 5.72396 14.9469 7 14.9651ZM4.8125 7.96509C4.83073 8.7854 5.19531 9.41431 5.90625 9.85181C6.63542 10.2528 7.36458 10.2528 8.09375 9.85181C8.80469 9.41431 9.16927 8.7854 9.1875 7.96509C9.16927 7.14478 8.80469 6.51587 8.09375 6.07837C7.36458 5.67733 6.63542 5.67733 5.90625 6.07837C5.19531 6.51587 4.83073 7.14478 4.8125 7.96509ZM7 11.4651C6.36198 11.4651 5.77865 11.3101 5.25 11.0002C4.72135 10.6903 4.29297 10.262 3.96484 9.71509C3.65495 9.16821 3.5 8.58488 3.5 7.96509C3.5 7.3453 3.65495 6.76196 3.96484 6.21509C4.29297 5.66821 4.72135 5.23983 5.25 4.92993C5.77865 4.62004 6.36198 4.46509 7 4.46509C7.63802 4.46509 8.22135 4.62004 8.75 4.92993C9.27865 5.23983 9.70703 5.66821 10.0352 6.21509C10.3451 6.76196 10.5 7.3453 10.5 7.96509C10.5 8.58488 10.3451 9.16821 10.0352 9.71509C9.70703 10.262 9.27865 10.6903 8.75 11.0002C8.22135 11.3101 7.63802 11.4651 7 11.4651Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>

                    {/* Text */}
                    <a href="#" className="text-sm text-align-center">
                      {submenu}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      <div key={"Final"} className="relative">
        {/* Menu Title */}
        <button
          className="bg-outerSpace text-[#b8c7ce] hover:text-white px-4 py-4 cursor-pointer w-full text-left flex items-center"
          onClick={() => toggleDropdown("Final")}
        >
          {/* Hamburger Icon on the Left */}
          <span className="mr-2">
            <svg
              className="h-5 w-5"
              viewBox="0 0 13 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.62714 0.959274C1.87914 0.977518 1.25884 1.23293 0.76625 1.72552C0.273661 2.21811 0.018244 2.83841 0 3.58642V12.3436C0.018244 13.0916 0.273661 13.7119 0.76625 14.2045C1.25884 14.697 1.87914 14.9525 2.62714 14.9707H10.5086H11.3843C11.6397 14.9707 11.8495 14.8886 12.0137 14.7244C12.1779 14.5602 12.26 14.3504 12.26 14.095C12.26 13.8396 12.1779 13.6298 12.0137 13.4656C11.8495 13.3014 11.6397 13.2193 11.3843 13.2193V11.4678C11.6397 11.4678 11.8495 11.3857 12.0137 11.2216C12.1779 11.0574 12.26 10.8475 12.26 10.5921V1.83499C12.26 1.57957 12.1779 1.36977 12.0137 1.20557C11.8495 1.04137 11.6397 0.959274 11.3843 0.959274H10.5086H2.62714ZM2.62714 11.4678H9.63286V13.2193H2.62714C2.37173 13.2193 2.16192 13.1372 1.99772 12.973C1.83353 12.8088 1.75143 12.599 1.75143 12.3436C1.75143 12.0881 1.83353 11.8783 1.99772 11.7141C2.16192 11.5499 2.37173 11.4678 2.62714 11.4678ZM3.50286 4.89999C3.5211 4.62633 3.66705 4.48038 3.94071 4.46213H9.195C9.46866 4.48038 9.61461 4.62633 9.63286 4.89999C9.61461 5.17365 9.46866 5.3196 9.195 5.33785H3.94071C3.66705 5.3196 3.5211 5.17365 3.50286 4.89999ZM3.94071 6.21356H9.195C9.46866 6.2318 9.61461 6.37776 9.63286 6.65142C9.61461 6.92508 9.46866 7.07103 9.195 7.08927H3.94071C3.66705 7.07103 3.5211 6.92508 3.50286 6.65142C3.5211 6.37776 3.66705 6.2318 3.94071 6.21356Z"
                fill="currentColor"
              />
            </svg>
          </span>

          {/* Menu Title */}
          <span className="text-sm w-56">Tài liệu hướng dẫn</span>         
          
        </button>
      </div>
    </div>
  );
};


