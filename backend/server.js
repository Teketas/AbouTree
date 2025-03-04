const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const profileAuthRoutes = require("./routes/profileAuth"); // ✅ Import new profile route
const miskasRoutes = require("./routes/miskas");
const sklypasRoutes = require('./routes/sklypas');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Connect Routes
app.use('/sklypas', sklypasRoutes);
app.use("/auth", authRoutes);
app.use("/auth", profileAuthRoutes); // ✅ Register the new profile route
app.use("/miskas", miskasRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
