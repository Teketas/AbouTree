const { Pool } = require('pg');

// Duomenų bazės konfigūracija
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_password',
    port: 5432,
});

class MiskasController {
    // Sukurti naują mišką
    async createMiskas(req, res) {
        const { pavadinimas, userId } = req.body;

        try {
            const result = await pool.query(
                'INSERT INTO Miskas (pavadinimas, user_id) VALUES ($1, $2) RETURNING *',
                [pavadinimas, userId]
            );

            res.status(201).json({
                success: true,
                message: 'Miškas sėkmingai sukurtas',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida kuriant mišką',
                error: error.message
            });
        }
    }

    // Atnaujinti miško pavadinimą
    async updateMiskasPavadinimas(req, res) {
        const { id } = req.params;
        const { pavadinimas } = req.body;

        try {
            const result = await pool.query(
                'UPDATE Miskas SET pavadinimas = $1 WHERE id = $2 RETURNING *',
                [pavadinimas, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Miškas nerastas'
                });
            }

            res.json({
                success: true,
                message: 'Miško pavadinimas sėkmingai atnaujintas',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida atnaujinant miško pavadinimą',
                error: error.message
            });
        }
    }

    // Gauti visus miškus pagal vartotoją
    async getMiskasByUser(req, res) {
        const { userId } = req.params;

        try {
            const result = await pool.query(
                'SELECT * FROM Miskas WHERE user_id = $1',
                [userId]
            );

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida gaunant miškus',
                error: error.message
            });
        }
    }
}

module.exports = new MiskasController();
