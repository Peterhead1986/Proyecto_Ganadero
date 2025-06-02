// routes/usuarios.js - Rutas de gestión de usuarios
const express = require('express');
const { body, validationResult } = require('express-validator');

const Usuario = require('../models/Usuario');
const Ubicacion = require('../models/Ubicacion');
const { requireGuest, handleFlashMessages } = require('../middleware/auth');
const { uploadProfile, handleMulterError } = require('../middleware/config/multer');

const router = express.Router();

// Aplicar middleware de mensajes flash
router.use(handleFlashMessages);

// Ruta: GET /usuarios/registro - Mostrar formulario de registro de usuario
router.get('/registro', requireGuest, async (req, res) => {
    try {
        const estados = await Ubicacion.obtenerEstados();
        
        res.render('registro-usuario', {
            title: 'Registro de Usuario - Sistema Ganadero',
            estados: estados
        });
        
    } catch (error) {
        console.error('Error cargando formulario de registro:', error);
        res.render('error', {
            title: 'Error',
            message: 'Error cargando el formulario de registro'
        });
    }
});

// Ruta: POST /usuarios/registro - Procesar registro de usuario
router.post('/registro', [
    requireGuest,
    uploadProfile,
    handleMulterError,
    // Validaciones
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('apellido')
        .trim()
        .notEmpty()
        .withMessage('El apellido es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El apellido debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El apellido solo puede contener letras y espacios'),
    
    body('correo')
        .trim()
        .isEmail()
        .withMessage('Debe proporcionar un correo válido')
        .normalizeEmail(),
    
    body('tipo_documento')
        .isIn(['cedula', 'rif_juridico'])
        .withMessage('Tipo de documento inválido'),
    
    body('numero_documento')
        .trim()
        .notEmpty()
        .withMessage('El número de documento es requerido')
        .isLength({ min: 7, max: 20 })
        .withMessage('El número de documento debe tener entre 7 y 20 caracteres')
        .matches(/^[0-9\-]+$/)
        .withMessage('El número de documento solo puede contener números y guiones'),
    
    body('direccion')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La dirección no puede exceder 500 caracteres'),
    
    body('estado_id')
        .notEmpty()
        .withMessage('Debe seleccionar un estado')
        .isInt({ min: 1 })
        .withMessage('Estado inválido'),
    
    body('nombre_usuario')
        .trim()
        .notEmpty()
        .withMessage('El nombre de usuario es requerido')
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número'),
    
    body('password_confirmar')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('La confirmación de contraseña no coincide');
            }
            return true;
        })
], async (req, res) => {
    try {
        // Validar errores de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('registro-usuario', {
                title: 'Registro de Usuario - Sistema Ganadero',
                error: {
                    tipo: 'error',
                    texto: errors.array()[0].msg
                },
                estados: estados,
                formData: req.body
            });
        }

        const {
            nombre, apellido, correo, tipo_documento, numero_documento,
            direccion, estado_id, ciudad_id, municipio_id, parroquia_id,
            nombre_usuario, password
        } = req.body;

        // Validar ubicaciones
        const validacionUbicacion = await Ubicacion.validarJerarquia(
            estado_id, ciudad_id, municipio_id, parroquia_id
        );

        if (!validacionUbicacion.valido) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('registro-usuario', {
                title: 'Registro de Usuario - Sistema Ganadero',
                error: {
                    tipo: 'error',
                    texto: validacionUbicacion.mensaje
                },
                estados: estados,
                formData: req.body
            });
        }

        // Verificar unicidad
        const existeUsuario = await Usuario.existeNombreUsuario(nombre_usuario);
        if (existeUsuario) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('registro-usuario', {
                title: 'Registro de Usuario - Sistema Ganadero',
                error: {
                    tipo: 'error',
                    texto: 'El nombre de usuario ya está en uso'
                },
                estados: estados,
                formData: req.body
            });
        }

        const existeCorreo = await Usuario.existeCorreo(correo);
        if (existeCorreo) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('registro-usuario', {
                title: 'Registro de Usuario - Sistema Ganadero',
                error: {
                    tipo: 'error',
                    texto: 'El correo electrónico ya está registrado'
                },
                estados: estados,
                formData: req.body
            });
        }

        const existeDocumento = await Usuario.existeDocumento(numero_documento);
        if (existeDocumento) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('registro-usuario', {
                title: 'Registro de Usuario - Sistema Ganadero',
                error: {
                    tipo: 'error',
                    texto: 'El número de documento ya está registrado'
                },
                estados: estados,
                formData: req.body
            });
        }

        // Preparar datos
        const datosLogin = {
            nombre_usuario,
            password
        };

        const datosPersonales = {
            nombre,
            apellido,
            correo,
            tipo_documento,
            numero_documento,
            direccion,
            estado_id: parseInt(estado_id),
            ciudad_id: ciudad_id ? parseInt(ciudad_id) : null,
            municipio_id: municipio_id ? parseInt(municipio_id) : null,
            parroquia_id: parroquia_id ? parseInt(parroquia_id) : null,
            foto_perfil: req.file ? req.file.filename : null
        };

        // Crear usuario
        const resultado = await Usuario.crear(datosLogin, datosPersonales);

        // Guardar ID en sesión temporal para el registro de finca
        req.session.registro_temporal = {
            usuario_datos_id: resultado.usuario_datos_id,
            nombre: nombre,
            apellido: apellido
        };

        console.log(`✅ Usuario registrado: ${nombre_usuario} (ID: ${resultado.usuario_datos_id})`);

        req.session.success = {
            tipo: 'success',
            texto: 'Usuario registrado exitosamente. Ahora registre su finca.'
        };

        res.redirect('/fincas/registro');

    } catch (error) {
        console.error('Error registrando usuario:', error);
        
        const estados = await Ubicacion.obtenerEstados();
        res.render('registro-usuario', {
            title: 'Registro de Usuario - Sistema Ganadero',
            error: {
                tipo: 'error',
                texto: 'Error interno del servidor. Intente nuevamente.'
            },
            estados: estados,
            formData: req.body
        });
    }
});

