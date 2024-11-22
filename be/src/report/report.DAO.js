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

//
exports.getReportByYear = async (year, offset, limit) => {
  try {
    // Đếm tổng số bản ghi
    const totalRows = await queryDatabase(
      `
      SELECT COUNT(DISTINCT p.IDPrinter) AS total 
      FROM Printing p
      JOIN File f ON p.IDFile = f.ID
      JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
      WHERE YEAR(ps.EndDate) = ?;
      `,
      [year]
    );

    const totalRecords = totalRows[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Lấy dữ liệu báo cáo với giới hạn offset và limit
    const rows = await queryDatabase(
      `
      SELECT 
        p.IDPrinter AS PrinterID,
        pr.Campus,
        pr.Building,
        pr.Floor,
        SUM(
          CASE 
            WHEN f.Size = 'A3' THEN ps.Amount * 2 -- A3 quy đổi thành 2 A4
            ELSE ps.Amount -- A4 không đổi
          END
        ) AS TotalA4Pages,
        SUM(
          CASE 
            WHEN f.Size = 'A3' THEN ps.Amount * 2 * pa.Price -- Doanh thu A3
            ELSE ps.Amount * pa.Price -- Doanh thu A4
          END
        ) AS Revenue,
        COUNT(*) AS TotalJobs -- Tổng số lần in
      FROM Printing p
      JOIN File f ON p.IDFile = f.ID
      JOIN Paper pa ON f.Size = pa.Size
      JOIN Printer pr ON p.IDPrinter = pr.ID
      JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
      WHERE 
        YEAR(ps.EndDate) = ?
        AND ps.Status = 'Completed'
      GROUP BY p.IDPrinter, pr.Campus, pr.Building, pr.Floor
      ORDER BY p.IDPrinter ASC
      LIMIT ? OFFSET ?;
      `,
      [year, limit, offset]
    );

    if (!rows || rows.length === 0) {
      throw new Error("No results found for the selected year");
    }

    return { rows, totalPages};
  } catch (error) {
    console.error("Error executing query:", error);
    throw new Error("Error fetching print report by year");
  }
};

  
  // Lấy bao cao in ấn theo thang
  exports.getReportByMonth = async (month, year, offset, limit) => {
    try {
      const totalRows = await queryDatabase(
        `
        SELECT COUNT(DISTINCT p.IDPrinter) AS total 
        FROM Printing p
        JOIN File f ON p.IDFile = f.ID
        JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
        WHERE MONTH(ps.EndDate) = ? AND YEAR(ps.EndDate) = ?;
        `,
        [month, year]
      );
  
      const totalRecords = totalRows[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
  
      const rows = await queryDatabase(
        `
        SELECT 
          p.IDPrinter AS PrinterID,
          pr.Campus,
          pr.Building,
          pr.Floor,
          SUM(
            CASE 
              WHEN f.Size = 'A3' THEN ps.Amount * 2 
              ELSE ps.Amount
            END
          ) AS TotalA4Pages,
          SUM(
            CASE 
              WHEN f.Size = 'A3' THEN ps.Amount * 2 * pa.Price 
              ELSE ps.Amount * pa.Price
            END
          ) AS Revenue,
          COUNT(*) AS TotalJobs
        FROM Printing p
        JOIN File f ON p.IDFile = f.ID
        JOIN Paper pa ON f.Size = pa.Size
        JOIN Printer pr ON p.IDPrinter = pr.ID
        JOIN PrintStatus ps ON p.IDPrinter = ps.IDPrinter AND p.IDFile = ps.IDFile
        WHERE 
          MONTH(ps.EndDate) = ? 
          AND YEAR(ps.EndDate) = ?
          AND ps.Status = 'Completed'
        GROUP BY p.IDPrinter, pr.Campus, pr.Building, pr.Floor
        ORDER BY p.IDPrinter ASC
        LIMIT ? OFFSET ?;
        `,
        [month, year, limit, offset]
      );
  
      if (!rows || rows.length === 0) {
        throw new Error("No results found for the selected month and year");
      }
  
      return { rows, totalPages};
    } catch (error) {
      console.error("Error executing query:", error);
      throw new Error("Error fetching print report by month");
    }
  };
  