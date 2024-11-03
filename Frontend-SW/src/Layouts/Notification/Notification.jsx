import "./Notification.css";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { LogoutOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from "moment";


function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get("https://6720b2f898bbb4d93ca593f3.mockapi.io/api/PrivateNotifications") // Đường dẫn đến API MockAPI
      .then(response => setNotifications(response.data))
      .catch(error => console.error("Error fetching notifications:", error));
  }, []);

  return (
    <div className="notifications-dropdown">
      <h3>Thông báo</h3>
      <hr className="custom-hr" />
      <div className="notifications-list">
        {notifications.length > 0 ? (


          notifications.map((notification) => (
            <div className="notification1" key={notification.id}>
              <div className="notification-header">
                <img
                  src={notification.avatar}
                  alt="User Avatar"
                  className="notification-icon"
                />
                <div className="notification-header-content">
                  <span className="notification-name">{notification.name}</span>
                  <span className="notification-date">
                    {moment(notification.date).format("D/M/YYYY")}
                  </span>
                </div>
              </div>
              <div className="notification-body">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-text">{notification.content}</p>
              </div>
            </div>
          ))

        ) : (
          <p>Loading new notifications...</p>
        )}

      </div>
    </div>

  );
}
export default Notification;