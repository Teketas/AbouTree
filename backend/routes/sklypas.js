const express = require('express');
const router = express.Router();
const sklypasController = require('../taksavimas/SklypasController');
const auth = require('../middleware/auth');

// Sukurti naują sklypą
router.post('/sukurti-sklypa', auth, (req, res) => sklypasController.createSklypas(req, res));

// Gauti visus sklypus pagal mišką
router.get('/sklypai/miskas/:miskoId', auth, (req, res) => sklypasController.getSkypasByMiskas(req, res));

// Atnaujinti sklypą
router.put('/atnaujinti-sklypa/:id', auth, (req, res) => sklypasController.updateSklypas(req, res));

// Ištrinti sklypą
router.delete('/istrinti-sklypa/:id', auth, (req, res) => sklypasController.deleteSklypas(req, res));

// Apskaičiuoti kubatūrą
router.post('/apskaiciuoti-kubatura/:id', auth, (req, res) => sklypasController.calculateKubatura(req, res));

// Apskaičiuoti skalsumą
router.post('/apskaiciuoti-skalsuma/:id', auth, (req, res) => sklypasController.calculateSkalsumas(req, res));

module.exports = router;
