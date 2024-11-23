const express = require("express");
const router = express.Router();
const printerController = require("./printer.controller");

router.post("/create", printerController.createPrinter);
router.get("/getall", printerController.getAllPrinters);
router.get("/page", printerController.getPrintersByPaging); // homepage/printers/page?page=x&limit=y
router.get("/get/:id", printerController.getPrinterById);
router.post("/update/:id", printerController.updatePrinter);
router.post("/delete/:id", printerController.deletePrinter);

module.exports = router;
