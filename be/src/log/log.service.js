const historyDAO = require('./log.DAO');

//Phần này là lớp Business Layer, tương tự như Controller

// Lấy toàn bộ lịch sử in ấn của sinh viên
exports.getAllHistory = async (req, res) => {
  //Paging
  const studentID = req.params.studentID;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const { rows, totalPages } = await historyDAO.getPrintHistoryByStudent(studentID, offset, limit);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No print history found for this student" });
    }

    return res.status(200).json({
      message: "Print history retrieved successfully",
      history: rows,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching print history:", error);
    return res.status(500).json({ message: "An error occurred while retrieving print history" });
  }
};

// Lấy lịch sử in ấn theo khoảng thời gian
exports.getHistoryByDate = async (req, res) => {
  //Paging
  const studentID = req.params.studentID;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;


  // Kiểm tra dữ liệu đầu vào
  if (!studentID || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required parameters: studentID, startDate, or endDate" });
  }

  try {
    const { rows, totalPages } = await historyDAO.getPrintHistoryByDate(
      studentID,
      startDate,
      endDate,
      offset,
      limit
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No print history found for the specified date range" });
    }

    res.status(200).json({
      message: "Print history retrieved successfully",
      history: rows,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching print history by date range:", error);
    res.status(500).json({ message: "An error occurred while retrieving print history" });
  }
};
