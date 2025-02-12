const pool = require('../db');

class SklypasController {
    // Sukurti naują sklypą
    async createSklypas(req, res) {
        const { pavadinimas, plotas, miskoId } = req.body;
        
        try {
            const result = await pool.query(
                'INSERT INTO Sklypas (pavadinimas, plotas, miskas_id) VALUES ($1, $2, $3) RETURNING *',
                [pavadinimas, plotas, miskoId]
            );

            res.status(201).json({
                success: true,
                message: 'Sklypas sėkmingai sukurtas',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Klaida kuriant sklypą:', error);
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida kuriant sklypą',
                error: error.message
            });
        }
    }

    // Gauti visus skypus pagal mišką
    async getSkypasByMiskas(req, res) {
        const { miskoId } = req.params;

        try {
            const result = await pool.query(
                'SELECT * FROM Sklypas WHERE miskas_id = $1',
                [miskoId]
            );

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida gaunant sklypus',
                error: error.message
            });
        }
    }

    // Atnaujinti sklypą
    async updateSklypas(req, res) {
        const { id } = req.params;
        const { pavadinimas, plotas, kubatura, skalsumas, rusineSudetis } = req.body;

        try {
            const result = await pool.query(
                'UPDATE Sklypas SET pavadinimas = $1, plotas = $2, kubatura = $3, skalsumas = $4, rusine_sudetis = $5 WHERE id = $6 RETURNING *',
                [pavadinimas, plotas, kubatura, skalsumas, rusineSudetis, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Sklypas nerastas'
                });
            }

            res.json({
                success: true,
                message: 'Sklypas sėkmingai atnaujintas',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida atnaujinant sklypą',
                error: error.message
            });
        }
    }

    // Ištrinti sklypą
    async deleteSklypas(req, res) {
        const { id } = req.params;

        try {
            const result = await pool.query(
                'DELETE FROM Sklypas WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Sklypas nerastas'
                });
            }

            res.json({
                success: true,
                message: 'Sklypas sėkmingai ištrintas',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida ištrinant sklypą',
                error: error.message
            });
        }
    }

    // Apskaičiuoti kubatūrą
    async calculateKubatura(req, res) {
        const { id } = req.params;
        const { mediuAukstis, mediuSkersmuo, mediuKiekis } = req.body;

        try {
            // Kubatūros skaičiavimo formulė
            const kubatura = (Math.PI * Math.pow(mediuSkersmuo/2, 2) * mediuAukstis * mediuKiekis).toFixed(2);

            const result = await pool.query(
                'UPDATE Sklypas SET kubatura = $1 WHERE id = $2 RETURNING *',
                [kubatura, id]
            );

            res.json({
                success: true,
                message: 'Kubatūra sėkmingai apskaičiuota',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida skaičiuojant kubatūrą',
                error: error.message
            });
        }
    }

    // Apskaičiuoti skalsumą
    async calculateSkalsumas(req, res) {
        const { id } = req.params;
        const { faktinisSkalsumas, normalusSkalsumas } = req.body;

        try {
            // Skalsumo skaičiavimo formulė
            const skalsumas = (faktinisSkalsumas / normalusSkalsumas).toFixed(2);

            const result = await pool.query(
                'UPDATE Sklypas SET skalsumas = $1 WHERE id = $2 RETURNING *',
                [skalsumas, id]
            );

            res.json({
                success: true,
                message: 'Skalsumas sėkmingai apskaičiuotas',
                data: result.rows[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Įvyko klaida skaičiuojant skalsumą',
                error: error.message
            });
        }
    }
}

module.exports = new SklypasController();
