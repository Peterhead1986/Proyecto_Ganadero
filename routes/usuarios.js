// routes/usuarios.js - Rutas de gestión de usuarios
const express = require('express');
const { body, validationResult } = require('express-validator');

const Usuario = require('../models/Usuario');
const Ubicacion = require('../models/Ubicacion');
const { requireAuth } = require('../middleware/auth');
const { checkResourceOwnership } = require('../middleware/auth');
const { uploadProfile, handleMulterError } = require('../middleware/config/multer');

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

// Utilidad para renderizar el formulario de registro con errores y datos
async function renderRegistroConError(res, req, mensaje) {
    const estados = await Ubicacion.obtenerEstados();
    return res.render('registro-usuario', {
        title: 'Registro de Usuario - Sistema Ganadero',
        error: {
            tipo: 'error',
            texto: mensaje
        },
        estados: estados,
        formData: req.body
    });
}

// Ruta: GET /usuarios/registro - Mostrar formulario de registro de usuario
router.get('/registro', requireAdmin, async (req, res) => {
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
            message: 'Error cargando el formulario de registro',
            error: error || {}
        });
    }
});

// Ruta: POST /usuarios/registro - Procesar registro de usuario
router.post('/registro', requireAdmin, [
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
        .optional({ checkFalsy: true })
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
            return renderRegistroConError(res, req, errors.array()[0].msg);
        }

        // Validar ubicaciones
        const { estado_id, ciudad_id, municipio_id, parroquia_id } = req.body;
        const validacionUbicacion = await Ubicacion.validarJerarquia(
            estado_id, ciudad_id, municipio_id, parroquia_id
        );
        if (!validacionUbicacion.valido) {
            return renderRegistroConError(res, req, validacionUbicacion.mensaje);
        }

        // Verificar unicidad
        const { nombre_usuario, correo, numero_documento } = req.body;
        if (await Usuario.existeNombreUsuario(nombre_usuario)) {
            return renderRegistroConError(res, req, 'El nombre de usuario ya está en uso');
        }
        if (await Usuario.existeCorreo(correo)) {
            return renderRegistroConError(res, req, 'El correo electrónico ya está registrado');
        }
        if (await Usuario.existeDocumento(numero_documento)) {
            return renderRegistroConError(res, req, 'El número de documento ya está registrado');
        }

        // Validar archivo subido (si existe)
        if (req.file && !req.file.mimetype.startsWith('image/')) {
            return renderRegistroConError(res, req, 'Solo se permiten archivos de imagen para la foto de perfil');
        }

        // Preparar datos
        const datosLogin = {
            nombre_usuario,
            password: req.body.password
        };
        const datosPersonales = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo,
            tipo_documento: req.body.tipo_documento,
            numero_documento,
            direccion: req.body.direccion || null,
            estado_id: parseInt(estado_id),
            ciudad_id: req.body.ciudad_id ? parseInt(req.body.ciudad_id) : null,
            municipio_id: req.body.municipio_id ? parseInt(req.body.municipio_id) : null,
            parroquia_id: req.body.parroquia_id ? parseInt(req.body.parroquia_id) : null,
            foto_perfil: req.file ? req.file.filename : null
        };

        // Crear usuario
        const resultado = await Usuario.crear(datosLogin, datosPersonales);
        req.session.registro_temporal = {
            datos_id: resultado.usuario_datos_id, // Usar el mismo nombre de campo que espera el flujo de registro de finca
            nombre: req.body.nombre,
            apellido: req.body.apellido
        };
        req.session.success = {
            tipo: 'success',
            texto: 'Usuario registrado exitosamente. Ahora registre su finca.'
        };
        return res.redirect('/fincas/registro');
    } catch (error) {
        console.error('Error registrando usuario:', error);
        return renderRegistroConError(res, req, 'Error interno del servidor. Intente nuevamente.');
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
        if (!campo || !valor) {
            return res.status(400).json({
                success: false,
                message: 'Campo y valor requeridos'
            });
        }
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

// Ruta: GET /usuarios/editar - Mostrar formulario de edición de usuario
router.get('/editar', requireAuth, async (req, res, next) => {
    if (req.session.user && req.session.user.rol === 'admin') {
        return next();
    }
    // Si no es admin, solo puede editar su propio perfil
    if (req.query.id && req.session.user.datos_id != req.query.id) {
        return res.status(403).render('error', {
            title: 'Acceso denegado',
            message: 'No tiene permiso para editar este usuario.'
        });
    }
    next();
}, async (req, res) => {
    try {
        const estados = await Ubicacion.obtenerEstados();
        let usuario;
        // Si es admin y hay id en query, permite editar a otros usuarios
        if (req.session.user && req.session.user.rol === 'admin' && req.query.id) {
            usuario = await Usuario.buscarPorId(req.query.id);
            if (!usuario) {
                return res.render('editar-usuario', {
                    title: 'Editar Datos de Usuario',
                    error: { texto: 'Usuario no encontrado.' },
                    usuario: {},
                    estados
                });
            }
        } else {
            usuario = await Usuario.buscarPorId(req.session.user.datos_id);
        }
        res.render('editar-usuario', {
            title: 'Editar Datos de Usuario',
            usuario,
            estados
        });
    } catch (error) {
        console.error('Error cargando edición de usuario:', error);
        res.render('error', {
            title: 'Error',
            message: 'No se pudo cargar el formulario de edición de usuario',
            error: error || {}
        });
    }
});

// Ruta: POST /usuarios/editar - Procesar edición de usuario
router.post('/editar', requireAuth, async (req, res, next) => {
    if (req.session.user && req.session.user.rol === 'admin') {
        return next();
    }
    // Si no es admin, solo puede editar su propio perfil
    if (req.body.datos_id && req.session.user.datos_id != req.body.datos_id) {
        return res.status(403).render('error', {
            title: 'Acceso denegado',
            message: 'No tiene permiso para editar este usuario.'
        });
    }
    next();
}, uploadProfile, handleMulterError, async (req, res) => {
    try {
        const datosActualizados = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo: req.body.correo,
            tipo_documento: req.body.tipo_documento,
            numero_documento: req.body.numero_documento,
            direccion: req.body.direccion || null,
            estado_id: parseInt(req.body.estado_id),
            ciudad_id: req.body.ciudad_id ? parseInt(req.body.ciudad_id) : null,
            municipio_id: req.body.municipio_id ? parseInt(req.body.municipio_id) : null,
            parroquia_id: req.body.parroquia_id ? parseInt(req.body.parroquia_id) : null,
            foto_perfil: req.file ? req.file.filename : req.body.foto_perfil_actual || null
        };
        await Usuario.actualizar(req.session.user.datos_id, datosActualizados);
        req.session.success = {
            tipo: 'success',
            texto: 'Datos de usuario actualizados correctamente.'
        };
        res.redirect('/auth/dashboard');
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.render('editar-usuario', {
            title: 'Editar Datos de Usuario',
            error: { texto: 'Error actualizando los datos. Intente nuevamente.' },
            usuario: req.body,
            estados: await Ubicacion.obtenerEstados()
        });
    }
});

