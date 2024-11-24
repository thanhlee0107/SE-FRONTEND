const express = require("express");
const router = express.Router();
const logService = require("./log.service");

/**
 * @swagger
 * tags:
 *   name: Log
 *   description: API for managing report
 */

/**
 * @swagger
 * /history/date/{studentID}:
 *   get:
 *     summary: Lấy lịch sử in ấn của sinh viên theo khoảng thời gian
 *     description: Truy xuất lịch sử in ấn của một sinh viên hoặc tất cả sinh viên theo mã số và khoảng thời gian. Hỗ trợ phân trang.
 *     tags: [Log]
 *     parameters:
 *       - in: path
 *         name: studentID
 *         required: true
 *         schema:
 *           type: string
 *           example: "0"
 *         description: Mã số sinh viên (hoặc `0` để lấy lịch sử của tất cả sinh viên).
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Ngày bắt đầu (YYYY-MM-DD).
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *         description: Ngày kết thúc (YYYY-MM-DD).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang (mặc định 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số bản ghi trên mỗi trang (mặc định 10).
 *     responses:
 *       200:
 *         description: Truy xuất lịch sử in ấn thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentID:
 *                         type: string
 *                         example: "2020123"
 *                       printerID:
 *                         type: string
 *                         example: "PRT12345"
 *                       campus:
 *                         type: string
 *                         example: "CS1"
 *                       building:
 *                         type: string
 *                         example: "H1"
 *                       floor:
 *                         type: string
 *                         example: "2"
 *                       status:
 *                         type: string
 *                         example: "Completed"
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       fileName:
 *                         type: string
 *                         example: "Document1.pdf"
 *                       amount:
 *                         type: number
 *                         format: double
 *                         example: 15.00
 *                       totalPages:
 *                         type: integer
 *                         example: 5
 *       400:
 *         description: Thiếu tham số cần thiết (startDate hoặc endDate).
 *       404:
 *         description: Không tìm thấy lịch sử in ấn.
 *       500:
 *         description: Lỗi server.
 */
router.get("/date/:studentID", logService.getUserHistoryByDate);

/**
 * @swagger
 * /history/{studentID}:
 *   get:
 *     summary: Lấy lịch sử in ấn của sinh viên
 *     description: Truy xuất lịch sử in ấn của một sinh viên hoặc tất cả sinh viên dựa trên mã số. Hỗ trợ phân trang.
 *     tags: [Log]
 *     parameters:
 *       - in: path
 *         name: studentID
 *         required: true
 *         schema:
 *           type: string
 *           example: "0"
 *         description: Mã số sinh viên (hoặc `0` để lấy lịch sử của tất cả sinh viên).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang (mặc định 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số bản ghi trên mỗi trang (mặc định 10).
 *     responses:
 *       200:
 *         description: Truy xuất lịch sử in ấn thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Print history retrieved successfully"
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentID:
 *                         type: string
 *                         example: "2020123"
 *                       printerID:
 *                         type: string
 *                         example: "PRT12345"
 *                       campus:
 *                         type: string
 *                         example: "CS1"
 *                       building:
 *                         type: string
 *                         example: "H1"
 *                       floor:
 *                         type: string
 *                         example: "2"
 *                       status:
 *                         type: string
 *                         example: "Completed"
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       fileName:
 *                         type: string
 *                         example: "Document1.pdf"
 *                       amount:
 *                         type: number
 *                         format: double
 *                         example: 15.00
 *                       totalPages:
 *                         type: integer
 *                         example: 5
 *       404:
 *         description: Không tìm thấy lịch sử in ấn.
 *       500:
 *         description: Lỗi server.
 */

router.get("/:studentID", logService.getUserHistory);

