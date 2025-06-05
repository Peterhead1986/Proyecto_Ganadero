// routes/listado_fincas.js - Listado general de fincas
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Finca = require('../models/Finca');

// GET /listado-fincas - Listado general de fincas (solo autenticados)
router.get('/', requireAuth, async (req, res) => {
    try {
        const fincas = await Finca.obtenerListadoCompleto();
        res.render('listado_fincas', {
            fincas,
            usuario: req.session.user // Para el header
        });
    } catch (error) {
        console.error('Error obteniendo listado de fincas:', error);
        res.render('error', {
            title: 'Error',
            message: 'No se pudo cargar el listado de fincas'
        });
    }
});

module.exports = router;
