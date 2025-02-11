const express = require('express');
const router = express.Router();
const miskasController = require('../taksavimas/MiskasController');
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth');

// Sukurti naują mišką
router.post('/sukurti-miskas', auth, (req, res) => miskasController.createMiskas(req, res));

// Atnaujinti miško pavadinimą
router.put('/atnaujinti-miska/:id', (req, res) => miskasController.updateMiskasPavadinimas(req, res));

// Gauti visus vartotojo miškus
router.get('/user/:userId', (req, res) => miskasController.getMiskasByUser(req, res));

// Ištrinti mišką
router.delete('/istrinti-miska/:id', auth, (req, res) => miskasController.deleteMiskas(req, res));

module.exports = router;
