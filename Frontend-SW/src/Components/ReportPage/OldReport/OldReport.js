import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Select, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import "./OldReport.css";
import * as XLSX from 'xlsx';
//npm install xlsx
const { Option } = Select;

function OldReport() {
  const [printJobs, setPrintJobs] = useState([]);
  const [fetchStatus, setFetch] = useState(true);
  const [month, setMonth] = useState(""); // Tháng cần lọc
  const [year, setYear] = useState("2024");
  const fetchReports = () => {
    const token = localStorage.getItem("access_token");
    
    // Lựa chọn URL API dựa trên việc có bộ lọc ngày hay không, mặc đnhj tháng 11
    const getApiUrl = () => {
      let query = `?month=${month || "11"}&year=${year}`;
      return `http://localhost:8080/report/month${query}`;
    };
    // Gọi API với URL phù hợp
    fetch(getApiUrl(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch print jobs");
        }
        return response.json();
      })
      .then((data) => {
        setFetch(true);
        setPrintJobs(data.history || []);
      })
      .catch((error) => {
        setFetch(false);
        console.error("Error fetching print jobs:", error);
      });
  };


  useEffect(() => {
    fetchReports();
  }, [month, year]); // Thêm cả `year` để làm phụ thuộc.

  const handleMonthChange = (value) => {
    setMonth(value);
  };

  const handleYearChange = (value) => {
    setYear(value);
  };

  //Hàm xử lí xuất file, sử dụng xlsx
  const downloadReport = () => {
    if (!printJobs || printJobs.length === 0) {
      alert("Không có dữ liệu để tải xuống");
      return;
    }

    // Chuẩn bị dữ liệu xuất ra file Excel
    const data = printJobs.map((job) => ({
      "Printer ID": job.PrinterID,
      "Cơ sở": job.Campus,
      "Tòa nhà": job.Building,
      "Tầng": job.Floor,
      "Tổng số trang in": job.TotalA4Pages,
      "Số lượng lượt in": job.TotalJobs,
      "Doanh thu": job.Revenue,
    }));

    // Tạo workbook và worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Đặt tên sheet và thêm vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Báo cáo");

    // Xuất file Excel
    const fileName = `BaoCao_Thang${month || "TatCa"}_Nam${year}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="wrap-report">
      <div className="title-list-report">
        <NavLink to="/">&larr; Trở về trang chủ</NavLink>
        <h1>Xem lại báo cáo</h1>
      </div>
      <Button
        className="print-button"
        style={{ marginLeft: 0 }}
        icon={<PrinterOutlined />}
        onClick={downloadReport}
      >
        Download Báo cáo
      </Button>

      <div className="wrap-select">
        <label className="choose-month">Chọn tháng:</label>
        <Select
          className="select"
          placeholder="Chọn tháng"
          style={{ width: "120px" }}
          value={month}
          onChange={handleMonthChange}
        >
          <Option value="">Tất cả</Option>
          {[...Array(12)].map((_, index) => (
            <Option key={index + 1} value={String(index + 1)}>
              Tháng {index + 1}
            </Option>
          ))}
        </Select>

        <label className="choose-year">Chọn năm:</label>
        <Select
          className="select"
          placeholder="Chọn năm"
          style={{ width: "120px" }}
          value={year}
          onChange={handleYearChange}
        >
          {[2024, 2023, 2022].map((y) => (
            <Option key={y} value={String(y)}>
              {y}
            </Option>
          ))}
        </Select>
      </div>

      {fetchStatus && Array.isArray(printJobs) && printJobs.length > 0 ? (
  month === "" ? (
    // Khi chọn "Tất cả", nhóm dữ liệu theo tháng
    Object.entries(
      printJobs.reduce((acc, job) => {
        const monthKey = job.Month; // Giả sử dữ liệu API có trường "Month"
        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(job);
        return acc;
      }, {})
    ).map(([monthKey, jobs]) => {
      // Tính tổng cho từng nhóm
      const totalJobs = jobs.reduce((sum, job) => sum + job.TotalJobs, 0);
      const totalPages = jobs.reduce((sum, job) => sum + job.TotalA4Pages, 0);
      const totalRevenue = jobs.reduce((sum, job) => sum + job.Revenue, 0);

      return (
        <div className="list-report" key={monthKey}>
          <h2>
            Tháng {monthKey}, năm {year}
          </h2>
          <table className="table-list-report">
            <thead>
              <tr>
                <td>PrinterID</td>
                <td>Cơ sở</td>
                <td>Tòa nhà</td>
                <td>Tầng</td>
                <td>Tổng số trang in</td>
                <td>Số lượng lượt in</td>
                <td>Doanh thu</td>
              </tr>
            </thead>
            <tbody>
              {jobs.map((detail, detailIndex) => (
                <tr key={detailIndex}>
                  <td>{detail.PrinterID}</td>
                  <td>{detail.Campus}</td>
                  <td>{detail.Building}</td>
                  <td>{detail.Floor}</td>
                  <td>{detail.TotalA4Pages}</td>
                  <td>{detail.TotalJobs}</td>
                  <td>{detail.Revenue}</td>
                </tr>
              ))}
              {/* Hàng tổng */}
              <tr className="total-row">
                <td colSpan={4} style={{ fontWeight: "bold" }}>Tổng cộng</td>
                <td>{totalPages}</td>
                <td>{totalJobs}</td>
                <td>{totalRevenue}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    })
  ) : (
    // Khi lọc theo tháng cụ thể
    <div className="list-report">
      <h2>
        Tháng {month}, năm {year}
      </h2>
      <table className="table-list-report">
        <thead>
          <tr>
            <td>PrinterID</td>
            <td>Cơ sở</td>
            <td>Tòa nhà</td>
            <td>Tầng</td>
            <td>Tổng số trang in</td>
            <td>Số lượng lượt in</td>
            <td>Doanh thu</td>
          </tr>
        </thead>
        <tbody>
          {printJobs.map((detail, detailIndex) => (
            <tr key={detailIndex}>
              <td>{detail.PrinterID}</td>
              <td>{detail.Campus}</td>
              <td>{detail.Building}</td>
              <td>{detail.Floor}</td>
              <td>{detail.TotalA4Pages}</td>
              <td>{detail.TotalJobs}</td>
              <td>{detail.Revenue}</td>
            </tr>
          ))}
          {/* Hàng tổng */}
          <tr className="total-row">
            <td colSpan={4} style={{ fontWeight: "bold" }}>Tổng cộng</td>
            <td>
              {printJobs.reduce((sum, job) => sum + job.TotalA4Pages, 0)}
            </td>
            <td>
              {printJobs.reduce((sum, job) => sum + job.TotalJobs, 0)}
            </td>
            <td>
              {printJobs.reduce((sum, job) => sum + job.Revenue, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
) : (
  <div className="list-report">
    <h2>Không có dữ liệu</h2>
  </div>
)}

    </div>
  );
}

export default OldReport;