// Ruta: GET /usuarios/ubicaciones/ciudades/:estadoId - API para obtener ciudades
router.get('/ubicaciones/ciudades/:estadoId', async (req, res) => {
    try {
        const estadoId = req.params.estadoId;
        const ciudades = await Ubicacion.obtenerCiudadesPorEstado(estadoId);
        
        res.json({
            success: true,
            ciudades: ciudades
        });
        
    } catch (error) {
        console.error('Error obteniendo ciudades:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo ciudades'
        });
    }
});

// Ruta: GET /usuarios/ubicaciones/municipios/:ciudadId - API para obtener municipios
router.get('/ubicaciones/municipios/:ciudadId', async (req, res) => {
    try {
        const ciudadId = req.params.ciudadId;
        const municipios = await Ubicacion.obtenerMunicipiosPorCiudad(ciudadId);
        
        res.json({
            success: true,
            municipios: municipios
        });
        
    } catch (error) {
        console.error('Error obteniendo municipios:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo municipios'
        });
    }
});

// Ruta: GET /usuarios/ubicaciones/parroquias/:municipioId - API para obtener parroquias
router.get('/ubicaciones/parroquias/:municipioId', async (req, res) => {
    try {
        const municipioId = req.params.municipioId;
        const parroquias = await Ubicacion.obtenerParroquiasPorMunicipio(municipioId);
        
        res.json({
            success: true,
            parroquias: parroquias
        });
        
    } catch (error) {
        console.error('Error obteniendo parroquias:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo parroquias'
        });
    }
});

// Ruta: POST /usuarios/validar-campo - Validar campos únicos en tiempo real
router.post('/validar-campo', async (req, res) => {
    try {
        const { campo, valor } = req.body;
        let existe = false;
        let mensaje = '';

        switch (campo) {
            case 'nombre_usuario':
                existe = await Usuario.existeNombreUsuario(valor);
                mensaje = existe ? 'Este nombre de usuario ya está en uso' : 'Nombre de usuario disponible';
                break;
            case 'correo':
                existe = await Usuario.existeCorreo(valor);
                mensaje = existe ? 'Este correo ya está registrado' : 'Correo disponible';
                break;
            case 'numero_documento':
                existe = await Usuario.existeDocumento(valor);
                mensaje = existe ? 'Este documento ya está registrado' : 'Documento disponible';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Campo no válido'
                });
        }

        res.json({
            success: true,
            existe: existe,
            mensaje: mensaje
        });

    } catch (error) {
        console.error('Error validando campo:', error);
        res.status(500).json({
            success: false,
            message: 'Error validando campo'
        });
    }
});

module.exports = router;