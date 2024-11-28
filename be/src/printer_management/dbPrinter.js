const db = require("../../config/db");

const createPrinterTable = `CREATE TABLE IF NOT EXISTS Printer(
    ID INT AUTO_INCREMENT NOT NULL UNIQUE,
    spsoId INT,
    Model VARCHAR(20),
    Brand VARCHAR(20),
    Status ENUM('online', 'offline', 'maintaining') DEFAULT 'online',
    Campus CHAR(3),
    Building VARCHAR(3),
    Floor INT,
    Description VARCHAR(200),
    printWaiting INT DEFAULT 0,
    PRIMARY KEY (ID)
);
`;

db.query(createPrinterTable, (err) => {
  if (err) {
    console.log("Error creating printers table:", err);
  } else {
    console.log("Printers table created");
  }
});

const createConfigTable = `CREATE TABLE IF NOT EXISTS Config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    settingName VARCHAR(50),
    value VARCHAR(100),
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const createPermittedFileTable = `CREATE TABLE IF NOT EXISTS PermittedFile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filetype VARCHAR(255) UNIQUE
);`;

db.query(createConfigTable, (err) => {
    if (err) {
        console.log("Error creating Config table:", err);
    } else {
        console.log("Config table created successfully");
    }
});

db.query(createPermittedFileTable, (err) => {
    if (err) {
        console.log("Error creating File table:", err);
    } else {    
        console.log("File type table created successfully");
    }
});

const insertPrinterData = [
  `INSERT INTO Printer (spsoId, Model, Brand, Status, Campus, Building, Floor, Description) VALUES 
    (1, 'Printer 1', 'HP', 'online', 'CS1', 'B1', 4, 'Printer for 4th floor'),
    (5, 'Printer 2', 'Canon', 'offline', 'CS2', 'H2', 5, 'Printer for 5th floor'),
    (1, 'Printer 3', 'Epson', 'online', 'CS1', 'B3', 6, 'Printer for 6th floor'),
    (1, 'Printer 3', 'Epson', 'online', 'CS2', 'H3', 2, 'Printer for 2th floor'),
    (1, 'Printer 4', 'Epson', 'maintaining', 'CS1', 'B3', 6, 'Printer for 6th floor')`,
];

const restartPrinterDatabase = async () => {
  db.query(`DROP TABLE IF EXISTS PrintStatus`, (err) => {
    if (err) {
      console.log("Error deleting PrintStatus table:", err);
    } else {
      console.log("PrintStatus table deleted");
    }
  });

  db.query(`DROP TABLE IF EXISTS Printing`, (err) => {
    if (err) {
      console.log("Error deleting Printing table:", err);
    } else {
      console.log("Printing table deleted");
    }
  });

  db.query(`DROP TABLE IF EXISTS PermittedFile`, (err) => {
    if (err) {
      console.log("Error deleting PermittedFile table:", err);
    } else {
      console.log("PermittedFile table deleted");
    }
  });

  db.query(`DROP TABLE IF EXISTS Printer`, (err) => {
    if (err) {
      console.log("Error deleting Printer table:", err);
    } else {
      console.log("Printer table deleted");
    }
  });

  insertPrinterData.forEach((query) => {
    db.query(query, (err) => {
      if (err) {
        console.log("Error inserting printers:", err);
      } else {
        console.log("Printer inserted", query);
      }
    });
  });
};

restartPrinterDatabase();

module.exports = db;
