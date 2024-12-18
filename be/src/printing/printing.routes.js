const express = require("express");
const router = express.Router();
const printingController = require("./printing.controller");

/**
 * @swagger
 * tags:
 *   name: Request Print
 *   description: API for managing report
 */

/**
 * @swagger
 * /printing/printrequest/:
 *   post:
 *     summary: Create a new print request
 *     description: API to create a print request based on user ID
 *     tags:
 *       - Request Print
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IDPrinter:
 *                 type: string
 *                 description: ID of the printer
 *               Name:
 *                 type: string
 *                 description: Name of the file
 *               Type:
 *                type: string
 *                description: Type of the file (e.g., Word, Excel, PDF)
 *               Amount:
 *                 type: integer
 *                 description: Number of copies to print
 *               Size:
 *                 type: string
 *                 description: Paper size (e.g., A4, A3)
 *               Color:
 *                 type: boolean
 *                 description: True for color printing, false for black and white
 *             example:
 *               IDPrinter: "1"
 *               Name: "Word Document"
 *               Type: "pdf"
 *               Amount: 10
 *               Size: "A3"
 *               Color: true
 *     responses:
 *       200:
 *         description: Print request created successfully
 *       400:
 *         description: Invalid input
 */

router.post("/printrequest/", printingController.printrequest);

module.exports = router;
