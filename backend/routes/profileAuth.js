// backend/routes/profileAuth.js
const express = require("express");
const pool = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ error: "Unauthorized: Token required." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid token.");
      return res.status(403).json({ error: "Forbidden: Invalid token." });
    }
    req.user = user; // Attach the decoded user info to the request
    next();
  });
};

// Profile endpoint to fetch user details
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching profile for user ID:", userId);

    const user = await pool.query("SELECT email, created_at FROM users WHERE id = $1", [userId]);
    if (user.rows.length === 0) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found." });
    }

    console.log("Profile fetched for user ID:", userId);
    res.json(user.rows[0]);
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
    res.status(500).json({ error: "Server error.", details: error.message });
  }
});

module.exports = router;
