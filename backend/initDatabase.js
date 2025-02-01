const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to read and execute an SQL command
async function runSQL(sql) {
  try {
    await pool.query(sql);
    console.log(`Successfully executed SQL: \n${sql}`);
  } catch (error) {
    console.error(`Error executing SQL:`, error.message);
    throw error;
  }
}

// Function to extract table names from create.sql
function extractTableNames(filePath) {
  const sql = fs.readFileSync(filePath).toString();
  const regex = /CREATE TABLE IF NOT EXISTS (\w+)/gi; // Regex to find table names in CREATE TABLE statements
  const tableNames = [];
  let match;

  while ((match = regex.exec(sql)) !== null) {
    tableNames.push(match[1]);
  }

  return tableNames;
}

// Function to get existing tables in the database
async function getExistingTables() {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);

    return result.rows.map(row => row.table_name); // Return an array of table names
  } catch (error) {
    console.error("Error fetching existing tables:", error.message);
    throw error;
  }
}

// Main function to check and create missing tables
async function checkAndCreateTables() {
  console.log("Checking for missing tables...");

  const createPath = path.join(__dirname, "sql", "create.sql");
  const tableNamesInCreateSQL = extractTableNames(createPath);

  try {
    const existingTables = await getExistingTables();

    // Determine missing tables
    const missingTables = tableNamesInCreateSQL.filter(
      tableName => !existingTables.includes(tableName)
    );

    if (missingTables.length === 0) {
      console.log("All tables are already present in the database.");
    } else {
      console.log(`Missing tables: ${missingTables.join(", ")}`);
      console.log("Creating missing tables...");

      // Execute the create.sql to create the missing tables
      const createSQL = fs.readFileSync(createPath).toString();

      for (const table of missingTables) {
        const regex = new RegExp(`CREATE TABLE IF NOT EXISTS ${table}[^;]+;`, "gi");
        const tableSQL = createSQL.match(regex)?.[0];

        if (tableSQL) {
          await runSQL(tableSQL);
        } else {
          console.warn(`Could not find CREATE statement for table: ${table}`);
        }
      }

      console.log("Missing tables created successfully.");
    }
  } catch (error) {
    console.error("Error checking and creating tables:", error.message);
    throw error;
  }
}

// Main function to initialize the database
async function initDatabase() {
  console.log("Initializing database...");

  try {
    await checkAndCreateTables(); // Check and create missing tables
  } catch (error) {
    console.error("Database initialization failed:", error.message);
  } finally {
    await pool.end(); // Always close the connection pool
    console.log("Database connection closed.");
  }
}

// Execute the script
initDatabase();
