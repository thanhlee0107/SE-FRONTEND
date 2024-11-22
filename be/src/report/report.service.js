const reportDAO = require('./report.DAO');

//Phần này là lớp Business Layer, tương tự như Controller

// Lấy lịch sử in ấn của các máy in theo ID theo year
exports.getReportByYear = async (req, res) => {
  const year = req.query.year;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  if (!year) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const { rows, totalPages} = await reportDAO.getReportByYear(year, offset, limit);
    res.status(200).json({
      message: "Print history retrieved successfully",
      history: rows,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching print history by year:", error);
    res.status(500).json({ message: "An error occurred while retrieving print history" });
  }
};


// Lấy lịch sử in ấn theo khoảng tháng
exports.getReportByMonth = async (req, res) => {
  const month = req.query.month;
  const year = req.query.year;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;


  // Kiểm tra dữ liệu đầu vào
  if (!month || !year) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const { rows, totalPages, totalRecords } = await reportDAO.getReportByMonth(
      month,
      year,
      offset,
      limit
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No print history found for the specified date range" });
    }

    res.status(200).json({
      message: "Print history retrieved successfully",
      history: rows,
      totalRecords,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching print history by date range:", error);
    res.status(500).json({ message: "An error occurred while retrieving print history" });
  }
};