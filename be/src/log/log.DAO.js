const db = require('../../config/db');

//Lớp Persistence Layer, tuơng tự Model
//Hàm hỗ trợ query database
const queryDatabase = (query, params = []) => {
  console.log(query, params);
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Lấy lịch sử in ấn theo StudentID, nếu StudentID rỗng thì lấy toàn bộ
exports.getUserHistoryDAO = async (studentID, offset, limit) => {
  console.log("getUserHistoryDAO");

  // Tính tổng số bản ghi
  const totalRows = await queryDatabase(
    `
      SELECT COUNT(*) AS total 
      FROM Printing p
      JOIN File f ON p.IDFile = f.ID
      JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
      WHERE (? = '' OR p.StudentID = ?) ;
      `,
    [studentID, studentID]
  );

  const totalRecords = totalRows[0].total; // Tổng số bản ghi
  const totalPages = Math.ceil(totalRecords / limit); // Tính tổng số trang
  console.log("Total records"  + totalRecords);
  try {
    // Lấy dữ liệu phân trang
    const rows = await queryDatabase(
      `
      SELECT 
        p.StudentID,
        p.IDPrinter AS PrinterID,
        pr.Campus,
        pr.Building,
        pr.Floor,
        ps.Status,
        DATE_FORMAT(ps.Date, '%d-%m-%Y') AS Date,
        CASE 
          WHEN ps.Status = 'Completed' THEN DATE_FORMAT(ps.EndDate, '%d-%m-%Y')
          ELSE NULL
        END AS EndDate,
        f.Name AS FileName,
        ps.Amount,
        CASE 
          WHEN ps.Status = 'Error' THEN 1
          ELSE 0
        END AS report
      FROM Printing p
      JOIN File f ON p.IDFile = f.ID
      JOIN Printer pr ON p.IDPrinter = pr.ID
      JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
      WHERE (? = '' OR p.StudentID = ?)
      ORDER BY ps.Date DESC
      LIMIT ? OFFSET ?;
      `,
      [studentID, studentID, limit, offset]
    );

    if (!rows || rows.length === 0) {
      throw new Error("No results found for this query");
    }

    return { rows, totalPages }; // Trả về dữ liệu và tổng số trang
  } catch (error) {
    console.error("Error executing query:", error);
    throw new Error("Error fetching print history by student");
  }
};

  // Lấy lịch sử in ấn của sinh viên theo khoảng thời gian
  exports.getUserHistoryByDateDAO = async (studentID, startDate, endDate, offset, limit) => {
    console.log("getUserHistoryByDateDAO");
    const totalRows = await queryDatabase(
      `SELECT COUNT(*) AS total 
       FROM Printing p
       JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
       WHERE (? = '' OR p.StudentID = ?) 
         AND ps.EndDate BETWEEN ? AND ?`,
      [studentID, studentID, startDate, endDate]
    );
  
    // Tính toán phân trang
    const totalRecords = totalRows[0].total;
    const totalPages = Math.ceil(totalRecords / limit);
  
    try {
      // Lấy dữ liệu phân trang
      const rows = await queryDatabase(
        `
        SELECT 
          p.StudentID,
          p.IDPrinter AS PrinterID,
          pr.Campus,
          pr.Building,
          pr.Floor,
          ps.Status,
          DATE_FORMAT(ps.Date, '%d-%m-%Y') AS Date,
          CASE 
            WHEN ps.Status = 'Completed' THEN DATE_FORMAT(ps.EndDate, '%d-%m-%Y')
            ELSE NULL
          END AS EndDate,
          f.Name,
          ps.Amount,
          CASE 
            WHEN ps.Status = 'Error' THEN 1
            ELSE 0
          END AS report
        FROM Printing p
        JOIN File f ON p.IDFile = f.ID
        JOIN Printer pr ON p.IDPrinter = pr.ID
        JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
        WHERE 
          (? = '' OR p.StudentID = ?)
          AND ps.EndDate BETWEEN ? AND ?
        ORDER BY ps.Date DESC
        LIMIT ? OFFSET ?;
        `,
        [studentID, studentID, startDate, endDate,  limit, offset]
      );
  
      if (!rows || rows.length === 0) {
        throw new Error("No results found for the selected date range");
      }
  
      return { rows, totalPages }; // Trả về dữ liệu và tổng số trang
    } catch (error) {
      console.error("Error executing query:", error);
      throw new Error("Error fetching print history by date and end date");
    }
  };
  
// Lấy lịch sử in ấn theo PrinterID, nếu PrinterID rỗng thì lấy toàn bộ
exports.getPrinterHistoryDAO = async (printerID, offset, limit) => {
  console.log("getPrinterHistoryDAO");
  // Tính tổng số bản ghi
  const totalRows = await queryDatabase(
    `
      SELECT COUNT(*) AS total 
      FROM Printing p
      JOIN File f ON p.IDFile = f.ID
      JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
      WHERE (? = '' OR p.IDPrinter = ?) ;
      `,
    [printerID, printerID]
  );

  const totalRecords = totalRows[0].total; // Tổng số bản ghi
  const totalPages = Math.ceil(totalRecords / limit); // Tính tổng số trang

  try {
    // Lấy dữ liệu phân trang
    const rows = await queryDatabase(
      `
      SELECT 
        p.StudentID,
        p.IDPrinter AS PrinterID,
        pr.Campus,
        pr.Building,
        pr.Floor,
        ps.Status,
        DATE_FORMAT(ps.Date, '%d-%m-%Y') AS Date,
        CASE 
          WHEN ps.Status = 'Completed' THEN DATE_FORMAT(ps.EndDate, '%d-%m-%Y')
          ELSE NULL
        END AS EndDate,
        f.Name AS FileName,
        ps.Amount,
        CASE 
          WHEN ps.Status = 'Error' THEN 1
          ELSE 0
        END AS report
      FROM Printing p
      JOIN File f ON p.IDFile = f.ID
      JOIN Printer pr ON p.IDPrinter = pr.ID
      JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
      WHERE (? = '' OR p.IDPrinter = ?)
      ORDER BY ps.Date DESC
      LIMIT ? OFFSET ?;
      `,
      [printerID, printerID, limit, offset]
    );

    if (!rows || rows.length === 0) {
      throw new Error("No results found for this query");
    }

    return { rows, totalPages }; // Trả về dữ liệu và tổng số trang
  } catch (error) {
    console.error("Error executing query:", error);
    throw new Error("Error fetching print history by printer");
  }
};


// Lấy lịch sử in ấn theo PrinterID và khoảng thời gian
exports.getPrinterHistoryByDateDAO = async (printerID, startDate, endDate, offset, limit) => {
  console.log("getPrinterHistoryByDateDAO");
  // Tính tổng số bản ghi
  const totalRows = await queryDatabase(
    `SELECT COUNT(*) AS total 
     FROM Printing p
     JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
     WHERE (? = '' OR p.IDPrinter = ?) 
       AND ps.EndDate BETWEEN ? AND ?`,
    [printerID, printerID, startDate, endDate]
  );

  const totalRecords = totalRows[0].total; // Tổng số bản ghi
  const totalPages = Math.ceil(totalRecords / limit); // Tính tổng số trang

  try {
    // Lấy dữ liệu phân trang
    const rows = await queryDatabase(
      `
      SELECT 
        p.StudentID,
        p.IDPrinter AS PrinterID,
        pr.Campus,
        pr.Building,
        pr.Floor,
        ps.Status,
        DATE_FORMAT(ps.Date, '%d-%m-%Y') AS Date,
        CASE 
          WHEN ps.Status = 'Completed' THEN DATE_FORMAT(ps.EndDate, '%d-%m-%Y')
          ELSE NULL
        END AS EndDate,
        f.Name AS FileName,
        ps.Amount,
        CASE 
          WHEN ps.Status = 'Error' THEN 1
          ELSE 0
        END AS report
      FROM Printing p
      JOIN File f ON p.IDFile = f.ID
      JOIN Printer pr ON p.IDPrinter = pr.ID
      JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
      WHERE 
        (? = '' OR p.IDPrinter = ?)
        AND ps.EndDate BETWEEN ? AND ?
      ORDER BY ps.Date DESC
      LIMIT ? OFFSET ?;
      `,
      [printerID, printerID, startDate, endDate, limit, offset]
    );

    if (!rows || rows.length === 0) {
      throw new Error("No results found for the selected date range");
    }

    return { rows, totalPages }; // Trả về dữ liệu và tổng số trang
  } catch (error) {
    console.error("Error executing query:", error);
    throw new Error("Error fetching print history by date and printer");
  }
};