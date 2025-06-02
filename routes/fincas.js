// routes/fincas.js - Rutas de gestión de fincas
const express = require('express');
const { body, validationResult } = require('express-validator');

const Finca = require('../models/Finca');
const Ubicacion = require('../models/Ubicacion');
const { requireAuth, handleFlashMessages, checkResourceOwnership } = require('../middleware/auth');
const { uploadLogo, handleMulterError } = require('../middleware/config/multer');

const router = express.Router();

// Aplicar middleware de mensajes flash
router.use(handleFlashMessages);

// Ruta: GET /fincas/registro - Mostrar formulario de registro de finca
router.get('/registro', async (req, res) => {
    try {
        // Verificar si hay registro temporal de usuario
        if (!req.session.registro_temporal && !req.session.user) {
            req.session.error = {
                tipo: 'error',
                texto: 'Debe registrar un usuario primero'
            };
            return res.redirect('/usuarios/registro');
        }

        const estados = await Ubicacion.obtenerEstados();
        
        res.render('registro-finca', {
            title: 'Registro de Finca - Sistema Ganadero',
            estados: estados,
            usuario: req.session.registro_temporal || req.session.user
        });
        
    } catch (error) {
        console.error('Error cargando formulario de finca:', error);
        res.render('error', {
            title: 'Error',
            message: 'Error cargando el formulario de registro de finca'
        });
    }
});

// Ruta: POST /fincas/registro - Procesar registro de finca
router.post('/registro', [
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
        .withMessage('Estado inválido')
], async (req, res) => {
    try {
        // Validar errores de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('registro-finca', {
                title: 'Registro de Finca - Sistema Ganadero',
                error: {
                    tipo: 'error',
                    texto: errors.array()[0].msg
                },
                estados: estados,
                formData: req.body,
                usuario: req.session.registro_temporal || req.session.user
            });
        }

        const {
            nombre_finca, direccion_finca, latitud, longitud,
            estado_id, ciudad_id, municipio_id, parroquia_id
        } = req.body;

        // Determinar el usuario_id
        let usuarioId;
        if (req.session.registro_temporal) {
            usuarioId = req.session.registro_temporal.usuario_datos_id;
        } else if (req.session.user) {
            usuarioId = req.session.user.datos_id;
        } else {
            throw new Error('No se pudo determinar el usuario');
        }

        // Validar ubicaciones
        const validacionUbicacion = await Ubicacion.validarJerarquia(
            estado_id, ciudad_id, municipio_id, parroquia_id
        );

        if (!validacionUbicacion.valido) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('registro-finca', {
                title: 'Registro de Finca - Sistema Ganadero',
                error: {
                    tipo: 'error',
                    texto: validacionUbicacion.mensaje
                },
                estados: estados,
                formData: req.body,
                usuario: req.session.registro_temporal || req.session.user
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
                texto: 'Registro completado exitosamente. Ya puede iniciar sesión.'
            };
            
            return res.redirect('/auth/login');
        } else {
            // Si es un usuario autenticado agregando una finca
            req.session.success = {
                tipo: 'success',
                texto: 'Finca registrada exitosamente'
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
            usuario: req.session.registro_temporal || req.session.user
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

// Ruta: GET /fincas/:id/editar - Mostrar formulario de edición
router.get('/:id/editar', requireAuth, checkResourceOwnership('finca'), async (req, res) => {
    try {
        const fincaId = req.params.id;
        const finca = await Finca.buscarPorId(fincaId);
        const estados = await Ubicacion.obtenerEstados();
        
        if (!finca) {
            req.session.error = {
                tipo: 'error',
                texto: 'Finca no encontrada'
            };
            return res.redirect('/fincas/mis-fincas');
        }
        
        res.render('editar-finca', {
            title: `Editar ${finca.nombre_finca} - Sistema Ganadero`,
            finca: finca,
            estados: estados
        });
        
    } catch (error) {
        console.error('Error cargando formulario de edición:', error);
        req.session.error = {
            tipo: 'error',
            texto: 'Error cargando el formulario de edición'
        };
        res.redirect('/fincas/mis-fincas');
    }
});

// Ruta: POST /fincas/:id/editar - Procesar edición de finca
router.post('/:id/editar', [
    requireAuth,
    checkResourceOwnership('finca'),
    uploadLogo,
    handleMulterError,
    // Mismas validaciones que en registro
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
        .withMessage('Estado inválido')
], async (req, res) => {
    try {
        const fincaId = req.params.id;
        
        // Validar errores
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const finca = await Finca.buscarPorId(fincaId);
            const estados = await Ubicacion.obtenerEstados();
            
            return res.render('editar-finca', {
                title: `Editar ${finca.nombre_finca} - Sistema Ganadero`,
                error: {
                    tipo: 'error',
                    texto: errors.array()[0].msg
                },
                finca: finca,
                estados: estados,
                formData: req.body
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
            const finca = await Finca.buscarPorId(fincaId);
            const estados = await Ubicacion.obtenerEstados();
            
            return res.render('editar-finca', {
                title: `Editar ${finca.nombre_finca} - Sistema Ganadero`,
                error: {
                    tipo: 'error',
                    texto: validacionUbicacion.mensaje
                },
                finca: finca,
                estados: estados,
                formData: req.body
            });
        }

        // Preparar datos actualizados
        const datosActualizados = {
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

        // Actualizar finca
        const actualizado = await Finca.actualizar(fincaId, datosActualizados);

        if (actualizado) {
            req.session.success = {
                tipo: 'success',
                texto: 'Finca actualizada exitosamente'
            };
            res.redirect(`/fincas/${fincaId}`);
        } else {
            throw new Error('No se pudo actualizar la finca');
        }

    } catch (error) {
        console.error('Error actualizando finca:', error);
        req.session.error = {
            tipo: 'error',
            texto: 'Error actualizando la finca'
        };
        res.redirect('/fincas/mis-fincas');
    }
});

// Ruta: DELETE /fincas/:id - Eliminar finca
router.delete('/:id', requireAuth, checkResourceOwnership('finca'), async (req, res) => {
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