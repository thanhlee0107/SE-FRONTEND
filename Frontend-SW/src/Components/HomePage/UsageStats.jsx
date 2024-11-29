import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { color } from "chart.js/helpers";

const UsageStatistics = () => {
  const data = {
    labels: [
      "12/2023",
      "01/2024",
      "02/2024",
      "03/2024",
      "04/2024",
      "05/2024",
      "06/2024",
      "07/2024",
      "08/2024",
      "09/2024",
      "10/2024",
      "11/2024",
    ],
    datasets: [
      {
        label: "Thống kê tần suất sử dụng dịch vụ in ấn",
        data: [1, 20, 2, 4, 1, 22, 22, 6, 10, 12, 18, 21],
        backgroundColor: "red",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Thống Kê Tần Suất Sử Dụng Dịch Vụ In Ấn", 
        font: {
          size: 16,
          weight: "bold", 
          
        },
        color: "black", 
        padding: {
          top: 10, 
          bottom: 20, 
        },
        align: "center", 
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượt đăng nhập",
        },
      },
      x: {
        title: {
          display: false,
          text: "Thời gian",
        },
      },
    },
  };

  return (
    <div className=" flex flex-col bg-white rounded-md  items-start border-t-4 border-t-[#367FA9] ml-4 mr-16 ">
      
      <div className="p-2 text-xl font-bold border-b-2 w-full ">Thống kê sử dụng</div>
      <div className="relative ml-8 w-[40vw] mb-2">
        {/* Adjust the height here */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default UsageStatistics;
