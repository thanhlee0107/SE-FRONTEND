CREATE DATABASE dev_db;
USE dev_db;
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    mssv CHAR(7) UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    sex CHAR(10) NOT NULL,
    pageBalance INT DEFAULT 0,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Paper(
    Size CHAR(2) NOT NULL DEFAULT 'A4',
    Price INT,
    PRIMARY KEY (Size)
);
CREATE TABLE Provide(
    StudentID CHAR(7) NOT NULL,
    Date DATE,
    Amount INT NOT NULL CHECK(Amount >= 0),
    Size CHAR(2),
    spsoId INT,
    PRIMARY KEY (StudentID),
    CONSTRAINT fk_prov_size FOREIGN KEY (Size) REFERENCES Paper(Size),
    CONSTRAINT fk_prov_spso FOREIGN KEY (spsoId) REFERENCES user(id),
    CONSTRAINT fk_prov_stu FOREIGN KEY (StudentID) REFERENCES user(mssv)
);
CREATE TABLE Buy(
    Size CHAR(2),
    StudentID CHAR(7) NOT NULL,
    PRIMARY KEY (StudentID),
    CONSTRAINT fk_buy_size FOREIGN KEY (Size) REFERENCES Paper(Size),
    CONSTRAINT fk_buy_stu FOREIGN KEY (StudentID) REFERENCES user(mssv)
);
CREATE TABLE BuyInfo(
    StudentID CHAR(7) NOT NULL,
    Amount INT NOT NULL CHECK(Amount > 0),
    Date DATE,
    PRIMARY KEY (StudentID),
    CONSTRAINT fk_buyinfo_stu FOREIGN KEY (StudentID) REFERENCES user(mssv)
);
CREATE TABLE File(
    ID INT,
    Name VARCHAR(20),
    Type VARCHAR(8),
    Amount INT,
    Size CHAR(2),
    PRIMARY KEY (ID),
    CONSTRAINT fk_file_size FOREIGN KEY (Size) REFERENCES Paper(Size)
);
CREATE TABLE Printer(
    ID INT,
    spsoId INT,
    Model VARCHAR(20),
    Brand VARCHAR(20),
    Status CHAR(1),
    Campus CHAR(3),
    Building VARCHAR(3),
    Floor INT,
    Description VARCHAR(200),
    PRIMARY KEY (ID),
    CONSTRAINT fk_printer_username FOREIGN KEY (spsoId) REFERENCES user(id)
);
CREATE TABLE Printing(
    IDFile INT NOT NULL,
    IDPrinter INT NOT NULL,
    StudentID CHAR(7) NOT NULL,
    PRIMARY KEY(IDFile, IDPrinter),
    CONSTRAINT fk_printing_idfile FOREIGN KEY (IDFile) REFERENCES File(ID),
    CONSTRAINT fk_printing_idprinter FOREIGN KEY (IDPrinter) REFERENCES Printer(ID),
    CONSTRAINT fk_printing_studentid FOREIGN KEY (StudentID) REFERENCES user(mssv)
);
CREATE TABLE PrintStatus(
    Status VARCHAR(10),
    Date DATE,
    Amount INT,
    IDFile INT NOT NULL,
    IDPrinter INT NOT NULL,
    PRIMARY KEY (Status, Date, Amount, IDFile, IDPrinter),
    CONSTRAINT fk_printstatus_idfile FOREIGN KEY (IDFile) REFERENCES Printing(IDPrinter),
    CONSTRAINT fk_printstatus_idprinter FOREIGN KEY (IDPrinter) REFERENCES Printing(IDPrinter)
);
CREATE TABLE PermittedFile(
    IDPrinter INT NOT NULL,
    PermittedFile VARCHAR(8),
    PRIMARY KEY (IDPrinter, PermittedFile),
    CONSTRAINT fk_perfile_idprinter FOREIGN KEY (IDPrinter) REFERENCES Printer(ID)
);