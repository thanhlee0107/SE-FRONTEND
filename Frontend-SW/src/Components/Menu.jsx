import React, { useState } from "react";
import NavigationItem from "./NavigationItem";
import { useSelector } from "react-redux";

export const Menu = () => {
  const role = useSelector((state) => state.auth.role);

  const menusUser = [
    {
      title: "Sinh viên",
      submenus: [
        { name: "Thông tin sinh viên", link: "/student-info" },
        { name: "Thời khóa biểu", link: "/schedule" },
        { name: "Lịch Thi", link: "/exam-schedule" },
        { name: "Thông Tin Tuyển Sinh", link: "/admission-info" },
      ],
    },
    {
      title: "Dịch vụ sinh viên",
      submenus: [
        { name: "Dịch vụ in ấn", link: "/printing-service" },
        { name: "Đăng ký phúc tra điểm thi", link: "/recheck-scores" },
        { name: "Đăng ký xét tốt nghiệp", link: "/graduation-request" },
        { name: "Đăng ký in thẻ", link: "/card-printing" },
        { name: "Đăng ký kiểm tra tiếng Anh", link: "/english-test" },
        { name: "Đăng ký hỗ trợ cước 3G", link: "/3g-support" },
        { name: "Đăng ký xác nhận sinh viên", link: "/student-verification" },
        { name: "Đăng ký hoãn thi", link: "/exam-delay" },
        { name: "Đăng ký thông tin văn bằng", link: "/degree-info" },
        { name: "Đăng ký rút môn học", link: "/withdraw-course" },
        {
          name: "Đăng ký thông tin CC tin học",
          link: "/it-certification-info",
        },
      ],
    },
    {
      title: "Kết quả học tập",
      submenus: [
        { name: "Bảng điểm học kỳ", link: "/semester-grades" },
        { name: "Tiến độ học tập", link: "/study-progress" },
      ],
    },
  ];

  const menuAdmin = [
    {
      title: "Quản trị in ấn",
      submenus: [
        { name: "Quản lý máy in", link: "/printer-manage" },
        { name: "Xem lịch sử in ấn", link: "/History-log" },
      ],
    },
  ];

  let menus = [];

  if (role === "user") {
    menus = menusUser;
  } else {
    menus = menuAdmin;
  }

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
    <div className="h-full bg-outerSpace">
      {menus.map((menu, menuIndex) => (
        <div key={menuIndex} className="flex flex-col">
          {/* Menu Title */}
          <button
            className="bg-outerSpace text-[#b8c7ce] hover:text-white ml-4 py-4 cursor-pointer text-left flex flex-row items-center hover:bg-[#1e282c]"
            onClick={() => toggleDropdown(menuIndex)}
          >
            {/* Hamburger Icon */}
            <div className="mr-2 flex-shrink-0">
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
            </div>

            {/* Menu Title */}
            <div className="flex-grow text-sm">{menu.title}</div>

            {/* Arrow Icon */}
            <div
              className={`flex-shrink-0 mr-4 transform transition-transform duration-300 ${
                openIndexes.includes(menuIndex) ? "rotate-0" : "rotate-90"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>

          {/* Dropdown Submenus */}
          <div
            className={`overflow-hidden transition-[height] duration-1000 ease-in-out`}
            style={{
              height: openIndexes.includes(menuIndex)
                ? `${menu.submenus.length * 2.5}rem`
                : "0rem",
            }}
          >
            <div className="bg-[#2c3b41] flex flex-col justify-center">
              {menu.submenus.map((submenu, index) => (
                <div
                  key={index}
                  className={`transition-opacity  text-[#b8c7ce] hover:text-white duration-700 delay-${
                    index * 100
                  }ms ${
                    openIndexes.includes(menuIndex)
                      ? "opacity-100"
                      : "opacity-0"
                  } flex items-center`}
                  style={{
                    height: "2.5rem",
                  }}
                >
                  <NavigationItem submenu={submenu.name} link={submenu.link} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div key={"Final"} className="relative">
        {/* Menu Title */}
        <button
          className="bg-outerSpace text-[#b8c7ce] hover:text-white ml-4 py-4 cursor-pointer text-left flex flex-row items-center hover:bg-[#1e282c]"
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
          <span className="text-sm">Tài liệu hướng dẫn</span>
        </button>
      </div>
    </div>
  );
};
