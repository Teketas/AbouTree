// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

// Registration endpoint
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Received request:", req.body);

    // Check if user already exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length > 0) {
      console.log("User already exists.");
      return res.status(400).json({ error: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    console.log("User registered successfully.");
    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Server error.", details: error.message });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt:", req.body);

    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      console.log("Invalid email.");
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Compare hashed passwords
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      console.log("Invalid password.");
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("Login successful for:", email);
    res.json({ token, message: "Login successful!" });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error.", details: error.message });
  }
});

module.exports = router;
