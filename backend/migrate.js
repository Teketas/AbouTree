const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runMigration() {
    try {
        // Skaitome migracijos failą
        const migrationPath = path.join(__dirname, 'migrations', '01_update_medis_sequence.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        // Vykdome SQL komandas
        await pool.query(sql);
        
        console.log('Migracija sėkmingai įvykdyta');
        process.exit(0);
    } catch (error) {
        console.error('Klaida vykdant migraciją:', error);
        process.exit(1);
    }
}

runMigration(); 