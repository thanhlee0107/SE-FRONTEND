import { NavLink } from "react-router-dom";
import { useEffect,useState,React} from "react";
import "./History.css";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DatePicker, Button } from "antd";
// import Icon from "@ant-design/icons/lib/components/AntdIcon"; 
// import {  ExclamationCircleOutlined} from "@ant-design/icons"; 
// import { Color } from "antd/es/color-picker";

function History() {
  const [printJobs, setPrintJobs] = useState([]);
  const [fetchStatus, setFetch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(5);//Số bản ghi/ trang
  const [startDate, setStartDate] = useState(null); // Thời gian bắt đầu
  const [endDate, setEndDate] = useState(null); // Thời gian kết thúc

  const getStatusBadge = (status) => {
    const badgeClass = status === 'Đang chờ' ? 'status-pending' : 'status-done';
    return <span className={badgeClass}>{status}</span>;
  };

  const getReportIcon = (report) => {
    return report ? (
      <span className="report-icon"><ExclamationCircleOutlined style={{ fontSize: '22px', color: 'red' }} /></span>
    ) : null;
  };

  const fetchPrintJobs = (page) => {
    const token = localStorage.getItem("access_token");
    
    // Lựa chọn URL API dựa trên việc có bộ lọc ngày hay không
    const getApiUrl = () => {
      const studentID = localStorage.getItem("student_ID");
      //page và limit cho paging
      let query = `?page=${page}&limit=${limit}`;
      if (startDate && endDate) {
        query += `&startDate=${startDate}&endDate=${endDate}`;
        return `http://localhost:8080/history/${studentID}/date${query}`;
      }
      return `http://localhost:8080/history/${studentID}${query}`;
    };
    // Gọi API với URL phù hợp, gửi accessToken xác thực
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
    fetchPrintJobs(currentPage);
  }, [currentPage, startDate, endDate]); // Lắng nghe cả từ khóa thời gian
  //Paging
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Hàm xử lý khi áp dụng bộ lọc
  const applyFilter = () => {
    setCurrentPage(1); // Reset về trang 1
    fetchPrintJobs(1); // Fetch dữ liệu mới
  };

  return (
    <div className="wrapper-history">
      <div>
        <NavLink to='/'>&larr; Trở về trang chủ</NavLink>
        <h1>Xem lịch sử</h1>
      </div>

      {/* Bộ lọc thời gian */}
      <div className="filter-container">
        <DatePicker 
          placeholder="Từ ngày" 
          onChange={(date, dateString) => setStartDate(dateString)} 
          style={{ marginRight: '10px' }}
        />
        <DatePicker 
          placeholder="Đến ngày" 
          onChange={(date, dateString) => setEndDate(dateString)} 
          style={{ marginRight: '10px' }}
        />
        <Button type="primary" onClick={applyFilter}>Lọc</Button>
      </div>

      <table className="table-list-info">
        <thead>
          <tr>
            <td>ID máy in</td>
            <td>Cơ sở</td>
            <td>Tòa nhà</td>
            <td>Tầng</td>
            <td>Trạng thái</td>
            <td>Ngày gửi yêu cầu</td>
            <td>Ngày in</td>
            <td>Tên file in</td>
            <td>Số bản in</td>
            <td>Báo cáo</td>
          </tr>
        </thead>
        <tbody>
          {fetchStatus && printJobs.length > 0 ? (
            printJobs.map((job, index) => (
              <tr key={index}>
                <td>{job.PrinterID}</td>
                <td>{job.Campus}</td>
                <td>{job.Building}</td>
                <td>{job.Floor}</td>
                <td>{getStatusBadge(job.Status)}</td>
                <td>{job.Date}</td>
                <td>{job.EndDate}</td>
                <td>{job.Name}</td>
                <td>{job.Amount}</td>
                <td>{getReportIcon('s')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center' }}>Không có dữ liệu</td>
            </tr>
          )}
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
      <div className="pagination-info">
        Trang {currentPage} trên {totalPages}
      </div>
    </div>
  );
}

export default History;
