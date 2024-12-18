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
        console.log(result);
        if (result.affectedRows !== undefined) {
          resolve({
            affectedRows: result.affectedRows,
            changedRows: result.changedRows,
            
          });
        } else {
          resolve(result[0]); // For other queries, return the first row
        }
      }
    });
  });
};


const insertData = [
  `INSERT INTO user (name, mssv, password, email, sex, pageBalance, role) VALUES ('Hoang Van A', '1234567', '$2b$10$mEeCfXeGDZoac8lQY7DhBucVdK.nQtm5L/TLROOlzOkApgt9bYNg.', 'user@hcmut.edu.vn', 'male', '100', 'user') `,
  `INSERT INTO user (name, mssv, password, email, sex, pageBalance, role) VALUES ('Admin', '2234567', '$2b$10$mEeCfXeGDZoac8lQY7DhBucVdK.nQtm5L/TLROOlzOkApgt9bYNg.', 'admin@hcmut.edu.vn', 'female', '100', 'admin') `,
];

exports.restartUserDatabase = async () => {
  db.query(`DELETE FROM user`, (err, result) => {
    if (err) {
      console.log("Error deleting user:", err);
    } else {
      console.log("All user deleted");

      // Then, reset the AUTO_INCREMENT
      db.query(`ALTER TABLE user AUTO_INCREMENT = 1`, (err, result) => {
        if (err) {
          console.log("Error resetting auto-increment:", err);
        } else {
          console.log("Auto-increment reset to 1");
        }
      });
    }
  });

  insertData.forEach((query) => {
    db.query(query, (err, result) => {
      if (err) {
        console.log("Error inserting user:", err);
      } else {
        console.log("User inserted");
      }
    });
  });
  return {
    message: [
      "account: admin@hcmut.edu.vn, password: 1234567",
      "account: user@hcmut.edu.vn, password: 1234567",
    ],
  };
};

// Function to create a user
exports.createUser = async (newUser) => {
  try {
    const result = await queryDatabase(
      `INSERT INTO user (name, mssv, password, email, sex, pageBalance, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newUser.name,
        newUser.mssv,
        newUser.password,
        newUser.email,
        newUser.sex,
        newUser.pageBalance,
        newUser.role,
      ]
    );
    return { message: "User created", result };
  } catch (err) {
    throw new Error(err);
  }
};

// Get all user
exports.getAllUser = async () => {
  try {
    const result = await queryDatabase(`SELECT * FROM user`);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// Get user by ID
exports.getUserById = async (id) => {
  try {
    const result = await queryDatabase(`SELECT * FROM user WHERE id = ?`, [id]);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// Get user by MSSV
exports.getUserByMssv = async (mssv) => {
  try {
    const result = await queryDatabase(`SELECT * FROM user WHERE mssv = ?`, [
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
    const result = await queryDatabase(`SELECT * FROM user WHERE email = ?`, [
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
  if (user.sex) {
    fields.push("sex = ?");
    values.push(user.sex);
  }
  if (user.pageBalance) {
    fields.push("pageBalance = ?");
    values.push(user.pageBalance);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  const query = `UPDATE user SET ${fields.join(", ")} WHERE id = ?`;
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
    const result = await queryDatabase(`DELETE FROM user WHERE id = ?`, [id]);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

//Get Page balance by ID
exports.getPageBalanceByMSSV = async (mssv) => {
  try{
    const result = await queryDatabase(`SELECT pageBalance FROM user WHERE mssv = ?`, [mssv]);
    
    return result;
  } catch(err){
    throw new Error(err);
  }
}

exports.updatePageBalanceByMSSV = async (mssv, pageBalance) => {
  try{
    const result = await queryDatabase(`UPDATE user SET pageBalance = ? WHERE mssv = ?`, [pageBalance, mssv]);
    
    return result;
  } catch(err){
    throw new Error(err);
  }
}

exports.updatePageBalanceById = async (id, pageBalance) => {
  try{
    const result = await queryDatabase(`UPDATE user SET pageBalance = ? WHERE id = ?`, [pageBalance, id]);
    
    return result;
  } catch(err){
    throw new Error(err);
  }
}