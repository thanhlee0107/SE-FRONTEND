const db = require("../../config/db");
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mssv char(7) NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  pageBalance INT DEFAULT 0,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
const resetAllData = () => {
  // First, delete all rows in the users table
  db.query(`DELETE FROM users`, (err, result) => {
    if (err) {
      console.log("Error deleting users:", err);
    } else {
      console.log("All users deleted");

      // Then, reset the AUTO_INCREMENT
      db.query(`ALTER TABLE users AUTO_INCREMENT = 1`, (err, result) => {
        if (err) {
          console.log("Error resetting auto-increment:", err);
        } else {
          console.log("Auto-increment reset to 1");
        }
      });
    }
  });
};

// Call the function
//resetAllData();

db.query(createUserTable, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Table created in script");
  }
});

module.exports = db;