const express = require('express');
const router = express.Router();
const logService = require('./log.service');


/**
 * @swagger
 * tags:
 *   name: Log
 *   description: API for managing report
 */

/**
 * @swagger
 * /log/{studentID}:
 *   get:
 *     summary: Lấy toàn bộ lịch sử in ấn của một sinh viên
 *     description: Truy xuất lịch sử in ấn của sinh viên theo mã số, hỗ trợ phân trang.
 *     tags: [Log]
 *     parameters:
 *       - in: path
 *         name: studentID
 *         required: true
 *         schema:
 *           type: string
 *           example: 2212044
 *         description: Mã số sinh viên cần truy xuất lịch sử in ấn.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang (mặc định là 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số bản ghi trên mỗi trang (mặc định là 10).
 *     responses:
 *       200:
 *         description: Lịch sử in ấn được lấy thành công.
 *       404:
 *         description: Không tìm thấy lịch sử in ấn cho sinh viên.
 *       500:
 *         description: Lỗi server khi truy xuất lịch sử in ấn.
 */
router.get('/:studentID', logService.getAllHistory);



/**
 * @swagger
 * /log/{studentID}/date:
 *   get:
 *     summary: Lấy lịch sử in ấn của sinh viên theo khoảng thời gian
 *     description: Truy xuất lịch sử in ấn của sinh viên theo mã số và khoảng thời gian, hỗ trợ phân trang.
 *     tags: [Log]
 *     parameters:
 *       - in: path
 *         name: studentID
 *         required: true
 *         schema:
 *           type: string
 *           example: 1234567
 *         description: Mã số sinh viên cần truy xuất lịch sử in ấn.
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-11-01
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD).
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-11-30
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang (mặc định là 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số bản ghi trên mỗi trang (mặc định là 10).
 *     responses:
 *       200:
 *         description: Lịch sử in ấn được lấy thành công.
 *       400:
 *         description: Lỗi do thiếu tham số bắt buộc.
 *       404:
 *         description: Không tìm thấy lịch sử in ấn trong khoảng thời gian chỉ định.
 *       500:
 *         description: Lỗi server khi truy xuất lịch sử in ấn.
 */
router.get('/:studentID/date', logService.getHistoryByDate);

module.exports = router;