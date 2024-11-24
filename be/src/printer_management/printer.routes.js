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
