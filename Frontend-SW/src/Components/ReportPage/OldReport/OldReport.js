import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Select, Button, Pagination } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import "./OldReport.css";
import * as XLSX from "xlsx";

const { Option } = Select;

function OldReport() {
  const [printJobs, setPrintJobs] = useState([]);
  const [fetchStatus, setFetch] = useState(true);
  const [month, setMonth] = useState("Tất cả");
  const [year, setYear] = useState("2024");
  const [limit] = useState(10);//Số bản ghi/ trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReports = (page = 1) => {
    const token = localStorage.getItem("access_token");

    const getApiUrl = () => {
      let query = ``;
      let query1 = `page=${page}&year=${year}&limit=${limit}`;
      if (month && month !== "Tất cả") {
        query += `/month?month=${month}&${query1}`;
      } else {
        query += `?${query1}`;
      }
      return `http://localhost:8080/report${query}`;
    };

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
        setTotalPages(data.totalPages || 0);
      })
      .catch((error) => {
        setFetch(false);
        console.error("Error fetching print jobs:", error);
      });
  };

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, month, year]);

  const handleMonthChange = (value) => {
    setMonth(value);
    setCurrentPage(1);
  };

  const handleYearChange = (value) => {
    setYear(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const downloadReport = () => {
    if (!printJobs || printJobs.length === 0) {
      alert("Không có dữ liệu để tải xuống");
      return;
    }

    const data = printJobs.map((job) => ({
      "Printer ID": job.PrinterID,
      "Cơ sở": job.Campus,
      "Tòa nhà": job.Building,
      "Tầng": job.Floor,
      "Tổng số trang in": job.TotalA4Pages,
      "Số lượng lượt in": job.TotalJobs,
      "Doanh thu": job.Revenue,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Báo cáo");
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
          <Option value="Tất cả">Tất cả</Option>
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
        <div className="list-report">
          <table className="table-list-report">
            <thead>
              <tr>
              <th>PrinterID</th>
                <th>Cơ sở</th>
                <th>Tòa nhà</th>
                <th>Tầng</th>
                <th>Tổng số trang in</th>
                <th>Số lượng lượt in</th>
                <th>Doanh thu</th>
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
              <tr className="summary-row">
                <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
                  Tổng cộng:
                </td>
                <td>
                  {printJobs.reduce((sum, job) => sum + job.TotalA4Pages, 0)}
                </td>
                <td>
                  {printJobs.reduce((sum, job) => sum + job.TotalJobs, 0)}
                </td>
                <td>
                  {printJobs.reduce((sum, job) => sum + job.Revenue, 0).toLocaleString()} VND
                </td>
              </tr>
            </tbody>
          </table>
          <ul className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <button
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
        </div>
      ) : (
        <div className="list-report">
          <h2>Không có dữ liệu</h2>
        </div>
      )}
    </div>
  );
}

export default OldReport;