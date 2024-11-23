const Printer = require("./printer.model");
const configDefault = require("./../../config/default");

exports.createPrinter = async (req, res) => {
    console.log("createPrinter");
    const { spsoId, Model, Brand, Status, Campus, Building, Floor, Description } = req.body;
    const newPrinter = { spsoId, Model, Brand, Status, Campus, Building, Floor, Description };
    
    try {
        const result = await Printer.createPrinter(newPrinter);
        return res.status(201).json(result);
    } catch (err) {
        return res.status(400).json({ message: err.message || err });
    }
};


exports.getAllPrinters = async (req, res) => {
    try {
        console.log("getAllPrinters");
        const result = await Printer.getAllPrinters();
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({ message: err.message || err });
    }
};

exports.getPrintersByPaging = async (req, res) => {
    try {
        console.log("getPrinters by Page");
        const page = parseInt(req.query.page, 10) || configDefault.PAGINATION.DEFAULT_PAGE; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || configDefault.PAGINATION.DEFAULT_LIMIT; // Default to 10 items per page
        
        // Calculate the offset
        const offset = (page - 1) * limit;

        const result = await Printer.getPrintersWithPaging(offset, limit);
        return res.status(200).json(result);

    }
    catch (err) {
        return res.status(400).json({ message: err.message || err });
    }
};

exports.getPrinterById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await Printer.getPrinterById(id);
        if (!result) {
            return res.status(404).json({ message: "Printer not found" });
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({ message: err.message || err });
    }
};

exports.updatePrinter = async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    
    try {
        const result = await Printer.updatePrinterById(id, updatedData);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({ message: err.message || err });
    }
};

exports.deletePrinter = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Printer.deletePrinterById(id);
        if (!result) {
            return res.status(404).json({ message: "Printer not found" });
        }
        return res.status(200).json({ message: "Printer deleted", result });
    } catch (err) {
        return res.status(400).json({ message: err.message || err });
    }
};
