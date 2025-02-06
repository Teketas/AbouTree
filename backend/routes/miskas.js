const express = require('express');
const router = express.Router();
const MiskasController = require('../taksavimas/MiskasController');

// Sukurti naują mišką
router.post('/miskas', MiskasController.createMiskas);

// Atnaujinti miško pavadinimą
router.put('/miskas/:id', MiskasController.updateMiskasPavadinimas);

// Gauti visus vartotojo miškus
router.get('/miskas/user/:userId', MiskasController.getMiskasByUser);

module.exports = router;
