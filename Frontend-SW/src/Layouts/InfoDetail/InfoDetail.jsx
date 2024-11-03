import "./InfoDetail.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogoutOutlined } from '@ant-design/icons';
import axios from "axios";

function InfoDetail({userData}) {
  // check data tí xóa
  console.log(userData);

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="infodetail">
      
      {!userData?.admin ? (
        <ul>
          <p>Thông tin sinh viên</p>
          <hr className="custom-hr" />
          <li>Họ tên: {userData?.name}</li>
          <li>MSSV: {userData?.ID}</li>
          <li>Khoa: {userData?.role}</li>
          <li>Lớp: {userData?.class}</li>
          <li>Số trang còn lại: {userData?.page}</li>
          <li>Số dư BK pay: {userData?.money}</li>
        </ul>
        
      ) : (
        <ul>
          <p>Thông tin quản lí</p>
          <hr className="custom-hr" />
          <li>Họ tên: {userData?.name}</li>
          <li>Mã số: {userData?.ID}</li>
          <li>Chức vụ: {userData?.role}</li>
          <li>Email: {userData?.email}</li>
          <li>Điện thoại: {userData?.phone}</li>
        </ul>
      )}
      <div className="buttons-container">
      {!userData?.admin && ( 
          <button className="buy">
            <NavLink to='/payment'>Mua thêm</NavLink>
          </button>
        )}
        <button className="exit">
          <NavLink to='/login'>
            <LogoutOutlined style={{ marginRight: 14 }} />
            Thoát
          </NavLink>
        </button>
      </div>
    </div>
  );

  
  // const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('https://6720b2f898bbb4d93ca593f3.mockapi.io/api/userInfoS/1');
  //       setUserData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (!userData) {
  //   return <div>Loading...</div>;
  // }

  // return (
  //   <div className="infodetail">
  //     <ul>
  //       <p>Thông tin sinh viên</p>
  //       <hr className="custom-hr" />
  //       <li>Họ tên: {userData.name}</li>
  //       <li>MSSV: {userData.studentID}</li>
  //       <li>Khoa: {userData.faculty}</li>
  //       <li>Lớp: {userData.class}</li>
  //       <li>Số trang còn lại: {userData.remainingPages}</li>
  //       <li>Số dư BK pay: {userData.bkPayBalance}</li>
  //     </ul>
  //     <div className="buttons-container">
  //       <button className="buy"><NavLink to='/payment'>Mua thêm</NavLink></button>
  //       <button className="exit">
          
  //         <NavLink to='/login'>
  //           <LogoutOutlined style={{ marginRight: 14 }} />
  //           Thoát
  //         </NavLink>
  //       </button>
  //     </div>
  //   </div>
  // );
}
export default InfoDetail;
