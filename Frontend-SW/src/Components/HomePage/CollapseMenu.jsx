import React, { useState } from "react";

export const CollapsedMenu = () => {
  const menus = [
    {
      title: "Sinh viên",
      submenus: [
        "Thông tin sinh viên",
        "Thời khóa biểu",
        "Lịch Thi",
        "Thông Tin Tuyển Sinh",
      ],
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

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="bg-outerSpace flex flex-col items-center relative z-10 h-screen">
      {menus.map((menu, menuIndex) => (
        <div
          key={menuIndex}
          className="relative group w-full"
          onMouseEnter={() => setHoveredIndex(menuIndex)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          
          <button className="w-full h-10 text-[#b8c7ce] hover:text-white hover:bg-[#1e282c] px-4 py-4 flex justify-center items-center">
            <span>
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
          </button>

          {/* Submenu */}
          <div
            className={`absolute top-0 left-[5vw] w-56 bg-[#2c3b41] shadow-lg  transition-opacity duration-300 ${
              hoveredIndex === menuIndex ? "opacity-100 visible" : "opacity-0 invisible"
            } z-10`}
            
          >
            <div className=" px-4 py-2 h-10  text-white font-bold bg-outerSpace ">
              {menu.title}
              
            </div>
            {menu.submenus.map((submenu, subIndex) => (
              <div
                key={subIndex}
                className="px-4 py-2 text-sm text-[#b8c7ce] hover:text-white"
              >
                {submenu}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Final Menu Item */}
      <div
        className="relative group w-full"
        onMouseEnter={() => setHoveredIndex("Final")}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <button className="w-full text-[#b8c7ce] hover:text-white px-4 py-4 flex justify-center items-center">
        <span className="">
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
        </button>
        <div
          className={`absolute top-0 left-full z-10 bg-[#2c3b41] w-56 shadow-lg  transition-opacity duration-300 ${
            hoveredIndex === "Final" ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-2 text-[#b8c7ce]">Tài liệu hướng dẫn</div>
        </div>
      </div>
    </div>
  );
};
