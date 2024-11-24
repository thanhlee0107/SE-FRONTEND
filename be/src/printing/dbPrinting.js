const db = require("../../config/db");

/**
 * IDFile và IDPrinter, StudentId sẽ được chỉnh sửa lại khóa ngoại khi có đầy đủ database các thực thể khác
 * Đây chỉ là demo tạm thời
 */
const createPrintingTable = `
  CREATE TABLE IF NOT EXISTS Printing (
    IDFile INT AUTO_INCREMENT NOT NULL,                   
    IDPrinter INT NOT NULL,                               
    StudentID INT NOT NULL,                               
    PRIMARY KEY (IDFile, IDPrinter) 
  );
  `;

const createPrintStatusTable = `
  CREATE TABLE IF NOT EXISTS PrintStatus (
    IDFile INT NOT NULL,
    IDPrinter INT NOT NULL,
    Amount INT NOT NULL,
    Date DATETIME NOT NULL,
    Status VARCHAR(255) NOT NULL,
    EndDate DATETIME,
    PRIMARY KEY (IDFile, IDPrinter, Amount, Date, Status),
    FOREIGN KEY (IDFile, IDPrinter) REFERENCES Printing(IDFile, IDPrinter)
  );
  `;

db.query(createPrintingTable, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Table printing created in script");
  }
});

db.query(createPrintStatusTable, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Table printingstatus created in script");
  }
});

// Hàm quấn `db.query` để trả về Promise
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(new Error(`Error executing query: ${err.message}`)); // Thêm thông báo lỗi rõ ràng
      } else {
        resolve(results);
      }
    });
  });
};

// Hàm kiểm tra và thêm dữ liệu vào bảng Printing
exports.checkAndInsertPrinting = async (IDFile, IDPrinter, StudentID) => {
  try {
    // Thêm dữ liệu vào bảng Printing nếu không tồn tại
    const insertQuery = `
        INSERT IGNORE INTO Printing (IDFile, IDPrinter, StudentID) 
        VALUES (?, ?, ?)
      `;
    const result = await query(insertQuery, [IDFile, IDPrinter, StudentID]);

    if (result.affectedRows > 0) {
      console.log("Đã thêm mới vào bảng Printing.");
    } else {
      console.log("Dữ liệu đã tồn tại trong bảng Printing.");
    }
  } catch (error) {
    console.error(
      "Lỗi khi kiểm tra hoặc thêm dữ liệu vào bảng Printing:",
      error.stack
    ); // In ra stack trace để debug dễ dàng hơn
    throw error;
  }
};

// Hàm thêm công việc in vào bảng PrintStatus
exports.insertPrintStatus = async (
  IDFile,
  IDPrinter,
  Amount,
  printDate,
  Status
) => {
  try {
    // Chuyển đổi đối tượng Date thành chuỗi ngày giờ hợp lệ cho MySQL
    //const dateStr = new Date(printDate).toISOString().slice(0, 19).replace('T', ' '); // Chuyển đổi về định dạng 'YYYY-MM-DD HH:MM:SS'

    const insertQuery = `
        INSERT INTO PrintStatus (IDFile, IDPrinter, Amount, Date, Status) 
        VALUES (?, ?, ?, ?, ?)
      `;
    await query(insertQuery, [IDFile, IDPrinter, Amount, printDate, Status]);
    console.log("Đã thêm công việc in vào bảng PrintStatus.");
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu vào bảng PrintStatus:", error.stack); // Thêm stack trace để dễ dàng gỡ lỗi
    throw error;
  }
};

const formatDateForSQL = (date) => {
  // Lấy các thành phần thời gian
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, nên +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0"); // Theo múi giờ hệ thống
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Lấy giây và phần thập phân của giây
  let seconds = date.getSeconds();
  let milliseconds = date.getMilliseconds(); // Lấy phần millisecond (0-999)

  // Làm tròn giây nếu có phần millisecond
  if (milliseconds >= 500) {
    seconds += 1; // Làm tròn lên
  }
  // Giới hạn giây không vượt quá 59
  if (seconds >= 60) {
    seconds = 0;
    // Nếu giây là 60 thì tăng phút
    let newMinutes = parseInt(minutes) + 1;
    if (newMinutes === 60) {
      minutes = "00";
      let newHours = parseInt(hours) + 1;
      if (newHours === 24) {
        hours = "00";
        // Kiểm tra ngày cuối tháng (giới hạn)
        let newDay = parseInt(day) + 1;
        // Đơn giản là không kiểm tra ngày cuối tháng trong ví dụ này
        day = String(newDay).padStart(2, "0");
      } else {
        hours = String(newHours).padStart(2, "0");
      }
    } else {
      minutes = String(newMinutes).padStart(2, "0");
    }
  }

  // Đảm bảo giây có 2 chữ số
  seconds = String(seconds).padStart(2, "0");

  // Kết hợp thành chuỗi 'YYYY-MM-DD HH:MM:SS'
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

exports.updatePrintStatus = async (
  IDFile,
  IDPrinter,
  Amount,
  printDate,
  Status
) => {
  try {
    const dateStr = formatDateForSQL(printDate);
    if (Status == "Completed") {
      const endDate = new Date();
      const updateQuery = `
        UPDATE PrintStatus 
        SET Status = ?, EndDate = ?
        WHERE IDFile = ? AND IDPrinter = ? AND Amount = ? AND Date = ?
      `;
      await query(updateQuery, [
        Status,
        endDate,
        IDFile,
        IDPrinter,
        Amount,
        dateStr,
      ]);
    } else {
      const updateQuery = `
      UPDATE PrintStatus 
      SET Status = ? 
      WHERE IDFile = ? AND IDPrinter = ? AND Amount = ? AND Date = ?
      `;
      const result = await query(updateQuery, [
        Status,
        IDFile,
        IDPrinter,
        Amount,
        dateStr,
      ]);
    }
    console.log(`Cập nhật trạng thái công việc in: ${IDFile} - ${Status}`);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái công việc in:", error.stack); // Thêm stack trace
    throw error;
  }
};
