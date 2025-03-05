const pool = require('../db');

class MedisController {
    // Sukurti naują medį
    async createMedis(req, res) {
        const { amzius, aukstis, rusis_id } = req.body;
        
        try {
            // Patikriname ar rūšis egzistuoja
            const rusisCheck = await pool.query(
                'SELECT * FROM Rusis WHERE id = $1',
                [rusis_id]
            );

            if (rusisCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Nurodyta rūšis nerasta'
                });
            }

            // Sukuriame medį
            const result = await pool.query(
                'INSERT INTO Medis (amzius, aukstis, rusis_id) VALUES ($1, $2, $3) RETURNING *',
                [amzius, aukstis, rusis_id]
            );

            // Atnaujiname rūšies statistiką
            await this.updateRusisStatistics(rusis_id);

            res.status(201).json({
                success: true,
                message: 'Medis sėkmingai sukurtas',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Klaida kuriant medį:', error);
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida kuriant medį',
                error: error.message
            });
        }
    }

    // Gauti visus medžius pagal rūšį
    async getMedziaiByRusis(req, res) {
        const { rusisId } = req.params;

        try {
            const result = await pool.query(
                'SELECT * FROM Medis WHERE rusis_id = $1',
                [rusisId]
            );

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida gaunant medžius',
                error: error.message
            });
        }
    }

    // Ištrinti medį
    async deleteMedis(req, res) {
        const { id } = req.params;

        try {
            // Gauname medžio informaciją prieš ištrinant
            const medisInfo = await pool.query(
                'SELECT rusis_id FROM Medis WHERE id = $1',
                [id]
            );

            if (medisInfo.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Medis nerastas'
                });
            }

            const rusisId = medisInfo.rows[0].rusis_id;

            // Ištriname medį
            const result = await pool.query(
                'DELETE FROM Medis WHERE id = $1 RETURNING *',
                [id]
            );

            // Atnaujiname rūšies statistiką
            await this.updateRusisStatistics(rusisId);

            res.json({
                success: true,
                message: 'Medis sėkmingai ištrintas',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida ištrinant medį',
                error: error.message
            });
        }
    }

    // Atnaujinti medį
    async updateMedis(req, res) {
        const { id } = req.params;
        const { amzius, aukstis, rusis_id } = req.body;

        try {
            // Patikriname ar rūšis egzistuoja
            if (rusis_id) {
                const rusisCheck = await pool.query(
                    'SELECT * FROM Rusis WHERE id = $1',
                    [rusis_id]
                );

                if (rusisCheck.rows.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Nurodyta rūšis nerasta'
                    });
                }
            }

            // Gauname seną medžio informaciją
            const oldMedisInfo = await pool.query(
                'SELECT rusis_id FROM Medis WHERE id = $1',
                [id]
            );

            if (oldMedisInfo.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Medis nerastas'
                });
            }

            const oldRusisId = oldMedisInfo.rows[0].rusis_id;

            // Atnaujiname medį
            const result = await pool.query(
                'UPDATE Medis SET amzius = $1, aukstis = $2, rusis_id = $3 WHERE id = $4 RETURNING *',
                [amzius, aukstis, rusis_id, id]
            );

            // Atnaujiname statistiką abiem rūšims (senai ir naujai)
            await this.updateRusisStatistics(oldRusisId);
            if (rusis_id !== oldRusisId) {
                await this.updateRusisStatistics(rusis_id);
            }

            res.json({
                success: true,
                message: 'Medis sėkmingai atnaujintas',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida atnaujinant medį',
                error: error.message
            });
        }
    }

    // Pagalbinė funkcija rūšies statistikos atnaujinimui
    async updateRusisStatistics(rusisId) {
        try {
            // Skaičiuojame bendrą medžių skaičių
            const totalCount = await pool.query(
                'SELECT COUNT(*) as medziu_sk FROM Medis WHERE rusis_id = $1',
                [rusisId]
            );

            // Skaičiuojame vidurkius tik iš medžių su nurodytais parametrais
            const stats = await pool.query(
                'SELECT AVG(amzius) as avg_amzius, AVG(aukstis) as avg_aukstis FROM Medis WHERE rusis_id = $1 AND amzius IS NOT NULL AND aukstis IS NOT NULL',
                [rusisId]
            );

            const medziu_sk = totalCount.rows[0].medziu_sk;
            const { avg_amzius, avg_aukstis } = stats.rows[0];

            await pool.query(
                'UPDATE Rusis SET medziu_sk = $1, avg_amzius = $2, avg_aukstis = $3 WHERE id = $4',
                [medziu_sk || 0, avg_amzius || 0, avg_aukstis || 0, rusisId]
            );
        } catch (error) {
            console.error('Klaida atnaujinant rūšies statistiką:', error);
        }
    }
}

module.exports = new MedisController();
