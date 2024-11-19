const express = require('express');
const router = express.Router();
const printingController = require("./printing.controller")

router.post("/printrequest/:id", printingController.printrequest);

module.exports = router;