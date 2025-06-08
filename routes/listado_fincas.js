// routes/listado_fincas.js - Listado general de fincas
const express = require('express');
const router = express.Router();
const Finca = require('../models/Finca');
const Ubicacion = require('../models/Ubicacion');
const { requireAuth } = require('../middleware/auth');

// GET /listado-fincas - Listado general de fincas (solo autenticados)
router.get('/', requireAuth, async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const filtro = req.query.filtro || '';
        const estado_id = req.query.estado_id || '';
        const ciudad_id = req.query.ciudad_id || '';
        const municipio_id = req.query.municipio_id || '';
        const parroquia_id = req.query.parroquia_id || '';
        const limite = 10;
        const { fincas, total } = await Finca.obtenerPaginado({ pagina, limite, filtro, estado_id, ciudad_id, municipio_id, parroquia_id });
        const totalPaginas = Math.ceil(total / limite);
        // Para los selects de filtro
        const estados = await Ubicacion.obtenerEstados();
        let ciudades = [], municipios = [], parroquias = [];
        if (estado_id) ciudades = await Ubicacion.obtenerCiudadesPorEstado(estado_id);
        if (ciudad_id) municipios = await Ubicacion.obtenerMunicipiosPorCiudad(ciudad_id);
        if (municipio_id) parroquias = await Ubicacion.obtenerParroquiasPorMunicipio(municipio_id);
        res.render('listado_fincas', {
            title: 'Listado de Fincas',
            fincas,
            pagina,
            totalPaginas,
            filtro,
            estado_id,
            ciudad_id,
            municipio_id,
            parroquia_id,
            estados,
            ciudades,
            municipios,
            parroquias,
            usuario: req.session.user // Para el header
        });
    } catch (error) {
        console.error('Error obteniendo listado de fincas:', error);
        res.render('error', {
            title: 'Error',
            message: 'No se pudo cargar el listado de fincas',
            error: error || {}
        });
    }
});

module.exports = router;
