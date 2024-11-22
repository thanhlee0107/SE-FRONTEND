const express = require('express');
const router = express.Router();
const printingController = require("./printing.controller")

/**
 * @swagger
 * /printing/printrequest/{id}:
 *  post:
 *  summary: tạo yêu cầu in mới
 *  description: API này được sử dụng để tạo yêu cầu in dựa trên ID của người dùng
 *  parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của yêu cầu in
 *         schema:
 *           type: string
 *  requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IDPrinter:
 *                 type: string
 *                 description: ID của máy in
 *               IDFile:
 *                 type: string
 *                 description: ID của file cần in
 *               Amount:
 *                 type: integer
 *                 description: Số lượng bản in
 *               Size:
 *                 type: string
 *                 description: Kích thước của bản in (ví dụ: A4, A3)
 *               Color:
 *                 type: boolean
 *                 description: True nếu in màu, false nếu in đen trắng
 *             example:
 *               IDPrinter: "1"
 *               IDFile: "3"
 *               Amount: 10
 *               Size: "A3"
 *               Color: true
 */
router.post("/printrequest/:id", printingController.printrequest);

module.exports = router;