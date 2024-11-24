const dbUser = require("./src/user/dbScripts");
const dbMessage = require("./src/message/messageScripts");
const dbPrinter = require("./src/printer_management/dbPrinter");
const dbPrinting = require("./src/printing/dbPrinting");
const db = require("./config/db");

db.query(`
    CREATE TABLE IF NOT EXISTS Paper(
    Size CHAR(2) NOT NULL DEFAULT 'A4',
    Price INT,
    PRIMARY KEY (Size)
    )
`);

db.query(`
    INSERT INTO Paper(Size, Price) VALUES ('A4', 250)
`);

db.query(`
    INSERT INTO Paper(Size, Price) VALUES ('A3', 500)
`);
const dbFile = require("./src/file/dbFile");
