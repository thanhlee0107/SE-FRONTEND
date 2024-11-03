import React, {useEffect,useState} from 'react'
import { NavLink } from 'react-router-dom';
import { Button } from "antd";
import { PlusOutlined, PrinterOutlined } from '@ant-design/icons';
import "./CreateReport.css"
function CreateReport() {
  const [fetchStatus,setFetch]=useState(true);
  const [reportList,setReportlist]=useState([])


  useEffect(() => {
    fetch('https://6722c8fa2108960b9cc59773.mockapi.io/api/v2/createreport') // 
      .then(response => {
        setFetch(true);
        return response.json()
      })
      .then(data => setReportlist(data))
      .catch(error => {
        setFetch(false);
        console.error('Error fetching new report list:', error)
      });
  }, []);


  return (
    <div className='wrap-report'>
      <div>
      <NavLink to='/'>&larr; Trở về trang chủ</NavLink>

        <h1>Tạo báo cáo mới</h1>
      <Button className='plus-button' icon={<PlusOutlined />}>Tạo báo cáo mới</Button>
      <Button className='print-button' icon={<PrinterOutlined />}>Download Báo cáo</Button>

      </div>
      {fetchStatus? reportList.map((item) =>(
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
            {item?.report.floor.map((floor,index)=>(
              <tr key={index}>
                <td>{item?.report.address[index]}</td>
                <td>{item?.report.building[index]}</td>
                <td>{floor}</td>
                <td>{item?.report.totalPage[index]}</td>
                <td>{item?.report.totalPrint[index]}</td>
                <td>{item?.report.income[index]}</td>
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

export default CreateReport
