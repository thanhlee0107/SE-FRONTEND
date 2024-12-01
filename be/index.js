require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const createError = require("http-errors");
const { isAuth } = require("./src/auth/auth.middlewares");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const db = require("./config/db");
const log = require("./src/log/log.routes");
const report = require("./src/report/report.routes");
const printingService = require("./src/printing/printingService");

// Middleware
// app.use(express.json());
app.use(bodyParser.json({ limit: "150mb" })); 
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true })); 
app.use(cors());
//Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API for managing users",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Định dạng token là JWT
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Áp dụng bảo mật cho toàn bộ API
      },
    ],
  },

  apis: [
    "src/user/user.routes.js",
    "src/auth/auth.routes.js",
    "src/report/report.routes.js",
    "src/log/log.routes.js",
    "src/printing/printing.routes.js",
    "src/message/message.routes.js",
    "src/printer_management/printer.routes.js",
  ], // Đường dẫn đến file chứa chú thích Swagger cho API
};

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/auth", require("./src/auth/auth.routes"));
app.use("/user", isAuth, require("./src/user/user.routes"));
app.use("/history", isAuth, log);
app.use("/report", isAuth, report);

app.use(
  "/printers",
  isAuth,
  require("./src/printer_management/printer.routes")
);

app.use("/printing", isAuth, require("./src/printing/printing.routes"));
app.use("/messages", isAuth, require("./src/message/message.routes"));
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  next(createError(404));
});
//Start
// Init database form dbScripts

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);

  db.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Database connected");
    }
  });
  //Create a sample test

  //start process printing
  printingService.startPrinters();
});
