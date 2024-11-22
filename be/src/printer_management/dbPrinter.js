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
    PRIMARY KEY (ID)
);
`;

const insertPrinterData = [
    `INSERT INTO Printer (spsoId, Model, Brand, Status, Campus, Building, Floor, Description) VALUES 
    (1, 'Printer 1', 'HP', 'online', 'CS1', 'B1', 4, 'Printer for 4th floor'),
    (5, 'Printer 2', 'Canon', 'offline', 'CS2', 'H2', 5, 'Printer for 5th floor'),
    (1, 'Printer 3', 'Epson', 'online', 'CS1', 'B3', 6, 'Printer for 6th floor'),
    (1, 'Printer 3', 'Epson', 'online', 'CS2', 'H3', 2, 'Printer for 2th floor'),
    (1, 'Printer 4', 'Epson', 'maintaining', 'CS1', 'B3', 6, 'Printer for 6th floor')`
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
    })

};


restartPrinterDatabase();

module.exports = db;
