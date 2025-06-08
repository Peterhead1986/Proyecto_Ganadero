// routes/lista-usuarios.js - Listado de usuarios para admins
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Ubicacion = require('../models/Ubicacion');
const { requireAuth } = require('../middleware/auth');

// Solo admins pueden acceder
router.get('/', requireAuth, async (req, res) => {
    if (!req.session.user || req.session.user.rol !== 'admin') {
        return res.status(403).render('error', {
            title: 'No autorizado',
            message: 'Solo administradores pueden ver la lista de usuarios.'
        });
    }
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const filtro = req.query.filtro || '';
        const estado_id = req.query.estado_id || '';
        const ciudad_id = req.query.ciudad_id || '';
        const municipio_id = req.query.municipio_id || '';
        const parroquia_id = req.query.parroquia_id || '';
        const limite = 10;
        const { usuarios, total } = await Usuario.obtenerPaginado({ pagina, limite, filtro, estado_id, ciudad_id, municipio_id, parroquia_id });
        const totalPaginas = Math.ceil(total / limite);
        // Para los selects de filtro
        const estados = await Ubicacion.obtenerEstados();
        let ciudades = [], municipios = [], parroquias = [];
        if (estado_id) ciudades = await Ubicacion.obtenerCiudadesPorEstado(estado_id);
        if (ciudad_id) municipios = await Ubicacion.obtenerMunicipiosPorCiudad(ciudad_id);
        if (municipio_id) parroquias = await Ubicacion.obtenerParroquiasPorMunicipio(municipio_id);
        res.render('lista-usuarios', {
            title: 'Lista de Usuarios',
            usuarios,
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
            success: req.session.success
        });
        delete req.session.success;
    } catch (error) {
        console.error('Error listando usuarios:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'No se pudo cargar la lista de usuarios.'
        });
    }
});

// Eliminar usuario (solo admin)
router.post('/eliminar/:id', requireAuth, async (req, res) => {
    if (!req.session.user || req.session.user.rol !== 'admin') {
        return res.status(403).render('error', {
            title: 'No autorizado',
            message: 'Solo administradores pueden eliminar usuarios.'
        });
    }
    try {
        const id = req.params.id;
        await Usuario.eliminarPorDatosId(id);
        req.session.success = {
            tipo: 'success',
            texto: 'Usuario eliminado correctamente.'
        };
        res.redirect('/lista-usuarios');
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'No se pudo eliminar el usuario.'
        });
    }
});

module.exports = router;
