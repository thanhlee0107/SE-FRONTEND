import "./AdHome.css";
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form,  Select } from "antd";

import axios from 'axios';

const { Option } = Select;
function AdHome() {
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        axios.get("https://6720b2f898bbb4d93ca593f3.mockapi.io/api/adminnotices")
            .then((response) => {
                // Ánh xạ trường ID từ API sang `id` (điều chỉnh tên trường nếu cần)
                const fetchedNotifications = response.data.map((item) => ({
                    ...item,
                    id: item.notification_id || item.id  // điều chỉnh nếu API dùng tên khác
                }));
                setNotifications(fetchedNotifications);
            })
            .catch((error) => console.error("Lỗi khi lấy dữ liệu thông báo:", error));
    }, []);



    // Handle add notification
    const handleAddOrUpdateNotification = (values) => {
        if (editingIndex !== null) {
            const notificationToUpdate = notifications[editingIndex];
            axios.put(`https://6720b2f898bbb4d93ca593f3.mockapi.io/api/adminnotices/${notificationToUpdate.id}`, values)
                .then((response) => {
                    const updatedNotifications = [...notifications];
                    updatedNotifications[editingIndex] = response.data;
                    setNotifications(updatedNotifications);
                    setEditingIndex(null);
                    setIsModalOpen(false);
                    form.resetFields();
                    alert("Thông báo đã được cập nhật thành công.");
                })
                .catch((error) => {
                    console.error("Lỗi khi cập nhật thông báo:", error);
                    alert("Cập nhật thông báo không thành công. Vui lòng thử lại.");
                });
        } else {
            if (!values.recipient || values.recipient.trim() === "") {
                values.recipient = "Tất cả sinh viên";
            }
            
            axios.post('https://6720b2f898bbb4d93ca593f3.mockapi.io/api/adminnotices', values)
                .then((response) => {
                    setNotifications([...notifications, response.data]);
                    setIsModalOpen(false);
                    form.resetFields();
                    alert("Thông báo đã được thêm thành công.");
                })
                .catch((error) => {
                    console.error("Lỗi khi thêm thông báo:", error);
                    alert("Thêm thông báo không thành công. Vui lòng thử lại.");
                });
        }
    };


    const handleEditNotification = (index) => {
        setEditingIndex(index);
        form.setFieldsValue(notifications[index]);
        setIsModalOpen(true);
    };

    const handleDeleteNotification = (id) => {
        // Confirm before deleting
        console.log(id);
        if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này không?")) {
            axios.delete(`https://6720b2f898bbb4d93ca593f3.mockapi.io/api/adminnotices/${id}`)
                .then(() => {
                    // Update the notifications state after successful deletion
                    setNotifications(notifications.filter((item) => item.id !== id));
                    alert("Thông báo đã được xóa thành công.");
                })
                .catch((error) => {
                    console.error("Lỗi khi xóa thông báo:", error);
                    alert("Xóa thông báo không thành công. Vui lòng thử lại.");
                });
        }
    };

    return (
        <div className="adminHome">
            <div>
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
            </div>

            <div className="notification-container">
                <Button
                    type="primary"
                    className="add-notification-btn"
                    onClick={() => {
                        setIsModalOpen(true);
                        form.resetFields();
                        setEditingIndex(null);
                    }}
                >
                    Thêm Thông Báo
                </Button>

                <table className="notification-table">
                    <thead>
                        <tr>
                            <th >Tiêu đề</th>
                            <th>Nội dung</th>
                            <th className="center">Người nhận</th>
                            <th className="center">Chỉnh sửa</th>
                            <th className="center">Loại bỏ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification, index) => (
                            <tr key={index}>
                                <td className="title-Notification">{notification.title}</td>
                                <td>{notification.content}</td>
                                <td className="center">{notification.recipient}</td>
                                <td className="center">
                                    <Button className="btn-edit" onClick={() => handleEditNotification(index)}>
                                        Chỉnh sửa
                                    </Button>
                                </td>
                                <td className="center">
                                    <Button className="btn-delete" onClick={() => handleDeleteNotification(notification.id)}>
                                        Loại bỏ
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Adding/Editing Notification */}
                <Modal
                    title={editingIndex !== null ? 'Chỉnh sửa thông báo' : 'Tạo thông báo'}
                    visible={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onOk={() => form.submit()}
                >
                    <Form form={form} onFinish={handleAddOrUpdateNotification} layout="vertical">
                        <Form.Item
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                        >
                            <Input placeholder="Nhập tiêu đề thông báo" />
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="Nội dung"
                            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                        >
                            <Input.TextArea placeholder="Nhập nội dung thông báo" />
                        </Form.Item>

                        <Form.Item
                            name="recipient"
                            label="MSSV"
                            rules={[{  required: false, message: 'Nhập MSSV hoặc để trống để gửi cho tất cả sinh viên!' }]}
                        >
                            <Input placeholder="Nhập mã số sinh viên" />
                        </Form.Item>

                        <Form.Item>
                            <p>
                                Người nhận: <strong>{form.getFieldValue('recipient') || 'Tất cả sinh viên'}</strong>
                            </p>
                        </Form.Item>


                    </Form>
                </Modal>
            </div>
        </div>
    )
}
export default AdHome;