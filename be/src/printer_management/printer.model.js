const db = require("../../config/db");

// Helper function to query the database
const queryDatabase = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Create a new printer
exports.createPrinter = async (newPrinter) => {
    try {
        console.log(newPrinter);
        const result = await queryDatabase(
            `INSERT INTO Printer (spsoId, Model, Brand, Status, Campus, Building, Floor, Description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newPrinter.spsoId,
                newPrinter.Model,
                newPrinter.Brand,
                newPrinter.Status,
                newPrinter.Campus,
                newPrinter.Building,
                newPrinter.Floor,
                newPrinter.Description,
            ]
        );
        return { message: "Printer created", result };
    } catch (err) {
        throw new Error(err);
    }
};

// Get all printers
exports.getAllPrinters = async () => {
    try {
        const result = await queryDatabase(`SELECT * FROM Printer`);
        return result;
    } catch (err) {
        throw new Error(err);
    }
};

exports.getPrintersWithPaging = async (offset, limit) => {
    try {
        const query = `SELECT * FROM Printer LIMIT ? OFFSET ?`;
        const result = queryDatabase(query, [limit, offset]);
        console.log(result)
        return result;
    } catch (error) {
        console.error("Error in getPrintersWithPaging:", error);
        throw error;
    }
};

// Get total number of printers
exports.getTotalCount = async () => {
    try {
        const result = await queryDatabase(`SELECT COUNT(*) as count FROM Printer`);
        return result[0].count;
    } catch (err) {
        throw new Error(err);
    }
};
// Get printer by ID
exports.getPrinterById = async (id) => {
    try {
        const result = await queryDatabase(`SELECT * FROM Printer WHERE id = ?`, [
            id,
        ]);
        return result;
    } catch (err) {
        throw new Error(err);
    }
};

// Update printer by ID
exports.updatePrinterById = async (id, new_data) => {
    const fields = [];
    const values = [];

    if (new_data.spsoId) {
        fields.push("spsoId = ?");
        values.push(new_data.spsoId);
    }
    if (new_data.Model) {
        fields.push("Model = ?");
        values.push(new_data.Model);
    }
    if (new_data.Brand) {
        fields.push("Brand = ?");
        values.push(new_data.Brand);
    }
    if (new_data.Status) {
        fields.push("Status = ?");
        values.push(new_data.Status);
    }
    if (new_data.Campus) {
        fields.push("Campus = ?");
        values.push(new_data.Campus);
    }
    if (new_data.Building) {
        fields.push("Building = ?");
        values.push(new_data.Building);
    }
    if (new_data.Floor) {
        fields.push("Floor = ?");
        values.push(new_data.Floor);
    }
    if (new_data.Description) {
        fields.push("Description = ?");
        values.push(new_data.Description);
    }

    if (fields.length === 0) {
        throw new Error("No fields to update");
    }

    values.push(id);

    const query = `UPDATE Printer SET ${fields.join(", ")} WHERE id = ?`;
    try {
        await queryDatabase(query, values);
        return { message: "Printer updated" };
    } catch (err) {
        throw new Error(err);
    }
};

// Delete printer by ID
exports.deletePrinterById = async (id) => {
    try {
        const result = await queryDatabase(`DELETE FROM Printer WHERE id = ?`, [id]);
        return result;
    } catch (err) {
        throw new Error(err);
    }
};
