const express = require('express');
const router = express.Router();
const reportService = require('./report.service');


/**
 * @swagger
 * tags:
 *   name: Report
 *   description: API for managing report
 */

//Cập nhật sau
router.get('/', reportService.getReportByYear);


/**
 * @swagger
 * /report/month:
 *   get:
 *     summary: Lấy danh sách báo cáo theo tháng, gộp theo PrinterID
 *     description: Lấy lịch sử in ấn theo tháng và năm được cung cấp trong query parameters.
 *     tags: [Report]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 11
 *         description: Tháng cần lấy báo cáo (1-12).
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Năm cần lấy báo cáo.
 *     responses:
 *       200:
 *         description: Danh sách lịch sử in ấn.
 *       400:
 *         description: Lỗi do thiếu tham số bắt buộc.
 *       404:
 *         description: Không tìm thấy lịch sử in ấn trong khoảng thời gian chỉ định.
 *       500:
 *         description: Lỗi server khi lấy lịch sử in ấn.
 */
router.get('/month', reportService.getReportByMonth);

module.exports = router;