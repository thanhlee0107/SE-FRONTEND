import React, { useState,useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { Select,Button } from 'antd';
import {PrinterOutlined} from '@ant-design/icons'
import "./OldReport.css"

const {Option} = Select
function OldReport() {

  const [fetchStatus,setFetch]=useState(true);
  const [reportList,setReportlist]=useState([])
  const [month, setMonth] = useState(""); // Tháng cần lọc

  useEffect(() => {
    fetch('https://6722c8fa2108960b9cc59773.mockapi.io/api/v2/oldreport') // 
      .then(response => {
        setFetch(true);
        return response.json()
      })
      .then(data => setReportlist(data))
      .catch(error => {
        setFetch(false);
        console.error('Error fetching report list:', error)
      });
  }, []);


  // Hàm lọc và sắp xếp dữ liệu theo tháng gần nhất
  const filterAndSortDataByMonth = (data, month) => {
    // Sắp xếp dữ liệu từ tháng gần nhất đến xa nhất
    const sortedData = [...data].sort((a, b) => {
      return b.report.time[0] - a.report.time[0]; // Sắp xếp giảm dần
    });

    // Lọc theo tháng (nếu có chọn tháng)
    if (month) {
      return sortedData.filter(item => {
        const itemMonth = item.report.time[0]
        return itemMonth === parseInt(month);
      });
    }

    // Trả về tất cả nếu không có tháng nào được chọn
    return sortedData;
  };
  const handleMonthChange = (value) => {
    setMonth(value);
  };


  // Dữ liệu đã lọc và sắp xếp
  const filteredData = filterAndSortDataByMonth(reportList, month);

  return (
    <div className='wrap-report'>
      <div className='title-list-report'>
      <NavLink to='/'>&larr; Trở về trang chủ</NavLink>
      <h1>Xem lại báo cáo</h1>
      </div>
      <Button className='print-button' style={{marginLeft:0}} icon={<PrinterOutlined />}>Download Báo cáo</Button>

      <div className='wrap-select'>
      <label className='choose-month'>Chọn tháng:</label>
      <Select
      className='select'
        placeholder="Chọn tháng"
        style={{ width: '120px' }}
        value={month}
        onChange={handleMonthChange}
        
      >
        <Option value="">Tất cả</Option>
        <Option value="9">Tháng 9</Option>
        <Option value="8">Tháng 8</Option>
        <Option value="7">Tháng 7</Option>
        <Option value="6">Tháng 6</Option>
        <Option value="5">Tháng 5</Option>
      </Select>
    </div>
      {fetchStatus? filteredData.map((item) =>(
      <div className='list-report'>
        <h2>Tháng {item.report.time[0]}, năm {item.report.time[1]}</h2>
        <table className='table-list-report'>
            <thead>
                <tr>
                    <td>
                    Cơ sở
                    </td>
                    <td>
                    Tòa nhà
                    </td>
                    <td>
                    Tầng
                    </td>
                    <td>
                    Tổng số trang in
                    </td>
                    <td>
                    Số lượng lượt in
                    </td>
                    <td>
                    Doanh thu
                    </td>
                </tr>
            </thead>
            
            <tbody>
            {item.report.floor.map((floor,index)=>(
              <tr key={index}>
                <td>{item.report.address[index]}</td>
                <td>{item.report.building[index]}</td>
                <td>{floor}</td>
                <td>{item.report.totalPage[index]}</td>
                <td>{item.report.totalPrint[index]}</td>
                <td>{item.report.income[index]}</td>
              </tr>
            ))}
            
            </tbody>
        </table>
      </div>))
    :( <div className='list-report'>
      <h2>Tháng , năm</h2>
      <table className='table-list-report'>
          <thead>
              <tr>
                  <td>
                  Cơ sở
                  </td>
                  <td>
                  Tòa nhà
                  </td>
                  <td>
                  Tầng
                  </td>
                  <td>
                  Tổng số trang in
                  </td>
                  <td>
                  Số lượng lượt in
                  </td>
                  <td>
                  Doanh thu
                  </td>
              </tr>
          </thead>
        </table> 
        </div> 
        )  
    }
    </div>
  )
}

export default OldReport
