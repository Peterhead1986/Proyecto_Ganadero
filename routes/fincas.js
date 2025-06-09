// routes/fincas.js - Rutas de gestión de fincas
const express = require('express');
const { body, validationResult } = require('express-validator');

const Finca = require('../models/Finca');
const Ubicacion = require('../models/Ubicacion');
const Usuario = require('../models/Usuario');
const { requireAuth, checkResourceOwnership } = require('../middleware/auth');
const { uploadLogo, handleMulterError } = require('../middleware/config/multer');

const router = express.Router();

// Middleware para requerir rol admin
function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.rol !== 'admin') {
        return res.status(403).render('error', {
            title: 'Acceso denegado',
            message: 'Solo los administradores pueden acceder a esta función.'
        });
    }
    next();
}

// Ruta: GET /fincas/registro - Mostrar formulario de registro de finca (admin puede pasar usuario_id)
router.get('/registro', requireAuth, async (req, res, next) => {
    // Solo admins pueden registrar fincas para otros usuarios
    if (req.query.usuario_id && (!req.session.user || req.session.user.rol !== 'admin')) {
        return res.status(403).render('error', {
            title: 'Acceso denegado',
            message: 'Solo los administradores pueden registrar fincas para otros usuarios.'
        });
    }
    next();
}, async (req, res) => {
    try {
        const estados = await Ubicacion.obtenerEstados();
        let usuario = null;
        let usuario_id = req.query.usuario_id;
        // LOG de depuración para ver qué llega desde la lista de usuarios
        console.log('[DEBUG] GET /fincas/registro usuario_id recibido:', usuario_id);
        if (usuario_id) {
            usuario_id = parseInt(usuario_id);
            console.log('[DEBUG] GET /fincas/registro usuario_id parseado:', usuario_id);
            if (isNaN(usuario_id) || usuario_id < 1) {
                return res.status(400).render('error', {
                    title: 'Error',
                    message: 'El parámetro usuario_id es inválido.'
                });
            }
            // Solo admins pueden registrar finca para otro usuario
            if (!req.session.user || req.session.user.rol !== 'admin') {
                return res.status(403).render('error', {
                    title: 'Acceso denegado',
                    message: 'Solo los administradores pueden registrar fincas para otros usuarios.'
                });
            }
            usuario = await Usuario.buscarPorId(usuario_id);
            console.log('[DEBUG] GET /fincas/registro usuario encontrado:', usuario);
            if (!usuario) {
                return res.status(404).render('error', {
                    title: 'Usuario no encontrado',
                    message: 'El usuario especificado no existe.'
                });
            }
        } else {
            usuario = req.session.registro_temporal || req.session.user;
            usuario_id = usuario ? usuario.datos_id : null;
        }
        if (!usuario_id || isNaN(usuario_id) || usuario_id < 1) {
            return res.status(400).render('error', {
                title: 'Error',
                message: 'No se pudo determinar el usuario para la finca (usuario_id inválido).'
            });
        }
        res.render('registro-finca', {
            title: 'Registro de Finca - Sistema Ganadero',
            estados: estados,
            usuario: usuario,
            usuario_id: usuario_id
        });
    } catch (error) {
        console.error('Error cargando formulario de registro de finca:', error);
        res.render('error', {
            title: 'Error',
            message: 'Error cargando el formulario de registro de finca',
            error: error || {}
        });
    }
});