// Ruta: GET /usuarios/buscar - Autocompletado de usuarios para admins
router.get('/buscar', requireAuth, async (req, res) => {
    try {
        // Solo admins pueden buscar otros usuarios
        if (!req.session.user || req.session.user.rol !== 'admin') {
            return res.status(403).json({ success: false, usuarios: [], error: 'No autorizado' });
        }
        const query = req.query.query || '';
        if (!query || query.length < 2) {
            return res.json({ success: true, usuarios: [] });
        }
        const usuarios = await Usuario.buscarPorTexto(query);
        res.json({ success: true, usuarios });
    } catch (error) {
        console.error('Error en búsqueda de usuarios:', error);
        res.json({ success: false, usuarios: [], error: 'Error interno' });
    }
});

// Función auxiliar para obtener usuario y finca principal
async function obtenerUsuarioYFinca(usuarioId) {
    const usuario = await Usuario.buscarPorId(usuarioId);
    if (!usuario) {
        return { error: 'No se encontró el usuario.' };
    }
    const fincas = await require('../models/Finca').buscarPorUsuario(usuario.id);
    const finca = fincas && fincas.length > 0 ? fincas[0] : null;
    if (!finca) {
        return { error: 'No se encontró finca asociada para el usuario.' };
    }
    return { usuario, finca };
}

