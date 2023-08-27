const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const formidable = require("express-formidable");
// Import the Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const forms = multer();

// app.use(formidable());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(cors());

// Import the Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// ROUTES
// GET() -> fetch the data
// POST() -> push the data
// PATCH() -> updated
// DELETE() -> delete the data

// Connect the mongoDB
mongoose.connect(process.env.DB_CONNECTION).then(() => {
  // Listening port
  app.listen(3000, () => {
    console.log("App is running");
  });
});
