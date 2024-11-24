const db = require("../../config/db");


const createFileTable = `
CREATE TABLE IF NOT EXISTS File (
    ID INT AUTO_INCREMENT NOT NULL,
    Name VARCHAR(20) NOT NULL,
    Type VARCHAR(8) NOT NULL,
    Size CHAR(2) NOT NULL,
    Color BOOLEAN NOT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT fk_file_size FOREIGN KEY (Size) REFERENCES Paper(Size) 
);
`;

db.query(createFileTable, (err) => {
    if (err) {
        console.error("Error creating File table:", err.message);
    } else {
        console.log("File table created or already exists.");
    }
});



// Kiểm tra và chèn tuple mới vào bảng File nếu chưa tồn tại
exports.checkAndInsertFile = async (Name, Type, Size, Color) => {
    try {
      // Kiểm tra tuple đã tồn tại chưa
      const [rows] = await db.promise().query(
        `SELECT ID FROM File WHERE Name = ? AND Type = ? AND Size = ? AND Color = ?`,
        [Name, Type, Size, Color]
      );
  
      if (rows.length > 0) {
        console.log("File đã tồn tại:", rows[0].ID);
        return rows[0].ID; // Trả về ID của file đã tồn tại
      }
  
      // Nếu chưa tồn tại, chèn tuple mới
      const [result] = await db.promise().query(
        `INSERT INTO File (Name, Type, Size, Color) VALUES (?, ?, ?, ?)`,
        [Name, Type, Size, Color]
      );
  
      console.log("Đã chèn file mới:", result.insertId);
      return result.insertId; // Trả về ID của file mới
    } catch (err) {
      console.error("Lỗi khi kiểm tra hoặc chèn file:", err.message);
      throw err;
    }
  };
  
