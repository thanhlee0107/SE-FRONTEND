const db = require("../../config/db");

exports.insertMessage = (senderId, receiverId, message) => {
  const query = `
        INSERT INTO message (sender_id, receiver_id, message) VALUES (?, ?, ?)
    `;
  db.query(query, [senderId, receiverId, message], (err) => {
    if (err) {
      console.log("Error inserting message:", err);
    } else {
      console.log("Message inserted");
      return { message: "Message sent" };
    }
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
