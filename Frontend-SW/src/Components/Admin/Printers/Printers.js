import "./Printers.css";
import { useState, useEffect } from "react";
import { Modal, Button, Input, Form, Switch, notification } from "antd";
import { PlusOutlined } from '@ant-design/icons';

function Printers() {
    const [printers, setPrinters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMaintainModalVisible,setIsMaintainModalVisible] = useState(false)
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newPrinter, setNewPrinter] = useState({
        status: true,
        campus: "",
        depart: "",
        floor: "",
        paperNumber: 100,
        inkRate: 100,
        url: "",
    });

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editedPrinter, setEditedPrinter] = useState(null);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = printers.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(printers.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const showModal = (product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalVisible(false);
        setNewPrinter({
            status: true,
            campus: "",
            depart: "",
            floor: "",
            paperNumber: 100,
            inkRate: 100,
            url: "",
        });
    };
    // add new printer
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPrinter({
            ...newPrinter,
            [name]: value,
        });
    };

    const handleStatusChange = (checked) => {
        setNewPrinter((prev) => ({
            ...prev,
            status: checked,
        }));
    };

    const handleSubmitNewPrinter = () => {
        if (!newPrinter.campus || !newPrinter.depart || !newPrinter.floor || !newPrinter.url) {
            notification.error({
                message: "Vui lòng điền đầy đủ thông tin",
                description: "Error",
            });
            return;
        }
        fetch('https://6720e67198bbb4d93ca694f9.mockapi.io/printers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPrinter),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setPrinters((prev) => [...prev, data]);
                handleCloseAddModal();
                notification.success({
                    message: "Thêm máy in thành công",
                    description: "Success",
                });
            })
            .catch(() => {
                notification.error({
                    message: "Không thể thêm máy in",
                    description: "Error",
                });
            });
    };

    //Edit printer info
    const showEditModal = () => {
        setEditedPrinter(selectedProduct);
        setIsEditModalVisible(true);
        handleCloseModal();
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPrinter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditStatusChange = (checked) => {
        setEditedPrinter((prev) => ({
            ...prev,
            status: checked,
        }));
    };

    const handleSubmitEditPrinter = () => {
        fetch(`https://6720e67198bbb4d93ca694f9.mockapi.io/printers/${editedPrinter.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedPrinter),
        })
            .then(response => response.json())
            .then((data) => {
                setPrinters((prev) => prev.map((printer) => (printer.id === data.id ? data : printer)));
                setIsEditModalVisible(false);
                notification.success({
                    message: "Cập nhật máy in thành công",
                    description: "Success",
                });
            })
            .catch(() => {
                notification.error({
                    message: "Không thể cập nhật máy in",
                    description: "Error",
                });
            });
    };

    //delete printer
    const showDeleteConfirmation = () => {
        Modal.confirm({
            title: 'Bạn chắc chắn muốn xóa máy in?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                handleDeletePrinterConfirmed();
            },
            onCancel() {
                handleCloseModal();
            },
        });
    };
    const handleDeletePrinterConfirmed = () => {
        fetch(`https://6720e67198bbb4d93ca694f9.mockapi.io/printers/${selectedProduct.id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                setPrinters(prevPrinters => prevPrinters.filter(printer => printer.id !== selectedProduct.id));
                notification.success({
                    message: `Xóa máy in thành công máy in ID ${selectedProduct.id}`,
                    description: "Success",
                });
                handleCloseModal();
            })
            .catch(() => {
                notification.error({
                    message: "Không thể xóa máy in",
                    description: "Error",
                });
            });
    };

    const handleDeletePrinter = () => {
        showDeleteConfirmation();
    };

    //maintain modal
    const showMaintainModal = () => {
        // setEditedPrinter(selectedProduct);
        setIsMaintainModalVisible(true);
        handleCloseModal();
    };
    const handleCloseMaintainModal = () =>{
        setIsMaintainModalVisible(false);
        setSelectedProduct(null);

    }

    //show info

    useEffect(() => {
        fetch("https://6720e67198bbb4d93ca694f9.mockapi.io/printers")
            .then((res) => res.json())
            .then((printers) => {
                setPrinters(printers);
            })
            .catch((error) => {
                console.error("Error fetching printers:", error);
            });
    }, []);

    return (
        <div id="wrapper">
            <div id="header">
                <a href="/" className="back-button">
                    &larr; Trở về trang chủ
                </a>
                <h1>Quản lý máy in</h1>
            </div>

            <div className="add-button">
                <button onClick={showAddModal} className="add-printer-button">
                    <PlusOutlined style={{ marginRight: 8 }} />
                    Thêm máy in
                </button>
            </div>

            <div className="printer-container">
                {currentProducts.map((product) => (
                    <div
                        className={`printer ${product.status ? 'active' : 'inactive'}`}
                        key={product.id}
                        onClick={() => showModal(product)}
                    >
                        <img src={product.url} alt="Ảnh máy in" />
                        <h3>Máy in ID{product.id}</h3>
                        <p>{product.campus}, tòa {product.depart}, tầng {product.floor}</p>
                    </div>
                ))}
            </div>



            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <Modal
                title={selectedProduct?.name}
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button type="primary" key="maintain" onClick={showMaintainModal}>
                        Bảo trì
                    </Button>,

                    <Button type="primary" key="back" onClick={handleDeletePrinter} danger>
                        Xóa
                    </Button>,
                    <Button type="primary" key="edit" onClick={showEditModal} >
                        Chỉnh sửa
                    </Button>,
                ]}
            >
                {selectedProduct && (
                    <>
                        <img src={selectedProduct.url} alt="Ảnh máy in" style={{ width: "100%", height: "auto" }} />
                        <p>
                            <strong>Tình trạng: </strong>
                            <span style={{ color: selectedProduct.status ? "green" : "red" }}>
                                {selectedProduct.status ? "Đang hoạt động" : "Tạm dừng"}
                            </span>
                        </p>
                        <p>
                            <strong>Vị trí:</strong> {selectedProduct.campus}, tòa {selectedProduct.depart}, tầng {selectedProduct.floor}
                        </p>
                        <p>
                            <strong>Số lượng giấy còn lại trong máy: </strong>
                            <span style={{ color: selectedProduct.paperNumber <= 50 ? "red" : "green" }}>
                                {selectedProduct.paperNumber}
                            </span>
                        </p>
                        <p>
                            <strong>Phần trăm mực in trong máy: </strong>
                            <span style={{ color: selectedProduct.inkRate <= 20 ? "red" : "green" }}>
                                {selectedProduct.inkRate}%
                            </span>
                        </p>
                    </>
                )}
            </Modal>

            <Modal
            title="Bảo trì máy in"
            visible={isMaintainModalVisible}
            onCancel={handleCloseMaintainModal}
            footer={[
                <Button key="back" onClick={handleCloseMaintainModal}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={() => setIsEditModalVisible(true)}>
                    Bảo trì
                </Button>,
                <Button key="submit" type="primary" onClick={() => setIsEditModalVisible(true)}>
                    Kích hoạt
                </Button>,
            ]}
            />

            <Modal
                title="Thêm Máy In"
                visible={isAddModalVisible}
                onCancel={handleCloseAddModal}
                footer={[
                    <Button key="back" onClick={handleCloseAddModal}>
                        Đóng
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmitNewPrinter}>
                        Thêm
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    <Form.Item label="Hoạt động">
                        <Switch checked={newPrinter.status} onChange={handleStatusChange} />
                    </Form.Item>
                    <Form.Item label="Vị trí">
                        <Input name="campus" placeholder="Cơ sở 1, 2..." value={newPrinter.campus} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Tòa">
                        <Input name="depart" placeholder="H6..." value={newPrinter.depart} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Tầng">
                        <Input name="floor" placeholder="1, 2..." value={newPrinter.floor} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Số lượng giấy còn lại">
                        <Input type="number" name="paperNumber" value={newPrinter.paperNumber} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Phần trăm mực in">
                        <Input type="number" name="inkRate" value={newPrinter.inkRate} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="URL Ảnh">
                        <Input name="url" placeholder="Link..." value={newPrinter.url} onChange={handleInputChange} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Chỉnh sửa Máy In"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsEditModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmitEditPrinter}>
                        Lưu
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    <Form.Item label="Hoạt động">
                        <Switch checked={editedPrinter?.status} onChange={handleEditStatusChange} />
                    </Form.Item>
                    <Form.Item label="Vị trí Campus">
                        <Input name="campus" value={editedPrinter?.campus} onChange={handleEditInputChange} />
                    </Form.Item>
                    <Form.Item label="Tòa">
                        <Input name="depart" value={editedPrinter?.depart} onChange={handleEditInputChange} />
                    </Form.Item>
                    <Form.Item label="Tầng">
                        <Input name="floor" value={editedPrinter?.floor} onChange={handleEditInputChange} />
                    </Form.Item>
                    <Form.Item label="Số lượng giấy còn lại">
                        <Input type="number" name="paperNumber" value={editedPrinter?.paperNumber} onChange={handleEditInputChange} />
                    </Form.Item>
                    <Form.Item label="Phần trăm mực in">
                        <Input type="number" name="inkRate" value={editedPrinter?.inkRate} onChange={handleEditInputChange} />
                    </Form.Item>
                    <Form.Item label="URL Ảnh">
                        <Input name="url" value={editedPrinter?.url} onChange={handleEditInputChange} />
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
}

export default Printers;
