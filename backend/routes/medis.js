const express = require('express');
const router = express.Router();
const medisController = require('../taksavimas/MedisController');
const auth = require('../middleware/auth');

// Sukurti naują medį
router.post('/sukurti-medi', auth, (req, res) => medisController.createMedis(req, res));

// Gauti visus medžius pagal rūšį
router.get('/medziai/rusis/:rusisId', auth, (req, res) => medisController.getMedziaiByRusis(req, res));

// Atnaujinti medį
router.put('/atnaujinti-medi/:id', auth, (req, res) => medisController.updateMedis(req, res));

// Ištrinti medį
router.delete('/trinti-medi/:id', auth, (req, res) => medisController.deleteMedis(req, res));

module.exports = router;
