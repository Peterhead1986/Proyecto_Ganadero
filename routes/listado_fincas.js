// routes/listado_fincas.js - Listado general de fincas
const express = require('express');
const router = express.Router();
const Finca = require('../models/Finca');
const Ubicacion = require('../models/Ubicacion');
const { requireAuth } = require('../middleware/auth');
const listadoFincasController = require('../controllers/listadoFincasController');

// GET /listado-fincas - Listado general de fincas (solo autenticados)
router.get('/', requireAuth, listadoFincasController.listarFincas);

module.exports = router;
