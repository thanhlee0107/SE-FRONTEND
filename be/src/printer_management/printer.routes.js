const express = require("express");
const router = express.Router();
const printerController = require("./printer.controller");

router.post("/create", printerController.createPrinter);
router.get("/getall", printerController.getAllPrinters);
router.get("/page", printerController.getPrintersByPaging); // homepage/printers/page?page=x&limit=y
router.get("/get/:id", printerController.getPrinterById);
router.post("/update/:id", printerController.updatePrinter);
router.post("/delete/:id", printerController.deletePrinter);
router.get("/config/page", printerController.getDefaultPrinterPageBalance);
router.post("/config/update", printerController.updatePageBalance);
router.get("/config/type", printerController.checkFileType); // homepage/printers/config/type?type=x
router.post("/config/changetype", printerController.updatePermittedFileTypes);
router.post("/config/disabletype", printerController.unsetPermittedFileTypes);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Printers
 *   description: Printer management API
 */

/**
 * @swagger
 * /printers/create:
 *   post:
 *     summary: Create a new printer
 *     tags: [Printers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spsoId:
 *                 type: string
 *               Model:
 *                 type: string
 *               Brand:
 *                 type: string
 *               Status:
 *                 type: string
 *               Campus:
 *                 type: string
 *               Building:
 *                 type: string
 *               Floor:
 *                 type: number
 *               Description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Printer created successfully
 *       400:
 *         description: Error creating printer
 */

/**
 * @swagger
 * /printers/getall:
 *   get:
 *     summary: Retrieve all printers
 *     tags: [Printers]
 *     responses:
 *       200:
 *         description: List of printers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Error retrieving printers
 */

/**
 * @swagger
 * /printers/page:
 *   get:
 *     summary: Retrieve printers with pagination
 *     tags: [Printers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of printers
 *       400:
 *         description: Error retrieving printers
 */

/**
 * @swagger
 * /printers/get/{id}:
 *   get:
 *     summary: Retrieve a printer by ID
 *     tags: [Printers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Printer ID
 *     responses:
 *       200:
 *         description: Printer details
 *       404:
 *         description: Printer not found
 *       400:
 *         description: Error retrieving printer
 */

/**
 * @swagger
 * /printers/update/{id}:
 *   post:
 *     summary: Update a printer by ID
 *     tags: [Printers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Printer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Model:
 *                 type: string
 *               Brand:
 *                 type: string
 *               Status:
 *                 type: string
 *               Campus:
 *                 type: string
 *               Building:
 *                 type: string
 *               Floor:
 *                 type: number
 *               Description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Printer updated successfully
 *       400:
 *         description: Error updating printer
 */

/**
 * @swagger
 * /printers/delete/{id}:
 *   post:
 *     summary: Delete a printer by ID
 *     tags: [Printers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Printer ID
 *     responses:
 *       200:
 *         description: Printer deleted successfully
 *       404:
 *         description: Printer not found
 *       400:
 *         description: Error deleting printer
 */

/**
 * @swagger
 * /printers/config/page:
 *   get:
 *     summary: Get default printer page balance
 *     tags: [Printers]
 *     responses:
 *       200:
 *         description: Default page balance
 *       400:
 *         description: Error retrieving page balance
 */

/**
 * @swagger
 * /printers/config/update:
 *   post:
 *     summary: Update printer page balance
 *     tags: [Printers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageBalance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Page balance updated successfully
 *       400:
 *         description: Error updating page balance
 */

/**
 * @swagger
 * /printers/config/type:
 *   get:
 *     summary: Check if a file type is permitted
 *     tags: [Printers]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: File type to check
 *     responses:
 *       200:
 *         description: File type is permitted
 *       400:
 *         description: File type is not permitted
 */

/**
 * @swagger
 * /printers/config/changetype:
 *   post:
 *     summary: Update permitted file types
 *     tags: [Printers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typelist:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Permitted file types updated successfully
 *       400:
 *         description: Error updating file types
 */

/**
 * @swagger
 * /printers/config/disabletype:
 *   post:
 *     summary: Disable permitted file types
 *     tags: [Printers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disabletype:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: File types disabled successfully
 *       400:
 *         description: Error disabling file types
 */
