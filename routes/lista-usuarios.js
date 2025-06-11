// routes/lista-usuarios.js - Listado de usuarios para admins
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Ubicacion = require('../models/Ubicacion');
const { requireAuth } = require('../middleware/auth');
const listaUsuariosController = require('../controllers/listaUsuariosController');

// Solo admins pueden acceder
router.get('/', requireAuth, listaUsuariosController.listarUsuarios);

// Eliminar usuario (solo admin)
router.post('/eliminar/:id', requireAuth, async (req, res) => {
    console.log('Usuario en sesión (eliminar):', req.session.user);
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

// No se requieren cambios aquí, ya que la lógica de filtros y renderizado de municipio/parroquia está en el controlador. Confirmo que no hay validaciones ni referencias a municipio/parroquia en las rutas.

module.exports = router;
