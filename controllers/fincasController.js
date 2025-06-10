// controllers/fincasController.js
// Controlador dedicado para la gestión de fincas

const Finca = require('../models/Finca');
const Ubicacion = require('../models/Ubicacion');
const Usuario = require('../models/Usuario');

// Middleware para requerir rol admin (puede ser exportado si se usa en otros controladores)
function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.rol !== 'admin') {
        return res.status(403).render('error', {
            title: 'Acceso denegado',
            message: 'Solo los administradores pueden acceder a esta función.',
            error: { status: 403 }
        });
    }
    next();
}

// GET /fincas/registro
exports.mostrarFormularioRegistro = async (req, res, next) => {
    // Limpieza de variable de sesión temporal antes de mostrar el formulario
    if (req.session.registro_temporal) delete req.session.registro_temporal;
    if (req.query.usuario_id && (!req.session.user || req.session.user.rol !== 'admin')) {
        return res.status(403).render('error', {
            title: 'Acceso denegado',
            message: 'Solo los administradores pueden registrar fincas para otros usuarios.',
            error: { status: 403 }
        });
    }
    try {
        const estados = await Ubicacion.obtenerEstados();
        let usuario = null;
        let usuario_id = req.query.usuario_id;
        if (usuario_id) {
            usuario_id = parseInt(usuario_id);
            if (isNaN(usuario_id) || usuario_id < 1) {
                return res.status(400).render('error', {
                    title: 'Error',
                    message: 'El parámetro de usuario es inválido. Por favor, verifique e intente nuevamente.',
                    error: { status: 400 }
                });
            }
            if (!req.session.user || req.session.user.rol !== 'admin') {
                return res.status(403).render('error', {
                    title: 'Acceso denegado',
                    message: 'Solo los administradores pueden registrar fincas para otros usuarios.',
                    error: { status: 403 }
                });
            }
            usuario = await Usuario.buscarPorId(usuario_id);
            if (!usuario) {
                return res.status(404).render('error', {
                    title: 'Usuario no encontrado',
                    message: 'No se encontró el usuario especificado. Verifique el usuario e intente de nuevo.',
                    error: { status: 404 }
                });
            }
        }
        res.render('registro-finca', {
            title: 'Registro de Finca',
            estados,
            usuario,
            error: null
        });
    } catch (error) {
        console.error('Error cargando formulario de registro de finca:', error);
        res.render('error', {
            title: 'Error',
            message: 'Ocurrió un error al cargar el formulario de registro de finca. Por favor, intente nuevamente.',
            error: error || {}
        });
    }
};

// POST /fincas/registro
exports.registrarFinca = async (req, res) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    const estados = await Ubicacion.obtenerEstados();
    let usuario = null;
    let usuarioId = null;
    if (req.body.usuario_id) {
        usuarioId = parseInt(req.body.usuario_id);
        if (!req.session.user || req.session.user.rol !== 'admin') {
            return res.status(403).render('error', {
                title: 'Acceso denegado',
                message: 'Solo los administradores pueden registrar fincas para otros usuarios.',
                error: { status: 403 }
            });
        }
        if (isNaN(usuarioId) || usuarioId < 1) {
            return res.status(400).render('error', {
                title: 'Error',
                message: 'El usuario_id enviado es inválido.',
                error: { status: 400 }
            });
        }
        usuario = await Usuario.buscarPorId(usuarioId);
        if (!usuario) {
            return res.status(404).render('error', {
                title: 'Usuario no encontrado',
                message: 'El usuario especificado no existe.',
                error: { status: 404 }
            });
        }
    } else {
        return res.status(400).render('error', {
            title: 'Error',
            message: 'Debe especificar un usuario para registrar la finca.',
            error: { status: 400 }
        });
    }
    if (!errors.isEmpty()) {
        return res.render('registro-finca', {
            title: 'Registro de Finca - Sistema Ganadero',
            error: {
                tipo: 'error',
                texto: errors.array()[0].msg
            },
            estados: estados,
            formData: req.body,
            usuario: usuario,
            usuario_id: usuarioId
        });
    }
    const {
        nombre_finca, direccion_finca, latitud, longitud,
        estado_id, ciudad_id, municipio_id, parroquia_id
    } = req.body;
    // Validar ubicaciones
    const validacionUbicacion = await Ubicacion.validarJerarquia(
        estado_id, ciudad_id, municipio_id, parroquia_id
    );
    if (!validacionUbicacion.valido) {
        return res.render('registro-finca', {
            title: 'Registro de Finca - Sistema Ganadero',
            error: {
                tipo: 'error',
                texto: validacionUbicacion.mensaje
            },
            estados: estados,
            formData: req.body,
            usuario: usuario,
            usuario_id: usuarioId
        });
    }
    // Preparar datos de la finca
    const datosFinca = {
        usuario_id: usuarioId,
        nombre_finca,
        direccion_finca,
        latitud: latitud ? parseFloat(latitud) : null,
        longitud: longitud ? parseFloat(longitud) : null,
        estado_id: parseInt(estado_id),
        ciudad_id: ciudad_id ? parseInt(ciudad_id) : null,
        municipio_id: municipio_id ? parseInt(municipio_id) : null,
        parroquia_id: parroquia_id ? parseInt(parroquia_id) : null,
        hierro_finca: req.file ? req.file.filename : null
    };
    try {
        const fincaId = await Finca.crear(datosFinca);
        req.session.success = {
            tipo: 'success',
            texto: 'Finca registrada exitosamente para el usuario.'
        };
        return res.redirect('/lista-usuarios');
    } catch (error) {
        console.error('Error registrando finca:', error);
        return res.render('registro-finca', {
            title: 'Registro de Finca - Sistema Ganadero',
            error: {
                tipo: 'error',
                texto: 'Error interno del servidor. Intente nuevamente.'
            },
            estados: estados,
            formData: req.body,
            usuario: usuario,
            usuario_id: usuarioId
        });
    }
};

// Exportar utilidades si se usan en otros controladores
exports.requireAdmin = requireAdmin;
