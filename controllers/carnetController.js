// controllers/carnetController.js
const Usuario = require('../models/Usuario');
const Finca = require('../models/Finca');

// Solo admin puede generar carnet
exports.generarCarnet = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.rol !== 'admin') {
            return res.status(403).render('error', {
                title: 'No autorizado',
                message: 'Solo administradores pueden generar carnets.',
                error: { status: 403 }
            });
        }
        const usuarioId = req.params.usuarioId;
        const usuario = await Usuario.buscarPorId(usuarioId);
        if (!usuario) {
            return res.status(404).render('error', {
                title: 'Usuario no encontrado',
                message: 'No se encontró el usuario para generar el carnet.',
                error: { status: 404 }
            });
        }
        const fincas = await Finca.buscarPorUsuario(usuarioId);
        if (!fincas || fincas.length === 0) {
            // Renderizar carnet.ejs con finca: null para mostrar mensaje motivador
            return res.render('carnet', {
                title: 'Carnet Ganadero',
                usuario,
                finca: null,
                fondoColor: '#fff',
                tipoUsuario: usuario.rol || ''
            });
        }
        const finca = fincas[0]; // Por defecto, la primera finca
        res.render('carnet', {
            title: 'Carnet Ganadero',
            usuario,
            finca,
            fondoColor: '#fff',
            tipoUsuario: usuario.rol || ''
        });
    } catch (err) {
        res.status(500).render('error', {
            title: 'Error interno',
            message: 'Ocurrió un error inesperado.',
            error: err
        });
    }
};

// Selección de finca para carnet (vista intermedia)
exports.seleccionarFinca = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.rol !== 'admin') {
            return res.status(403).render('error', {
                title: 'No autorizado',
                message: 'Solo administradores pueden generar carnets.',
                error: { status: 403 }
            });
        }
        const usuarioId = req.params.usuarioId;
        const usuario = await Usuario.buscarPorId(usuarioId);
        if (!usuario) {
            return res.status(404).render('error', {
                title: 'Usuario no encontrado',
                message: 'No se encontró el usuario para generar el carnet.',
                error: { status: 404 }
            });
        }
        const fincas = await Finca.buscarPorUsuario(usuarioId);
        if (!fincas || fincas.length === 0) {
            // Renderizar carnet.ejs con finca: null para mostrar mensaje motivador
            return res.render('carnet', {
                title: 'Carnet Ganadero',
                usuario,
                finca: null,
                fondoColor: '#fff',
                tipoUsuario: usuario.rol || ''
            });
        }
        // Si solo tiene una finca, redirigir directo al carnet
        if (fincas.length === 1) {
            return res.redirect(`/carnet/${usuarioId}/${fincas[0].id_finca}`);
        }
        res.render('seleccionar-finca', {
            title: 'Seleccionar Finca',
            usuario,
            fincas,
            error: null
        });
    } catch (err) {
        res.status(500).render('error', {
            title: 'Error interno',
            message: 'Ocurrió un error inesperado.',
            error: err
        });
    }
};

// Generar carnet para finca específica
exports.generarCarnetFinca = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.rol !== 'admin') {
            return res.status(403).render('error', {
                title: 'No autorizado',
                message: 'Solo administradores pueden generar carnets.',
                error: { status: 403 }
            });
        }
        const usuarioId = req.params.usuarioId;
        const fincaId = req.params.fincaId;
        const usuario = await Usuario.buscarPorId(usuarioId);
        if (!usuario) {
            return res.status(404).render('error', {
                title: 'Usuario no encontrado',
                message: 'No se encontró el usuario para generar el carnet.',
                error: { status: 404 }
            });
        }
        const fincas = await Finca.buscarPorUsuario(usuarioId);
        const finca = fincas.find(f => String(f.id_finca) === String(fincaId));
        if (!finca) {
            return res.status(404).render('error', {
                title: 'Finca no encontrada',
                message: 'No se encontró la finca seleccionada para este usuario.',
                error: { status: 404 }
            });
        }
        res.render('carnet', {
            title: 'Carnet Ganadero',
            usuario,
            finca,
            fondoColor: '#fff',
            tipoUsuario: usuario.rol || ''
        });
    } catch (err) {
        res.status(500).render('error', {
            title: 'Error interno',
            message: 'Ocurrió un error inesperado.',
            error: err
        });
    }
};