/**
 * @swagger
 * /history/printer/date/{printerID}:
 *   get:
 *     summary: Lấy lịch sử in ấn của máy in theo khoảng thời gian
 *     description: Truy xuất lịch sử in ấn của một máy in theo khoảng thời gian. Nếu `printerID` bằng `0`, lịch sử in ấn của tất cả máy in sẽ được lấy. Hỗ trợ phân trang.
 *     tags: [Log]
 *     parameters:
 *       - in: path
 *         name: printerID
 *         required: true
 *         schema:
 *           type: string
 *           example: 0
 *         description: Mã của máy in cần lấy lịch sử in ấn. Đặt giá trị `0` để lấy lịch sử của tất cả máy in.
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *         description: Ngày bắt đầu truy xuất lịch sử (định dạng YYYY-MM-DD).
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-31
 *         description: Ngày kết thúc truy xuất lịch sử (định dạng YYYY-MM-DD).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang, mặc định là 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số bản ghi trên mỗi trang, mặc định là 10.
 *     responses:
 *       200:
 *         description: Truy xuất lịch sử in ấn thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Print history retrieved successfully
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                      studentID:
 *                          example: 2020123
 *                      printerID:
 *                           example: PRT12345
 *                      campus:
 *                            type: string
 *                            example: CS1
 *                      building:
 *                            type: string
 *                            example: H1
 *                      floor:
 *                            type: string
 *                            example: 2
 *                      status:
 *                            type: string
 *                            example: Completed
 *                      date:
 *                            type: string
 *                            format: date
 *                            example: 2024-01-15
 *                      endDate:
 *                            type: string
 *                            format: date
 *                            example: 2024-01-16
 *                      fileName:
 *                            type: string
 *                            example: Document1.pdf
 *                      amount:
 *                            type: number
 *                            format: double
 *                            example: 15.00
 *                      report:
 *                            type: boolean
 *                            example: false
 *                      totalPages:
 *                            type: integer
 *                            example: 5
 *       400:
 *         description: Thiếu tham số cần thiết (startDate hoặc endDate).
 *       404:
 *         description: Không tìm thấy lịch sử in ấn trong khoảng thời gian chỉ định.
 *       500:
 *         description: Lỗi server khi truy xuất lịch sử in ấn.
 */

router.get("/printer/date/:printerID", logService.getPrinterHistoryByDate);

/**
 * @swagger
 * /history/printer/{printerID}:
 *   get:
 *     summary: Lấy lịch sử in ấn của máy in
 *     description: Truy xuất lịch sử in ấn của một máy in theo mã số. Nếu `printerID` bằng `0`, lịch sử in ấn của tất cả máy in sẽ được lấy. Hỗ trợ phân trang.
 *     tags: [Log]
 *     parameters:
 *       - in: path
 *         name: printerID
 *         required: true
 *         schema:
 *           type: string
 *           example: 0
 *         description: Mã của máy in cần lấy lịch sử in ấn. Đặt giá trị `0` để lấy lịch sử của tất cả máy in.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang, mặc định là 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số bản ghi trên mỗi trang, mặc định là 10.
 *     responses:
 *       200:
 *         description: Truy xuất lịch sử in ấn thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Print history retrieved successfully
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                      studentID:
 *                          example: 2020123
 *                      printerID:
 *                           example: PRT12345
 *                      campus:
 *                            type: string
 *                            example: CS1
 *                      building:
 *                            type: string
 *                            example: H1
 *                      floor:
 *                            type: string
 *                            example: 2
 *                      status:
 *                            type: string
 *                            example: Completed
 *                      date:
 *                            type: string
 *                            format: date
 *                            example: 2024-01-15
 *                      endDate:
 *                            type: string
 *                            format: date
 *                            example: 2024-01-16
 *                      fileName:
 *                            type: string
 *                            example: Document1.pdf
 *                      amount:
 *                            type: number
 *                            format: double
 *                            example: 15.00
 *                      report:
 *                            type: boolean
 *                            example: false
 *                      totalPages:
 *                            type: integer
 *                            example: 5
 *       404:
 *         description: Không tìm thấy lịch sử in ấn cho máy in.
 *       500:
 *         description: Lỗi server khi truy xuất lịch sử in ấn.
 */
router.get("/printer/:printerID", logService.getPrinterHistory);
module.exports = router;
