const pool = require('../db');

const aiksteleController = {
    // Gauti visas aikšteles pagal sklypą
    async getAikstelesBySklypas(req, res) {
        const sklypoId = req.params.sklypoId;
        try {
            const result = await pool.query(
                'SELECT * FROM Aikstele WHERE sklypas_id = $1',
                [sklypoId]
            );
            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            console.error('Klaida gaunant aikšteles:', error);
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida gaunant aikšteles',
                error: error.message
            });
        }
    },

    // Sukurti naują aikštelę
    async createAikstele(req, res) {
        const { sklypas_id } = req.body;
        try {
            // Sukuriame naują aikštelę
            const result = await pool.query(
                'INSERT INTO Aikstele (sklypas_id) VALUES ($1) RETURNING *',
                [sklypas_id]
            );

            // Atnaujiname aikštelių skaičių sklype
            await pool.query(
                'UPDATE Sklypas SET Aiksteliu_skaicius = Aiksteliu_skaicius + 1 WHERE id = $1',
                [sklypas_id]
            );

            res.status(201).json({
                success: true,
                message: 'Aikštelė sėkmingai sukurta',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Klaida kuriant aikštelę:', error);
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida kuriant aikštelę',
                error: error.message
            });
        }
    },

    // Ištrinti aikštelę
    async deleteAikstele(req, res) {
        const aiksteleId = req.params.id;
        try {
            // Gauname sklypo ID prieš ištrinant aikštelę
            const aikstele = await pool.query(
                'SELECT sklypas_id FROM Aikstele WHERE id = $1',
                [aiksteleId]
            );

            if (aikstele.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Aikštelė nerasta'
                });
            }

            const sklypoId = aikstele.rows[0].sklypas_id;

            // Ištriname aikštelę
            await pool.query('DELETE FROM Aikstele WHERE id = $1', [aiksteleId]);

            // Atnaujiname aikštelių skaičių sklype
            await pool.query(
                'UPDATE Sklypas SET Aiksteliu_skaicius = Aiksteliu_skaicius - 1 WHERE id = $1',
                [sklypoId]
            );

            res.json({
                success: true,
                message: 'Aikštelė sėkmingai ištrinta'
            });
        } catch (error) {
            console.error('Klaida trinant aikštelę:', error);
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida trinant aikštelę',
                error: error.message
            });
        }
    }
};

module.exports = aiksteleController;