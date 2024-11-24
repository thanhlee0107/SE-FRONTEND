const db = require("../../config/db");

const scripts = `
    CREATE TABLE IF NOT EXISTS message (
        id AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES user(id),
        FOREIGN KEY (receiver_id) REFERENCES user(id),
    )
`;

const createMessageTable = () => {
  db.query(scripts, (err) => {
    if (err) {
      console.log("Error creating message table:", err);
    } else {
      console.log("Message table created");
    }
  });
};
