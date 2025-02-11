const { Pool } = require('pg');
const pool = require('../db');


// Duomenų bazės konfigūracija
const poolPg = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

class MiskasController {
    // Sukurti naują mišką
    async createMiskas(req, res) {
        const { pavadinimas } = req.body;
        const userId = req.userId; // Gaukite userId iš middleware

        try {
            console.log('Bandoma sukurti mišką:', pavadinimas, 'vartotojui:', userId);
            const result = await pool.query(
                'INSERT INTO Miskas (pavadinimas, user_id) VALUES ($1, $2) RETURNING *',
                [pavadinimas, userId]
            );

            console.log('Miškas sukurtas:', result.rows[0]);
            res.status(201).json({
                success: true,
                message: 'Miškas sėkmingai sukurtas',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Klaida kuriant mišką:', error);
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
            console.log('Bandoma gauti miškus userID:', userId);
            const result = await pool.query(
                'SELECT * FROM Miskas WHERE user_id = $1',
                [userId]
            );
            console.log('SQL užklausa įvykdyta, rezultatas:', result.rows);
            
            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            console.error('DB klaida:', error);
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida gaunant miškus',
                error: error.message
            });
        }
    }

    async deleteMiskas(req, res) {
        const { id } = req.params;

        try {
            const result = await pool.query(
                'DELETE FROM Miskas WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Miškas nerastas'
                });
            }

            res.json({
                success: true,
                message: 'Miškas sėkmingai ištrintas',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Klaida ištrinant mišką:', error);
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida ištrinant mišką',
                error: error.message
            });
        }
    }
}

module.exports = new MiskasController();
