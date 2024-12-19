const db = require("../../config/db");
const createUserTable = `CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mssv CHAR(7) UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    sex CHAR(10) NOT NULL,
    pageBalance INT DEFAULT 0,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const insertData = [
  `INSERT INTO user (name, mssv, password, email, sex, pageBalance, role) VALUES ('Hoang Van A', '1234567', '$2b$10$mEeCfXeGDZoac8lQY7DhBucVdK.nQtm5L/TLROOlzOkApgt9bYNg.', 'user@hcmut.edu.vn', 'male', '100', 'user') `,
  `INSERT INTO user (name, mssv, password, email, sex, pageBalance, role) VALUES ('Admin', '2234567', '$2b$10$mEeCfXeGDZoac8lQY7DhBucVdK.nQtm5L/TLROOlzOkApgt9bYNg.', 'admin@hcmut.edu.vn', 'female', '100', 'admin') `,
];

const restartUserDatabase = async () => {
  insertData.forEach((query) => {
    db.query(query, (err, result) => {
      if (err) {
        console.log("Error inserting user:", err);
      } else {
        console.log("User inserted");
      }
    });
  });
  console.log("account: admin@hcmut.edu.vn, password: 1234567");
  console.log("account: user@hcmut.edu.vn, password: 1234567");
};

// Call the function
restartUserDatabase();

db.query(createUserTable, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Table created in script");
  }
});

module.exports = db;