// Ruta: GET /usuarios/carnet - Generar carnet ganadero
router.get('/carnet', requireAuth, async (req, res) => {
    try {
        const { usuario, finca, error } = await obtenerUsuarioYFinca(req.session.user.datos_id);
        if (error) {
            return res.render('error', { title: 'Error', message: error });
        }
        let fondoColor = '#fff';
        let tipoUsuario = 'usuario';
        if (req.session.user.rol === 'admin') {
            fondoColor = '#e3f2fd';
            tipoUsuario = 'admin';
        } else if (finca.tipo && finca.tipo === 'premium') {
            fondoColor = '#fffbe6';
            tipoUsuario = 'premium';
        }
        res.render('carnet', {
            usuario: {
                ...usuario,
                ciudad_nombre: usuario.ciudad_nombre || '',
            },
            finca: {
                ...finca,
                ciudad_nombre: finca.ciudad_nombre || '',
            },
            fondoColor,
            tipoUsuario
        });
    } catch (error) {
        console.error('Error generando carnet en /usuarios/carnet:', error);
        res.render('error', { title: 'Error', message: 'No se pudo generar el carnet', error });
    }
});

// Ruta: GET /usuarios/carnet/:id - Generar carnet para usuario específico (admin o propio)
router.get('/carnet/:id', requireAuth, async (req, res) => {
    try {
        const usuarioId = req.params.id;
        // Solo admins pueden ver carnets de otros usuarios
        if (req.session.user.rol !== 'admin' && String(req.session.user.datos_id) !== String(usuarioId)) {
            return res.render('error', { title: 'No autorizado', message: 'No tienes permiso para ver el carnet de este usuario.' });
        }
        const { usuario, finca, error } = await obtenerUsuarioYFinca(usuarioId);
        if (error) {
            return res.render('error', { title: 'Error', message: error });
        }
        let fondoColor = '#fff';
        let tipoUsuario = 'usuario';
        if (req.session.user.rol === 'admin') {
            fondoColor = '#e3f2fd';
            tipoUsuario = 'admin';
        } else if (finca.tipo && finca.tipo === 'premium') {
            fondoColor = '#fffbe6';
            tipoUsuario = 'premium';
        }
        res.render('carnet', {
            usuario: {
                ...usuario,
                ciudad_nombre: usuario.ciudad_nombre || '',
            },
            finca: {
                ...finca,
                ciudad_nombre: finca.ciudad_nombre || '',
            },
            fondoColor,
            tipoUsuario
        });
    } catch (error) {
        console.error('Error generando carnet en /usuarios/carnet/:id para usuario', req.params.id, error);
        res.render('error', { title: 'Error', message: 'No se pudo generar el carnet', error });
    }
});

// NUEVAS RUTAS RESTFUL DE EDICIÓN DE USUARIO
// GET /usuarios/:id/editar
router.get('/:id/editar', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        // Solo admin o el propio usuario pueden editar
        if (req.session.user.rol !== 'admin' && String(req.session.user.datos_id) !== String(id)) {
            return res.status(403).render('error', {
                title: 'Acceso denegado',
                message: 'No tiene permiso para editar este usuario.'
            });
        }
        const estados = await Ubicacion.obtenerEstados();
        const usuario = await Usuario.buscarPorId(id);
        if (!usuario) {
            return res.render('editar-usuario', {
                title: 'Editar Usuario',
                error: { texto: 'Usuario no encontrado.' },
                usuario: {},
                estados
            });
        }
        res.render('editar-usuario', {
            title: 'Editar Usuario',
            usuario,
            estados
        });
    } catch (error) {
        console.error('Error cargando edición de usuario:', error);
        res.render('error', {
            title: 'Error',
            message: 'No se pudo cargar el formulario de edición de usuario',
            error: error || {}
        });
    }
});

