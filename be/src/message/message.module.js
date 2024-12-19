const db = require("../../config/db");

exports.insertMessage = (senderId, message) => {
  const adminQuery = `
  SELECT id FROM user WHERE role = 'admin';
`;

  db.query(adminQuery, (err, results) => {
    if (err) {
      console.log("Error fetching admins:", err);
      throw err;
      return;
    }

    const insertMessageQuery = `
  INSERT INTO message (sender_id, receiver_id, message) VALUES (?, ?, ?)
`;

    results.forEach((admin) => {
      db.query(insertMessageQuery, [senderId, admin.id, message], (err) => {
        if (err) {
          console.log(`Error inserting message for admin ID ${admin.id}:`, err);
          throw err;
        } else {
          console.log(`Message sent to admin ID ${admin.id}`);
        }
      });
    });
  });
};

exports.getMessages = (userId, receiver_id) => {
  const query = `
            SELECT * FROM message WHERE sender_id = ? AND receiver_id = ?
        `;
  return new Promise((resolve, reject) => {
    db.query(query, [userId, receiver_id], (err, results) => {
      if (err) {
        console.log("Error getting messages:", err);
        reject(err);
      } else {
        // console.log(userId, receiver_id);
        resolve(results);
      }
    });
  });
};

exports.getReceiver = (userId) => {
  const query = `
                SELECT * FROM message WHERE sender_id = ?
            `;
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.log("Error getting messages:", err);
        reject(err);
      } else {
        let listReceiver = [];
        results.forEach((element) => {
          if (!listReceiver.includes(element.receiver_id))
            listReceiver.push(element.receiver_id);
        });
        resolve(listReceiver);
      }
    });
  });
};

exports.deleteMessage = (messageId) => {
  const query = ` DELETE FROM message where id = ?`;
  db.query(query, [messageId], (err) => {
    if (err) {
      console.log("Error deleting message:", err);
    } else {
      console.log("Message deleted");
      return { message: "Message deleted" };
    }
  });
};
