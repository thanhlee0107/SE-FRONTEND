require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const createError = require("http-errors");
const { isAuth } = require("./src/auth/auth.middlewares");

// Middleware
// app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/auth", require("./src/auth/auth.routes"));

app.use((req, res, next) => {
  next(createError(404));
});
//Start
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  db.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Database connected");
    }
  });
});
