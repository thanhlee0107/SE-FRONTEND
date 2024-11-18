const db = require("../../config/db");
const createUserTable = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mssv CHAR(7) NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sex CHAR(10) NOT NULL,
  pageBalance INT DEFAULT 0,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const insertData = [
  `INSERT INTO users (name, mssv, password, email, sex, pageBalance, role) VALUES ('Hoang Van A', '1234567', '1234567', 'user@hcmut.edu.vn', 'male', '100', 'user') `,
  `INSERT INTO users (name, mssv, password, email, sex, pageBalance, role) VALUES ('Admin', '1234567', '1234567', 'admin@hcmut.edu.vn', 'female', '100', 'admin') `,
];

const restartUserDatabase = async () => {
  insertData.forEach((query) => {
    db.query(query, (err, result) => {
      if (err) {
        console.log("Error inserting users:", err);
      } else {
        console.log("User inserted");
      }
    });
  });
  console.log("account: admin@hcmut.edu.vn, password: 1234567");
  console.log("account: user@hcmut.edu.vn, password: 1234567");
};

// Call the function
// restartUserDatabase();

db.query(createUserTable, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Table created in script");
  }
});

module.exports = db;
