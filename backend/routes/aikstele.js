const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aiksteleController = require('../taksavimas/AiksteleController');

// Gauti visas aikšteles pagal sklypą
router.get('/aiksteles/sklypas/:sklypoId', auth, aiksteleController.getAikstelesBySklypas);

// Sukurti naują aikštelę
router.post('/sukurti-aikstele', auth, aiksteleController.createAikstele);

// Ištrinti aikštelę
router.delete('/trinti-aikstele/:id', auth, aiksteleController.deleteAikstele);

module.exports = router;