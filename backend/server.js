// backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth"); // Import auth routes
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Connect Routes
app.use("/auth", authRoutes); // Register the auth routes here

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
