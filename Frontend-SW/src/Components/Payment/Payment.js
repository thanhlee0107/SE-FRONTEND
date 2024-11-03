import "./Payment.css";
import { useState, useEffect } from "react";
import { notification, Button } from "antd";
import html2pdf from 'html2pdf.js';

function Payment() {
  const [bill, setBill] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    paperNumber: 1,
    paperSize: "A4",
    paymentMethod: '',
    date: new Date(),
    price: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const updatedFormData = { ...formData, [name]: value };

    const pricePerPaper =
    updatedFormData.paperSize === "A4" ? 500 :
    updatedFormData.paperSize === "A3" ? 1000 :
    updatedFormData.paperSize === "A2" ? 2000 :
    updatedFormData.paperSize === "A1" ? 5000 : 0;

  const totalAmount = updatedFormData.paperNumber * pricePerPaper;

  // Cập nhật `price` trong `formData` và set lại `formData`
  setFormData({ ...updatedFormData, price: totalAmount });
  };

  const handlePaymentMethodChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
  };

  const handleSubmit = () => {

    if (!formData.email || !formData.paymentMethod) {
      notification.error({
        message: "Vui lòng điền đầy đủ thông tin",
        description: "Error",
      });
      return;
    }

    fetch('https://671d199b09103098807c4344.mockapi.io/api/bill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(() => {
        notification.success({
          message: "Thanh toán thành công",
          description: "Success",
        });
        setFormData({
          email: "",
          paperNumber: 1,
          paperSize: "A4",
          paymentMethod: "",
          date: new Date(),
          price: 0,
        });
      })
      .catch(() => {
        notification.success({
          message: "Thanh toán thất bại",
          description: "Error",
        });
      });

  };

  const generatePDF = (item) => {
    const billContent = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>HÓA ĐƠN THANH TOÁN</h2>
      </div>
      <div style="padding-left: 20px;">
        <p><strong>ID hóa đơn:</strong> ${item.id}</p>
        <p><strong>Email:</strong> ${item.email}</p>
        <p><strong>Ngày thanh toán:</strong> ${new Date(item.date).toLocaleDateString("vi-VN")}</p>
        <p><strong>Loại giấy:</strong> ${item.paperSize}</p>
        <p><strong>Số lượng:</strong> ${item.paperNumber}</p>
        <p><strong>Thanh toán qua phương thức:</strong> ${item.paymentMethod}</p>
        <p><strong>Tổng tiền:</strong> ${item.price} VNĐ</p>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: `HoaDon_${item.id}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(billContent).set(opt).save();
  };

  useEffect(() => {
    fetch('https://671d199b09103098807c4344.mockapi.io/api/bill')
      .then(res => res.json())
      .then(bill => {
        setBill(bill);
      })
      .catch(error => {
        console.error('Error fetching bill:', error)
      });
  }, [formData]);

  return (
    <div id="wrapper">
      <div id="header">
        <a href="/" className="back-button">
          &larr; Trở về trang chủ
        </a>
        <h1>Thanh toán</h1>
      </div>

      <div className="payment-container">
        <div className="row">
          <div className="box payment-info">
            <h3>Thông tin thanh toán</h3>
            <div className="personal-info">
              <label>
                Email
                <input type="text" name="email" value={formData.email} onChange={handleInputChange} checked />
              </label>
              <label>
                Số lượng giấy
                <input type="number" name="paperNumber" step="1" min="1" value={formData.paperNumber} onChange={handleInputChange} />
              </label>
              <label>
                Kích cỡ
                <select name="paperSize" value={formData.paperSize} onChange={handleInputChange}>
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A2">A2</option>
                  <option value="A1">A1</option>
                </select>
              </label>
              <div className="payment-button">
                <button onClick={handleSubmit}>Thanh toán</button>
              </div>
            </div>
          </div>

          <div className="box payment-method">
            <h3>Phương thức thanh toán</h3>
            <div className="card-option">
              <label className="card momo">
                <input type="radio" name="paymentMethod" value="MOMO" onChange={handlePaymentMethodChange} />
                <img src="https://play-lh.googleusercontent.com/dQbjuW6Jrwzavx7UCwvGzA_sleZe3-Km1KISpMLGVf1Be5N6hN6-tdKxE5RDQvOiGRg" alt="Momo img" className="payment-img" />
                <p>Thanh toán qua MOMO</p>
              </label>

              <label className="card ocb">
                <input type="radio" name="paymentMethod" value="OCB" onChange={handlePaymentMethodChange} />
                <img src="https://play-lh.googleusercontent.com/AUZSfk4Zv0Y1QTwbPfjZkJKwWDMW7g9koW-CaxBgkkIKuVJZYZDDL8iizRKTvq-V6-o" alt="OCB img" className="payment-img" />
                <p>Thanh toán qua OCB</p>
              </label>
            </div>
          </div>
        </div>

        <div className="box billing-history">
          <h3>Lịch sử hóa đơn</h3>
          <div id="billing-history-table">
            <table>
              <thead>
                <tr>
                  <th>Số hóa đơn</th>
                  <th>Email</th>
                  <th>Giá tiền</th>
                  <th>Ngày</th>
                  <th>Loại giấy</th>
                  <th>Số lượng giấy</th>
                  <th>Thanh toán qua phương thức</th>
                  <th>Tải hóa đơn</th>
                </tr>
              </thead>
              <tbody>
                {bill.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.email}</td>
                      <td>{item.price} VNĐ</td>
                      <td>{new Date(item.date).toLocaleDateString("vi-VN")}</td>
                      <td>{item.paperSize}</td>
                      <td>{item.paperNumber}</td>
                      <td>{item.paymentMethod}</td>
                      <td>
                        <Button onClick={() => generatePDF(item)}>Tải hóa đơn</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Payment;
