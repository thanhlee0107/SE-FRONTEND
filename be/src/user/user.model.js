const db = require("../../config/db");

// Helper function to query the database and return a promise
const queryDatabase = (query, params = []) => {
  console.log(query, params);
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
};

// Create the table if it doesn't exist (Should ideally be done separately during migrations)
const createUserTable = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mssv CHAR(7) NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  pageBalance INT DEFAULT 0,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const initializeDatabase = async () => {
  try {
    await queryDatabase(createUserTable);
    console.log("Table created or already exists");
  } catch (err) {
    console.log("Error creating table:", err);
  }
};

// Function to create a user
exports.createUser = async (newUser) => {
  try {
    await initializeDatabase(); // Ensure the table exists before inserting a user
    const result = await queryDatabase(
      `INSERT INTO users (name, mssv, password, email, pageBalance) VALUES (?, ?, ?, ?, ?)`,
      [
        newUser.name,
        newUser.mssv,
        newUser.password,
        newUser.email,
        newUser.pageBalance,
      ]
    );
    return { message: "User created", result };
  } catch (err) {
    throw new Error(err);
  }
};

// Get all users
exports.getAllUser = async () => {
  try {
    const result = await queryDatabase(`SELECT * FROM users`);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// Get user by ID
exports.getUserById = async (id) => {
  try {
    const result = await queryDatabase(`SELECT * FROM users WHERE id = ?`, [
      id,
    ]);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// Get user by MSSV
exports.getUserByMssv = async (mssv) => {
  try {
    const result = await queryDatabase(`SELECT * FROM users WHERE mssv = ?`, [
      mssv,
    ]);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// Get user by email
exports.getUserByEmail = async (email) => {
  try {
    const result = await queryDatabase(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// Update user by ID
exports.updateUserById = async (id, user) => {
  const fields = [];
  const values = [];

  if (user.name) {
    fields.push("name = ?");
    values.push(user.name);
  }
  if (user.mssv) {
    fields.push("mssv = ?");
    values.push(user.mssv);
  }
  if (user.password) {
    fields.push("password = ?");
    values.push(user.password);
  }
  if (user.email) {
    fields.push("email = ?");
    values.push(user.email);
  }
  if (user.pageBalance) {
    fields.push("pageBalance = ?");
    values.push(user.pageBalance);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  try {
    db.query(query, values, (err) => {
      if (err) {
        throw new Error(err);
      }
      return { message: "User updated" };
    });
    return { message: "User updated" };
  } catch (err) {
    throw new Error(err);
  }
};

// Delete user by ID
exports.deleteUserById = async (id) => {
  try {
    const result = await queryDatabase(`DELETE FROM users WHERE id = ?`, [id]);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};
