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

//Lấy lịch sử in ấn theo studentID
exports.getPrintHistoryByStudent = async (studentID, offset, limit) => {
  //Tổng số bản ghi
  const totalRows = await queryDatabase(
    `SELECT COUNT(*) AS total FROM Printing WHERE StudentID = ?`,
    [studentID]
  );
  //Paging
  const totalRecords = totalRows[0].total;
  const totalPages = Math.ceil(totalRecords / limit);

  try {
    const rows = await queryDatabase(`
      SELECT 
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
      WHERE p.StudentID = ?
      LIMIT ?, ?;
    `,[studentID, offset, limit]);
    if (!rows || rows.length === 0) {
      throw new Error("No results found for this query");
    }
    return { rows, totalPages }; // Trả về toàn bộ kết quả
  } catch (error) {
    console.error("Error executing query:", error);
    throw new Error("Error fetching print history by student");
  }
};
  
  // Lấy lịch sử in ấn theo khoảng thời gian
  exports.getPrintHistoryByDate = async (studentID, startDate, endDate, offset, limit) => {
    const totalRows = await queryDatabase(
      `SELECT COUNT(*) AS total 
       FROM Printing p
       JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
       WHERE p.StudentID = ? 
         AND (
           ps.EndDate BETWEEN ? AND ?
         )`,
      [studentID, startDate, endDate]
    );
    //Paging
    const totalRecords = totalRows[0].total;
    const totalPages = Math.ceil(totalRecords / limit);
  
    try {
      // Lấy dữ liệu phân trang
      const rows = await queryDatabase(
        `
        SELECT 
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
          p.StudentID = ?
          AND (
            ps.EndDate BETWEEN ? AND ?
          )
        ORDER BY ps.Date ASC
        LIMIT ?, ?;
        `,
        [studentID, startDate, endDate, offset, limit]
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