// Ruta: POST /fincas/registro - Procesar registro de finca (admin puede asignar usuario)
router.post('/registro', requireAuth, async (req, res, next) => {
    // Solo admins pueden crear fincas para otros usuarios
    if (req.body.usuario_id && (!req.session.user || req.session.user.rol !== 'admin')) {
        return res.status(403).render('error', {
            title: 'Acceso denegado',
            message: 'Solo los administradores pueden registrar fincas para otros usuarios.'
        });
    }
    next();
}, [
    uploadLogo,
    handleMulterError,
    // Validaciones
    body('nombre_finca')
        .trim()
        .notEmpty()
        .withMessage('El nombre de la finca es requerido')
        .isLength({ min: 2, max: 150 })
        .withMessage('El nombre de la finca debe tener entre 2 y 150 caracteres'),
    body('direccion_finca')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La dirección no puede exceder 500 caracteres'),
    body('latitud')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('La latitud debe estar entre -90 y 90'),
    body('longitud')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('La longitud debe estar entre -180 y 180'),
    body('estado_id')
        .notEmpty()
        .withMessage('Debe seleccionar un estado')
        .isInt({ min: 1 })
        .withMessage('Estado inválido'),
    body('usuario_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Usuario inválido')
], async (req, res) => {
    try {
        // Validar errores de entrada
        const errors = validationResult(req);
        const estados = await Ubicacion.obtenerEstados();
        let usuario = null;
        let usuarioId = null;
        if (req.body.usuario_id) {
            usuarioId = parseInt(req.body.usuario_id);
            if (!req.session.user || req.session.user.rol !== 'admin') {
                return res.status(403).render('error', {
                    title: 'Acceso denegado',
                    message: 'Solo los administradores pueden registrar fincas para otros usuarios.'
                });
            }
            if (isNaN(usuarioId) || usuarioId < 1) {
                return res.status(400).render('error', {
                    title: 'Error',
                    message: 'El usuario_id enviado es inválido.'
                });
            }
            usuario = await Usuario.buscarPorId(usuarioId);
            if (!usuario) {
                return res.status(404).render('error', {
                    title: 'Usuario no encontrado',
                    message: 'El usuario especificado no existe.'
                });
            }
        } else if (req.session.registro_temporal && req.session.registro_temporal.usuario_datos_id) {
            usuario = req.session.registro_temporal;
            usuarioId = parseInt(usuario.usuario_datos_id);
        } else if (req.session.user && req.session.user.datos_id) {
            usuario = req.session.user;
            usuarioId = parseInt(usuario.datos_id);
        } else {
            console.error('No se pudo determinar el usuario para la finca. req.body.usuario_id:', req.body.usuario_id, 'req.session:', req.session);
            return res.status(400).render('error', {
                title: 'Error',
                message: 'No se pudo determinar el usuario para la finca.'
            });
        }
        if (!usuarioId || isNaN(usuarioId) || usuarioId < 1) {
            console.error('usuarioId es null o inválido en registro de finca. req.body:', req.body, 'req.session:', req.session);
            return res.status(400).render('error', {
                title: 'Error',
                message: 'No se pudo determinar el usuario para la finca (usuarioId inválido).'
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
            logo_finca: req.file ? req.file.filename : null
        };

        // Crear finca
        const fincaId = await Finca.crear(datosFinca);

        console.log(`✅ Finca registrada: ${nombre_finca} (ID: ${fincaId})`);

        // Si es un registro nuevo completo
        if (req.session.registro_temporal) {
            // Limpiar registro temporal
            delete req.session.registro_temporal;
            req.session.success = {
                tipo: 'success',
                texto: '¡Registro de finca exitoso! Ya puede iniciar sesión.'
            };
            return res.redirect('/auth/login');
        } else if (req.session.user && req.session.user.rol === 'admin' && req.body.usuario_id) {
            req.session.success = {
                tipo: 'success',
                texto: 'Finca registrada exitosamente para el usuario.'
            };
            return res.redirect('/lista-usuarios');
        } else {
            req.session.success = {
                tipo: 'success',
                texto: 'Finca registrada exitosamente.'
            };
            return res.redirect('/auth/dashboard');
        }

    } catch (error) {
        console.error('Error registrando finca:', error);
        
        const estados = await Ubicacion.obtenerEstados();
        res.render('registro-finca', {
            title: 'Registro de Finca - Sistema Ganadero',
            error: {
                tipo: 'error',
                texto: 'Error interno del servidor. Intente nuevamente.'
            },
            estados: estados,
            formData: req.body,
            usuario: null,
            usuario_id: req.body.usuario_id || null
        });
    }
});

// Ruta: GET /fincas/mis-fincas - Ver fincas del usuario autenticado
router.get('/mis-fincas', requireAuth, async (req, res) => {
    try {
        const usuarioId = req.session.user.datos_id;
        const fincas = await Finca.buscarPorUsuario(usuarioId);
        
        res.render('mis-fincas', {
            title: 'Mis Fincas - Sistema Ganadero',
            fincas: fincas
        });
        
    } catch (error) {
        console.error('Error obteniendo fincas del usuario:', error);
        req.session.error = {
            tipo: 'error',
            texto: 'Error cargando sus fincas'
        };
        res.redirect('/auth/dashboard');
    }
});

// Ruta: GET /fincas/:id - Ver detalles de una finca específica
router.get('/:id', requireAuth, checkResourceOwnership('finca'), async (req, res) => {
    try {
        const fincaId = req.params.id;
        const finca = await Finca.buscarPorId(fincaId);
        
        if (!finca) {
            req.session.error = {
                tipo: 'error',
                texto: 'Finca no encontrada'
            };
            return res.redirect('/fincas/mis-fincas');
        }
        
        res.render('detalle-finca', {
            title: `${finca.nombre_finca} - Sistema Ganadero`,
            finca: finca
        });
        
    } catch (error) {
        console.error('Error obteniendo detalles de finca:', error);
        req.session.error = {
            tipo: 'error',
            texto: 'Error cargando los detalles de la finca'
        };
        res.redirect('/fincas/mis-fincas');
    }
});

// Ruta: GET /fincas/:id/editar - Mostrar formulario de edición de finca
router.get('/:id/editar', requireAuth, requireAdmin, async (req, res) => {
    try {
        const fincaId = parseInt(req.params.id);
        if (isNaN(fincaId) || fincaId < 1) {
            return res.status(400).render('error', {
                title: 'Error',
                message: 'ID de finca inválido.'
            });
        }
        const finca = (await Finca.obtenerListadoCompleto()).find(f => f.id === fincaId);
        if (!finca) {
            return res.status(404).render('error', {
                title: 'Finca no encontrada',
                message: 'No existe una finca con ese ID.'
            });
        }
        const estados = await Ubicacion.obtenerEstados();
        // Cargar ciudades, municipios y parroquias para selects
        const ciudades = await Ubicacion.obtenerCiudadesPorEstado(finca.estado_id);
        const municipios = await Ubicacion.obtenerMunicipiosPorEstado(finca.estado_id);
        const parroquias = await Ubicacion.obtenerParroquiasPorMunicipio(finca.municipio_id);
        console.log('GET - Mensaje de éxito en sesión antes de render:', req.session.success);
        res.render('editar-finca', {
            title: 'Editar Finca',
            finca,
            estados,
            ciudades,
            municipios,
            parroquias,
            success: req.session.success,
            error: req.session.error
        });
        console.log('GET - Mensaje de éxito en sesión después de render:', req.session.success);
        delete req.session.success;
        delete req.session.error;
    } catch (error) {
        console.error('Error mostrando formulario de edición de finca:', error);
        res.render('error', {
            title: 'Error',
            message: 'Error mostrando el formulario de edición de finca',
            error: error || {}
        });
    }
});

// Ruta: POST /fincas/:id/editar - Procesar edición de finca (optimizada y validada)
router.post('/:id/editar', requireAuth, requireAdmin, uploadLogo, handleMulterError, async (req, res) => {
    try {
        const fincaId = parseInt(req.params.id);
        if (isNaN(fincaId) || fincaId < 1) {
            return res.status(400).render('error', {
                title: 'Error',
                message: 'ID de finca inválido.'
            });
        }
        // Validar existencia de la finca
        const fincaActual = (await Finca.obtenerListadoCompleto()).find(f => f.id === fincaId);
        if (!fincaActual) {
            return res.status(404).render('error', {
                title: 'Finca no encontrada',
                message: 'No existe una finca con ese ID.'
            });
        }
        // Validar campos obligatorios
        if (!req.body.nombre_finca || req.body.nombre_finca.length < 2) {
            req.session.error = { texto: 'El nombre de la finca es obligatorio y debe tener al menos 2 caracteres.' };
            return res.redirect(`/fincas/${fincaId}/editar`);
        }
        if (!req.body.estado_id || isNaN(parseInt(req.body.estado_id))) {
            req.session.error = { texto: 'Debe seleccionar un estado válido.' };
            return res.redirect(`/fincas/${fincaId}/editar`);
        }
        // Validar ubicaciones
        const validacionUbicacion = await Ubicacion.validarJerarquia(
            req.body.estado_id, req.body.ciudad_id, req.body.municipio_id, req.body.parroquia_id
        );
        if (!validacionUbicacion.valido) {
            req.session.error = { texto: validacionUbicacion.mensaje };
            return res.redirect(`/fincas/${fincaId}/editar`);
        }
        // Preparar datos actualizados
        const datosFinca = {
            nombre_finca: req.body.nombre_finca,
            direccion_finca: req.body.direccion_finca,
            latitud: req.body.latitud ? parseFloat(req.body.latitud) : null,
            longitud: req.body.longitud ? parseFloat(req.body.longitud) : null,
            estado_id: parseInt(req.body.estado_id),
            ciudad_id: req.body.ciudad_id ? parseInt(req.body.ciudad_id) : null,
            municipio_id: req.body.municipio_id ? parseInt(req.body.municipio_id) : null,
            parroquia_id: req.body.parroquia_id ? parseInt(req.body.parroquia_id) : null,
            logo_finca: req.file ? req.file.filename : fincaActual.logo_finca
        };
        // Guardar en base de datos
        const actualizado = await Finca.actualizar(fincaId, datosFinca);
        if (actualizado) {
            req.session.success = { texto: 'Datos guardados con éxito' };
            console.log('POST - Mensaje de éxito en sesión:', req.session.success);
        } else {
            req.session.error = { texto: 'No se realizaron cambios en la finca.' };
        }
        res.redirect(`/fincas/${fincaId}/editar`);
    } catch (error) {
        console.error('Error actualizando finca:', error);
        req.session.error = { texto: 'Error actualizando la finca.' };
        res.redirect(`/fincas/${req.params.id}/editar`);
    }
});

// Ruta: DELETE /fincas/:id - Eliminar finca
router.delete('/:id', requireAuth, async (req, res, next) => {
    if (req.session.user && req.session.user.rol === 'admin') {
        return next();
    }
    // Si no es admin, solo puede eliminar si es propietario
    return checkResourceOwnership('finca')(req, res, next);
}, async (req, res) => {
    try {
        const fincaId = req.params.id;
        const eliminado = await Finca.eliminar(fincaId);
        
        if (eliminado) {
            res.json({
                success: true,
                message: 'Finca eliminada exitosamente'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la finca'
            });
        }
        
    } catch (error) {
        console.error('Error eliminando finca:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Ruta: POST /fincas/:id/eliminar - Eliminar finca (compatibilidad con formularios clásicos)
router.post('/:id/eliminar', requireAuth, checkResourceOwnership('finca'), async (req, res) => {
    try {
        const fincaId = req.params.id;
        const eliminado = await Finca.eliminar(fincaId);
        if (eliminado) {
            req.session.success = {
                tipo: 'success',
                texto: 'Finca eliminada exitosamente'
            };
            return res.redirect('/listado-fincas');
        } else {
            req.session.error = {
                tipo: 'error',
                texto: 'No se pudo eliminar la finca'
            };
            return res.redirect('/listado-fincas');
        }
    } catch (error) {
        console.error('Error eliminando finca (POST):', error);
        req.session.error = {
            tipo: 'error',
            texto: 'Error interno del servidor'
        };
        return res.redirect('/listado-fincas');
    }
});

// Ruta: GET /fincas/nueva - Agregar nueva finca (usuario autenticado)
router.get('/nueva', requireAuth, async (req, res) => {
    try {
        const estados = await Ubicacion.obtenerEstados();
        
        res.render('nueva-finca', {
            title: 'Agregar Nueva Finca - Sistema Ganadero',
            estados: estados
        });
        
    } catch (error) {
        console.error('Error cargando formulario de nueva finca:', error);
        req.session.error = {
            tipo: 'error',
            texto: 'Error cargando el formulario'
        };
        res.redirect('/auth/dashboard');
    }
});

// Ruta: POST /fincas/nueva - Procesar nueva finca
router.post('/nueva', [
    requireAuth,
    uploadLogo,
    handleMulterError,
    // Mismas validaciones que en registro
    body('nombre_finca')
        .trim()
        .notEmpty()
        .withMessage('El nombre de la finca es requerido')
        .isLength({ min: 2, max: 150 })
        .withMessage('El nombre de la finca debe tener entre 2 y 150 caracteres'),
    
    body('estado_id')
        .notEmpty()
        .withMessage('Debe seleccionar un estado')
        .isInt({ min: 1 })
        .withMessage('Estado inválido')
], async (req, res) => {
    try {
        // Validar errores
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('nueva-finca', {
                title: 'Agregar Nueva Finca - Sistema Ganadero',
                error: {
                    tipo: 'error',
                    texto: errors.array()[0].msg
                },
                estados: estados,
                formData: req.body
            });
        }

        const {
            nombre_finca, direccion_finca, latitud, longitud,
            estado_id, ciudad_id, municipio_id, parroquia_id
        } = req.body;

        const usuarioId = req.session.user.datos_id;

        // Preparar datos
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
            logo_finca: req.file ? req.file.filename : null
        };

        // Crear finca
        const fincaId = await Finca.crear(datosFinca);

        req.session.success = {
            tipo: 'success',
            texto: 'Nueva finca agregada exitosamente'
        };

        res.redirect('/fincas/mis-fincas');

    } catch (error) {
        console.error('Error creando nueva finca:', error);
        req.session.error = {
            tipo: 'error',
            texto: 'Error creando la finca'
        };
        res.redirect('/auth/dashboard');
    }
});

module.exports = router;