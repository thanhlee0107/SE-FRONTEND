CREATE DATABASE dev_db;
USE dev_db;
CREATE TABLE Student(
	StudentID	CHAR(7)	NOT NULL,
    Name		VARCHAR(20)	NOT NULL,
    Address		VARCHAR(30),
    Sex			CHAR(1),
    Email		VARCHAR(20),
    Tel			CHAR(10),
    Username	VARCHAR(30)	UNIQUE,
    Password	VARCHAR(10),
    Totalpage	SMALLINT,
    PRIMARY KEY (StudentID)
);

CREATE TABLE SPSO(
	Username	VARCHAR(30)	NOT NULL,
    Password	VARCHAR(10),
    Location	VARCHAR(30),
    PRIMARY KEY	(Username)
);

CREATE TABLE Paper(
	Size	CHAR(2)		NOT NULL DEFAULT 'A4',
    Price	INT,
    PRIMARY KEY (Size)
);

CREATE TABLE Provide(
	StudentID	CHAR(7)	NOT NULL,
    Date		DATE,
    Amount		INT			NOT NULL CHECK(Amount>=0),
    Size		CHAR(2),
    Username	VARCHAR(30),
    PRIMARY KEY (StudentID),
    CONSTRAINT fk_prov_size FOREIGN KEY (Size)
					REFERENCES	Paper(Size),
	CONSTRAINT fk_prov_username FOREIGN KEY (Username)
					REFERENCES	SPSO(Username),
	CONSTRAINT fk_prov_stu FOREIGN KEY (StudentID)
					REFERENCES	Student(StudentID)
);

CREATE TABLE Buy(
	Size		CHAR(2),
    StudentID	CHAR(7)	NOT NULL,
    PRIMARY KEY (StudentID),
    CONSTRAINT fk_buy_size FOREIGN KEY (Size)
					REFERENCES	Paper(Size),
	CONSTRAINT fk_buy_stu FOREIGN KEY (StudentID)
					REFERENCES	Student(StudentID)	
);
CREATE TABLE BuyInfo(
	StudentID	CHAR(7)	NOT NULL,
    Amount		INT			NOT NULL CHECK(Amount>0),
    Date		DATE,
    PRIMARY KEY (StudentID),
    CONSTRAINT fk_buyinfo_stu FOREIGN KEY (StudentID)
					REFERENCES	Student(StudentID)
);
CREATE TABLE File(
	ID		INT,	
    Name	VARCHAR(20),
    Type	VARCHAR(8),
    Amount	INT,
    Size	CHAR(2),
    PRIMARY KEY (ID),
    CONSTRAINT fk_file_size FOREIGN KEY (Size)
					REFERENCES	Paper(Size)
);

CREATE TABLE Printer(
	ID				INT,
    Username		VARCHAR(30),
    Model			VARCHAR(20),
    Brand			VARCHAR(20),
    Status			CHAR(1),
    Campus			CHAR(3),
    Building		VARCHAR(3),
    Floor			INT,
    Description		VARCHAR(200),
    PRIMARY KEY (ID),
    CONSTRAINT fk_printer_username FOREIGN KEY (Username)
					REFERENCES	SPSO(Username)
);

CREATE TABLE Printing(
	IDFile		INT			NOT NULL,
    IDPrinter	INT			NOT NULL,
    StudentID	CHAR(7)	NOT NULL,
    PRIMARY KEY(IDFile, IDPrinter),
    CONSTRAINT fk_printing_idfile FOREIGN KEY (IDFile)
					REFERENCES	File(ID),
	CONSTRAINT fk_printing_idprinter FOREIGN KEY (IDPrinter)
					REFERENCES	Printer(ID),
	CONSTRAINT fk_printing_studentid FOREIGN KEY (StudentID)
					REFERENCES	Student(StudentID)
);
CREATE TABLE PrintStatus(
	Status			VARCHAR(10),
    Date			DATE,
    EndDate 		DATE,
    Amount			INT,
    IDFile			INT			NOT NULL,
    IDPrinter		INT			NOT NULL,
    PRIMARY KEY (Status,Date,Amount,IDFile,IDPrinter),
    CONSTRAINT fk_printstatus_idfile FOREIGN KEY (IDFile)
					REFERENCES	Printing(IDPrinter),
	CONSTRAINT fk_printstatus_idprinter FOREIGN KEY (IDPrinter)
					REFERENCES	Printing(IDPrinter)
);
CREATE TABLE PermittedFile(
	IDPrinter		INT			NOT NULL,
    PermittedFile	VARCHAR(8),
    PRIMARY KEY (IDPrinter,PermittedFile),
    CONSTRAINT fk_perfile_idprinter FOREIGN KEY (IDPrinter)
					REFERENCES	Printer(ID)
);