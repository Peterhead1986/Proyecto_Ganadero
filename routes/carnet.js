// routes/carnet.js
const express = require('express');
const router = express.Router();
const carnetController = require('../controllers/carnetController');
const { requireAuth } = require('../middleware/auth');

// Solo admin puede acceder
router.get('/:usuarioId', requireAuth, carnetController.generarCarnet);
// Selección de finca antes de generar carnet
router.get('/:usuarioId/seleccionar-finca', requireAuth, carnetController.seleccionarFinca);
// Carnet para finca específica
router.get('/:usuarioId/:fincaId', requireAuth, carnetController.generarCarnetFinca);

module.exports = router;
