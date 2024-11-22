// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const printerRoutes = require("./src/printer_management/printer.routes"); // Adjust the path as needed
const db = require("./src/printer_management/dbPrinter"); // Database configuration
const axios = require("axios")
// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Test database connection
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to the database.");
    }
});

// Setup routes
app.use("/printers", printerRoutes); // Mount printer routes under `/api/printers`

// Default route
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Add Printer</title>
        </head>
        <body>
            <h1>Add a New Printer</h1>
            <form action="/printers/create" method="POST">
                <label for="spsoId">SPSO ID:</label><br>
                <input type="number" id="spsoId" name="spsoId" required><br><br>
                <label for="model">Model:</label><br>
                <input type="text" id="model" name="Model" required><br><br>
                <label for="brand">Brand:</label><br>
                <input type="text" id="brand" name="Brand" required><br><br>
                <label for="status">Status:</label><br>
                <input type="text" id="status" name="Status" required><br><br>
                <label for="campus">Campus:</label><br>
                <input type="text" id="campus" name="Campus" required><br><br>
                <label for="building">Building:</label><br>
                <input type="text" id="building" name="Building" required><br><br>
                <label for="floor">Floor:</label><br>
                <input type="number" id="floor" name="Floor" required><br><br>
                <label for="description">Description:</label><br>
                <textarea id="description" name="Description" ></textarea><br><br>
                <button type="submit">Add Printer</button>
            </form>
            <form action="/printers/getall" method="GET"><button type="submit">Get All Printers</button></form>
            <form action="/update-printer" method="GET"><button type="submit">Update Drivers</button></form>
        </body>
        </html>
    `);
});

app.get('/update-printer', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3003/printers/getall');
        
        // If you are receiving the printers as an array in the response
        const printers = response.data;

        let options = printers.map(printer => `<option value="${printer.ID}">${printer.ID} - ${printer.Model}</option>`).join('');
        
        res.send(`
            <html>
                <body>
                    <h1>Update Printer</h1>
                    <form id="updateForm" method="POST">
                        <label for="printerId">Select Printer ID:</label>
                        <select name="printerId" id="printerId">
                            ${options}
                        </select>
                        <br><br>
                        <label for="spsoId">SPSO ID:</label><br>
                        <input type="number" id="spsoId" name="spsoId" ><br><br>
                        <label for="model">Model:</label><br>
                        <input type="text" id="model" name="Model" ><br><br>
                        <label for="brand">Brand:</label><br>
                        <input type="text" id="brand" name="Brand" ><br><br>
                        <label for="status">Status:</label><br>
                        <select id="status" name="Status" required>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="maintainance">Maintenance</option>
                        </select><br><br>
                        <label for="campus">Campus:</label><br>
                        <input type="text" id="campus" name="Campus" ><br><br>
                        <label for="building">Building:</label><br>
                        <input type="text" id="building" name="Building" ><br><br>
                        <label for="floor">Floor:</label><br>
                        <input type="number" id="floor" name="Floor" ><br><br>
                        <label for="description">Description:</label><br>
                        <textarea id="description" name="Description" ></textarea><br>
                        <button type="submit">Update Printer</button>
                        </form>
                    <form action="/printers/getall" method="GET"><button type="submit">Get All Printers</button></form>
                    <form id="deleteForm" method="POST"><button type="submit">Delete Printers</button></form>
                        
                    <script>
                        // Get the form and the select dropdown
                        const form = document.getElementById('updateForm');
                        const select = document.getElementById('printerId');
                        form.action = \`/printers/update/\${select.value}\`;
                        const delform = document.getElementById('deleteForm');
                        delform.action = \`/printers/delete/\${select.value}\`;

                        // Add event listener to update the form's action when a selection changes
                        select.addEventListener('change', function() {
                            const selectedPrinterId = select.value;

                            form.action = \`/printers/update/\${selectedPrinterId}\`;
                            delform.action = \`/printers/delete/\${selectedPrinterId}\`;
                        });
                    </script>
                </body>
            </html>
        `);
    } catch (err) {
        console.error('Error fetching printers:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
