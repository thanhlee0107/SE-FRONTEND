import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Home.css";
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

export default function Home() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from MockAPI using Axios
    axios.get("https://6720b2f898bbb4d93ca593f3.mockapi.io/api/adminnotices")
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error("Error fetching notifications:", error);
      });
  }, []);

  return (
    <div className="homepage">
      {/* Phần hình ảnh nền */}
      <div className="banner">
        <img
          src="https://lms.hcmut.edu.vn/pluginfile.php/3/theme_academi/slide1image/1725955904/slbk.jpg"
          alt="Trường Đại học Bách Khoa"
          className="banner-image"
        />
        <div className="banner-text">
          <h1>TRƯỜNG ĐẠI HỌC BÁCH KHOA - ĐHQG TP HỒ CHÍ MINH</h1>
          <h2>SMART PRINTING SYSTEM</h2>
        </div>
      </div>

     {/* Notification Section */}
     <div className="notification-section">
        <h3>Thông báo chung</h3>
        {notifications.map((notification) => (
          <div className="notification" key={notification.id}>
            <img src={notification.avatar} alt="User Avatar" className="notification-icon" />
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p className="notification-date">Bởi {notification.name} - {moment(notification.date).format('dddd, D/M/YYYY')}</p>
              <p className="notification-text">{notification.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}
