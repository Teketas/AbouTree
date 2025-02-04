const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to the PostgreSQL database.");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
})();

module.exports = pool;
