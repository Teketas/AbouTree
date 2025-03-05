const pool = require('../db');

class RusisController {
    // Sukurti naują rūšį
    async createRusis(req, res) {
        const { pavadinimas, medziu_sk, avg_amzius, avg_aukstis, aikstele_id } = req.body;
        
        try {
            const result = await pool.query(
                'INSERT INTO Rusis (pavadinimas, medziu_sk, avg_amzius, avg_aukstis, aikstele_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [pavadinimas, medziu_sk, avg_amzius, avg_aukstis, aikstele_id]
            );

            res.status(201).json({
                success: true,
                message: 'Rūšis sėkmingai sukurta',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Klaida kuriant rūšį:', error);
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida kuriant rūšį',
                error: error.message
            });
        }
    }

    // Gauti visas rūšis pagal aikštelę
    async getRusisByAikstele(req, res) {
        const { aiksteleId } = req.params;

        try {
            const result = await pool.query(
                'SELECT * FROM Rusis WHERE aikstele_id = $1',
                [aiksteleId]
            );

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida gaunant rūšis',
                error: error.message
            });
        }
    }

    // Atnaujinti rūšies informaciją
    async updateRusis(req, res) {
        const { id } = req.params;
        const { pavadinimas, medziu_sk, avg_amzius, avg_aukstis } = req.body;

        try {
            const result = await pool.query(
                'UPDATE Rusis SET pavadinimas = $1, medziu_sk = $2, avg_amzius = $3, avg_aukstis = $4 WHERE id = $5 RETURNING *',
                [pavadinimas, medziu_sk, avg_amzius, avg_aukstis, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Rūšis nerasta'
                });
            }

            res.json({
                success: true,
                message: 'Rūšis sėkmingai atnaujinta',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida atnaujinant rūšį',
                error: error.message
            });
        }
    }

    // Ištrinti rūšį
    async deleteRusis(req, res) {
        const { id } = req.params;

        try {
            const result = await pool.query(
                'DELETE FROM Rusis WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Rūšis nerasta'
                });
            }

            res.json({
                success: true,
                message: 'Rūšis sėkmingai ištrinta',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida ištrinant rūšį',
                error: error.message
            });
        }
    }

    // Atnaujinti rūšies vidurkius
    async updateRusisAverages(req, res) {
        const { id } = req.params;

        try {
            // Pirma gauname visus medžius šios rūšies
            const medisResult = await pool.query(
                'SELECT COUNT(*) as medziu_sk, AVG(amzius) as avg_amzius, AVG(aukstis) as avg_aukstis FROM Medis WHERE rusis_id = $1',
                [id]
            );

            const { medziu_sk, avg_amzius, avg_aukstis } = medisResult.rows[0];

            // Atnaujiname rūšies informaciją su naujais vidurkiais
            const result = await pool.query(
                'UPDATE Rusis SET medziu_sk = $1, avg_amzius = $2, avg_aukstis = $3 WHERE id = $4 RETURNING *',
                [medziu_sk, avg_amzius, avg_aukstis, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Rūšis nerasta'
                });
            }

            res.json({
                success: true,
                message: 'Rūšies vidurkiai sėkmingai atnaujinti',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida atnaujinant rūšies vidurkius',
                error: error.message
            });
        }
    }
}

module.exports = new RusisController();