// POST /usuarios/:id/editar
router.post('/:id/editar', requireAuth, uploadProfile, handleMulterError, async (req, res) => {
    try {
        const { id } = req.params;
        // Solo admin o el propio usuario pueden editar
        if (req.session.user.rol !== 'admin' && String(req.session.user.datos_id) !== String(id)) {
            return res.status(403).render('error', {
                title: 'Acceso denegado',
                message: 'No tiene permiso para editar este usuario.'
            });
        }
        // Validar ubicaciones
        const { estado_id, ciudad_id, municipio_id, parroquia_id } = req.body;
        const validacionUbicacion = await Ubicacion.validarJerarquia(
            estado_id, ciudad_id, municipio_id, parroquia_id
        );
        if (!validacionUbicacion.valido) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('editar-usuario', {
                title: 'Editar Usuario',
                error: { texto: validacionUbicacion.mensaje },
                usuario: { ...req.body, id },
                estados
            });
        }
        // Validar archivo subido (si existe)
        if (req.file && !req.file.mimetype.startsWith('image/')) {
            const estados = await Ubicacion.obtenerEstados();
            return res.render('editar-usuario', {
                title: 'Editar Usuario',
                error: { texto: 'Solo se permiten archivos de imagen para la foto de perfil' },
                usuario: { ...req.body, id },
                estados
            });
        }
        // Preparar datos
        const datosActualizados = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo: req.body.correo,
            tipo_documento: req.body.tipo_documento,
            numero_documento: req.body.numero_documento,
            direccion: req.body.direccion || null,
            estado_id: parseInt(req.body.estado_id),
            ciudad_id: req.body.ciudad_id ? parseInt(req.body.ciudad_id) : null,
            municipio_id: req.body.municipio_id ? parseInt(req.body.municipio_id) : null,
            parroquia_id: req.body.parroquia_id ? parseInt(req.body.parroquia_id) : null,
            foto_perfil: req.file ? req.file.filename : req.body.foto_perfil_actual || null,
            nombre_usuario: req.body.nombre_usuario
        };
        // Si se envía nueva contraseña y confirmación, actualizarla
        if (req.body.password && req.body.password_confirmar && req.body.password === req.body.password_confirmar) {
            datosActualizados.password = req.body.password;
        }
        await Usuario.actualizar(id, datosActualizados);
        req.session.success = {
            tipo: 'success',
            texto: 'Datos de usuario actualizados correctamente.'
        };
        res.redirect('/lista-usuarios');
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        const estados = await Ubicacion.obtenerEstados();
        res.render('editar-usuario', {
            title: 'Editar Usuario',
            error: { texto: 'Error actualizando los datos. Intente nuevamente.' },
            usuario: { ...req.body, id: req.params.id },
            estados
        });
    }
});

// Ruta: GET /usuarios/cambiar-password - Mostrar formulario de cambio de contraseña
router.get('/cambiar-password', requireAuth, (req, res) => {
    res.render('cambiar-password', {
        title: 'Cambiar Contraseña'
    });
});

// Ruta: POST /usuarios/cambiar-password - Procesar cambio de contraseña
router.post('/cambiar-password', requireAuth, async (req, res) => {
    const { contrasena_actual, nueva_contrasena, confirmar_contrasena } = req.body;
    const errores = [];
    // Validación básica
    if (!contrasena_actual || !nueva_contrasena || !confirmar_contrasena) {
        errores.push('Todos los campos son obligatorios.');
    }
    if (nueva_contrasena && nueva_contrasena.length < 6) {
        errores.push('La nueva contraseña debe tener al menos 6 caracteres.');
    }
    if (nueva_contrasena !== confirmar_contrasena) {
        errores.push('La confirmación de la contraseña no coincide.');
    }
    // Puedes agregar validaciones de fuerza aquí (ej: mayúsculas, números, etc.)
    if (errores.length > 0) {
        req.session.error = { texto: errores[0] };
        return res.redirect('/usuarios/cambiar-password');
    }
    try {
        // Buscar usuario actual por ID de sesión
        const usuario = await Usuario.buscarPorNombreUsuario(req.session.user.nombre_usuario);
        if (!usuario) {
            req.session.error = { texto: 'Usuario no encontrado.' };
            return res.redirect('/usuarios/cambiar-password');
        }
        // Verificar contraseña actual
        const passwordOk = await Usuario.verificarPassword(contrasena_actual, usuario.password_hash);
        if (!passwordOk) {
            req.session.error = { texto: 'La contraseña actual es incorrecta.' };
            return res.redirect('/usuarios/cambiar-password');
        }
        // Evitar que la nueva contraseña sea igual a la actual
        const mismaPassword = await Usuario.verificarPassword(nueva_contrasena, usuario.password_hash);
        if (mismaPassword) {
            req.session.error = { texto: 'La nueva contraseña no puede ser igual a la actual.' };
            return res.redirect('/usuarios/cambiar-password');
        }
        // Actualizar contraseña
        await Usuario.cambiarPassword(usuario.login_id, nueva_contrasena);
        req.session.success = { texto: 'Contraseña cambiada correctamente.' };
        res.redirect('/auth/dashboard');
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        req.session.error = { texto: 'Error interno del servidor. Intente nuevamente.' };
        res.redirect('/usuarios/cambiar-password');
    }
});

module.exports = router;