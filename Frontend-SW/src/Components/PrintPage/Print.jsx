import { NavLink } from "react-router-dom";
import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FolderOutlined,
  UploadOutlined,
  SettingOutlined,
  PrinterOutlined,
  SearchOutlined
} from "@ant-design/icons";
import "./Print.css";

function Print() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [uploadTriggered, setUploadTriggered] = useState(false);
  const [formData, setFormData] = useState({
    printCopies: 1,
    scale: 100,
    pagesPerSheet: 1,
    paperSize: 'A4',
    printType: 'In trắng đen',
    orientation: 'In dọc',
    layout: '1',
    coSo: 'CS1',        // New field
    toaNha: 'A1',       // New field
    tang: 'Tầng 1'
  });
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Chuyển đổi đối tượng FileList thành mảng
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Thêm tệp mới vào mảng
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove)); // Xóa tệp khỏi mảng
  };

  const handleUpload = async () => {
    const uploadData = {
      files: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    };
    try {
      const response = await axios.post('https://671d178809103098807c3d9c.mockapi.io/api/uploadfiles', uploadData);
      setUploadTriggered('true')
      alert('Tải lên thành công: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error("Đã xảy ra lỗi khi tải lên: ", error);
      alert('Tải lên thất bại');
    }
  };

  useEffect(() => {
    async function fetchFiles() {
      if (uploadTriggered) {
        try {
          const response = await axios.get('https://671d178809103098807c3d9c.mockapi.io/api/uploadfiles');
          const lastFile = response.data[response.data.length - 1]; // Get only the last element
          setFiles([lastFile]);
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      }

    }
    fetchFiles();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  // Submit configuration to MockAPI
  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file to configure.');
      return;
    }

    const configurationData = {
      fileId: selectedFile,
      ...formData,
    };

    try {
      await axios.post('https://671d178809103098807c3d9c.mockapi.io/api/configureFiles', configurationData);
      alert('Configuration saved successfully!');
     
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration.');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]); // Thêm tệp được kéo thả vào mảng
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định
  };
  // const [myCar, setMyCar] = useState("Volvo");
  // const [selectedOption, setSelectedOption] = useState('1'); // Quản lý trạng thái của radio buttons

  // const handleChange = (event) => {
  //   setMyCar(event.target.value);
  // };

  // const handleOptionChange = (event) => {
  //   setSelectedOption(event.target.value); // Cập nhật khi người dùng chọn radio button
  // };

  // const [showTable, setShowTable] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedPrinterId, setSelectedPrinterId] = useState(null);

  // // Danh sách máy in giả định
  // const printers = [
  //   { id: 1, coSo: "Cơ sở 1", toaNha: "Tòa nhà A", tang: 1, trangThai: "Hoạt động", hangCho: 2 },
  //   { id: 2, coSo: "Cơ sở 2", toaNha: "Tòa nhà B", tang: 3, trangThai: "Hoạt động", hangCho: 5 },
  //   { id: 3, coSo: "Cơ sở 3", toaNha: "Tòa nhà C", tang: 2, trangThai: "Bảo trì", hangCho: 0 },
  //   { id: 4, coSo: "Cơ sở 4", toaNha: "Tòa nhà D", tang: 2, trangThai: "Hoạt động", hangCho: 1 }
  // ];

  // Hàm toggle hiển thị bảng
  // const toggleTable = () => {
  //   setShowTable(!showTable);
  // };
  // // Hàm để lọc danh sách máy in theo tên tòa nhà
  // // const filteredPrinters = printers.filter(printer =>
  // //   printer.toaNha.toLowerCase().includes(searchTerm.toLowerCase())
  // // );

  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value); // Cập nhật giá trị tìm kiếm khi người dùng nhập
  // };

  // // Hàm xử lý chọn máy in
  // const handleSelectPrinter = (id) => {
  //   setSelectedPrinterId(id); // Cập nhật máy in được chọn
  // };
  return (
    <div id="wrapper0">
      <div id="header">
        <NavLink to='/'>&larr; Trở về trang chủ</NavLink>
        <h1>In ấn</h1>
      </div>

      <div className="file-upload-container">
        {/* Phần header phía trên */}
        <div className="file-upload-header">
          <div className="file-image">
            <FolderOutlined style={{ fontSize: '24px', color: '#000' }} />
            <h2>Tải tập tin</h2>
          </div>
          <div className="file-actions">
            <label className="file-choose-button">
              Chọn tệp
              <input
                type="file"
                multiple // Cho phép chọn nhiều tệp
                onChange={handleFileChange}
                style={{ display: 'none' }} // Ẩn nút input file
              />
            </label>
            <button
              onClick={handleUpload}
              className="upload-button"
              disabled={files.length === 0} // Chỉ kích hoạt nút khi đã chọn tệp
            >
              Tải lên
            </button>
          </div>
        </div>

        {/* Phần khung kéo thả phía dưới */}
        <div
          className="file-dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <UploadOutlined style={{ fontSize: '24px', color: '#08c' }} />
          {files.length > 0 ? (
            <div className="file-info">
              {files.map((file) => (
                <div key={file.name} className="file-item">
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(file)}
                    style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Kéo thả tệp tin vào đây hoặc chọn tệp ở trên</p>
          )}
        </div>

      </div>

      <div className="file-upload-container">
        <div className="file-upload-header">
          <div className="file-image">
            <SettingOutlined style={{ fontSize: '24px', color: '#000' }} />
            <h2>Cấu hình in</h2>
          </div>
        </div>

        <div id="wrapper1">
          {/* Dropdown to select file */}
          <div className="chooseFile">
            <label >
              Chọn file để in
              <select className="node" value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)}>
                <option value="">Select a file</option>
                {files.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.name}
                  </option>
                ))}
              </select>
            </label>
          </div>


          {/* Configuration form */}
          <div className="input-group">
            <div className="quantity-input-container">
              <label className="quantity-input-label">Số lượng bản in</label>
              <input
                type="number"
                name="printCopies"
                value={formData.printCopies}
                onChange={handleInputChange}
                className="quantity-input"
              />
            </div>
            <div className="quantity-input-container">
              <label className="quantity-input-label">Tỉ lệ</label>
              <input
                type="number"
                name="scale"
                value={formData.scale}
                onChange={handleInputChange}
                className="quantity-input"
              />
            </div>
            <div className="quantity-input-container">
              <label className="quantity-input-label">Số trang mỗi tờ</label>
              <input
                type="number"
                name="pagesPerSheet"
                value={formData.pagesPerSheet}
                onChange={handleInputChange}
                className="quantity-input"
              />
            </div>
          </div>

          {/* Additional configuration fields */}
          <div className="input-group">
            <div className="quantity-input-container">
              <label>Kích thước trang</label>
              <select
                name="paperSize"  // Add this attribute
                className="node"
                value={formData.paperSize}
                onChange={handleInputChange}
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="A2">A2</option>
              </select>
            </div>

            <div className="quantity-input-container">
              <label>Kiểu in</label>
              <select name="printType" className="node" value={formData.printType} onChange={handleInputChange}>
                <option value="In trắng đen">In trắng đen</option>
                <option value="In màu nhám">In màu nhám</option>
                <option value="In màu bóng">In màu bóng</option>
              </select>
            </div>
            <div className="quantity-input-container">
              <label>Hướng giấy</label>
              <select name="orientation" className="node" value={formData.orientation} onChange={handleInputChange}>
                <option value="In dọc">In dọc</option>
                <option value="In ngang">In ngang</option>
              </select>
            </div>
          </div>

          {/* Layout selection */}
          <div className="input-group1">
            <p style={{ marginRight: '10px' }}>Bố cục</p>
            <label>
              <input
                type="radio"
                name="layout"
                value="1"
                checked={formData.layout === '1'}
                onChange={handleInputChange}
              />
              Chân dung
            </label>
            <label>
              <input
                type="radio"
                name="layout"
                value="2"
                checked={formData.layout === '2'}
                onChange={handleInputChange}
              />
              Toàn cảnh
            </label>
          </div>
        </div>
      </div>

      <div>

      </div>

      <div className="file-upload-container">
        <div className="file-upload-header">
          <div className="file-image">
            <PrinterOutlined style={{ fontSize: '24px', color: '#000' }} />
            <h2>Chọn máy in</h2>
          </div>
          <div className="file-actions">
            <div className="file-image">
              {/* Khi bấm vào icon, toggle hiển thị bảng
              <SearchOutlined
                style={{ fontSize: '24px', color: '#000', cursor: 'pointer' }}
                onClick={toggleTable}
              /> */}
            </div>

          </div>
        </div>

        <div id='wrapper1'>
          <div className="input-group">
            <div className="quantity-input-container">
              <form>
                <label>Cơ sở
                  <select name="coSo" className="node" value={formData.coSo} onChange={handleInputChange}>
                    <option value="CS1">CS1</option>
                    <option value="CS2">CS2</option>
                  </select>
                </label>
              </form>
            </div>
            <div className="quantity-input-container">
              <form>
                <label>Tòa nhà
                  <select name="toaNha" className="node" value={formData.toaNha} onChange={handleInputChange}>
                    <option value="A1">A1</option>
                    <option value="B1">B1</option>
                    <option value="C1">C1</option>
                    <option value="H1">H1</option>
                  </select>
                </label>
              </form>
            </div>
            <div className="quantity-input-container">
              <form>
                <label>Tầng
                  <select name="tang" className="node" value={formData.tang} onChange={handleInputChange}>
                    <option value="Tầng 1"> 1</option>
                    <option value="Tầng 2"> 2</option>
                    <option value="Tầng 3"> 3</option>
                    <option value="Tầng 4"> 4</option>
                    <option value="Tầng 5"> 5</option>
                  </select>
                </label>
              </form>
            </div>

          </div>
          <div className="button-container">
            {/* <button className="preview-button" onClick={handleSubmit}>Print</button> */}
            <button className="done-button" onClick={handleSubmit}>Đăng Kí</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Print;