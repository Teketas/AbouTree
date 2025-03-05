const express = require('express');
const router = express.Router();
const rusisController = require('../taksavimas/RusisController');
const auth = require('../middleware/auth');

// Sukurti naują rūšį
router.post('/sukurti-rusi', auth, (req, res) => rusisController.createRusis(req, res));

// Gauti visas rūšis pagal aikštelę
router.get('/rusys/aikstele/:aiksteleId', auth, (req, res) => rusisController.getRusisByAikstele(req, res));

// Atnaujinti rūšį
router.put('/atnaujinti-rusi/:id', auth, (req, res) => rusisController.updateRusis(req, res));

// Ištrinti rūšį
router.delete('/trinti-rusi/:id', auth, (req, res) => rusisController.deleteRusis(req, res));

// Atnaujinti rūšies vidurkius
router.put('/atnaujinti-vidurkius/:id', auth, (req, res) => rusisController.updateRusisAverages(req, res));

module.exports = router;
