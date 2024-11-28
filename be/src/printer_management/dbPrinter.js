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
const campusBuilding = {
  CS1: ["B1", "B3", "B2", "B4", "B6", "B9", "A4", "A1", "C5", "C6"],
  CS2: ["H1", "H2", "H3", "H6"],
};

const brands = [
  "HP",
  "Canon",
  "Epson",
  "Brother",
  "Samsung",
  "Lexmark",
  "Ricoh",
];
const statuses = ["online", "offline", "maintaining"];
const descriptions = [
  "Printer for 1st floor",
  "Printer for 2nd floor",
  "Printer for 3rd floor",
  "Printer for 4th floor",
  "Printer for 5th floor",
  "Printer for 6th floor",
  "Printer for 7th floor",
  "Printer for 8th floor",
];
const floors = [1, 2, 3, 4, 5, 6, 7, 8];
const getStatus = () => {
  const random = Math.random() * 100; // Generate a random number between 0 and 100

  if (random < 70) {
    return "online"; 
  } else if (random < 90) {
    return "offline"; 
  } else {
    return "maintaining";
  }
};
const generatePrinterData = () => {
  const insertStatements = [];

  let printerId = 1; // Start from 21 as 20 are already generated.
  for (let i = 0; i < 100; i++) {
    const campus = Object.keys(campusBuilding)[Math.floor(Math.random() * 2)];
    const building =
      campusBuilding[campus][
        Math.floor(Math.random() * campusBuilding[campus].length)
      ];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const status =  getStatus();
    const floor = floors[Math.floor(Math.random() * floors.length)];
    const description = descriptions[floor - 1];
    const printWaiting = Math.floor(Math.random() * 500) + 1;

    insertStatements.push(
      `(1, 'Printer ${printerId}', '${brand}', '${status}', '${campus}', '${building}', ${floor}, '${description}', ${printWaiting})`
    );
    printerId++;
  }

  return `INSERT INTO Printer (spsoId, Model, Brand, Status, Campus, Building, Floor, Description, printWaiting) VALUES \n${insertStatements.join(
    ",\n"
  )};`;
};

const insertPrinterData = [generatePrinterData()];

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

  db.query(createPrinterTable, (err) => {
    if (err) {
      console.log("Error creating printers table:", err);
    } else {
      console.log("Printers table created");
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
