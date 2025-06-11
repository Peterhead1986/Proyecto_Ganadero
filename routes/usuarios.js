// routes/usuarios.js - Rutas de gestión de usuarios
const express = require('express');
const { body, validationResult } = require('express-validator');

const Usuario = require('../models/Usuario');
const Ubicacion = require('../models/Ubicacion');
const { requireAuth } = require('../middleware/auth');
const { checkResourceOwnership } = require('../middleware/auth');
const { uploadProfile, handleMulterError } = require('../middleware/config/multer');
const usuariosController = require('../controllers/usuariosController');

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

// Middleware para refrescar la sesión del usuario desde la BD si falta algún dato clave
async function refreshUserSession(req, res, next) {
    if (req.session.user && (!req.session.user.datos_id || !req.session.user.rol)) {
        try {
            const usuario = await Usuario.buscarPorNombreUsuario(req.session.user.nombre_usuario);
            if (usuario) req.session.user = usuario;
        } catch (e) {
            console.error('Error refrescando sesión:', e);
        }
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

// Ruta: GET /usuarios/registro - Mostrar formulario de registro de usuario (solo admin)
router.get('/registro', requireAuth, requireAdmin, usuariosController.mostrarFormularioRegistro);

// Ruta: POST /usuarios/registro - Procesar registro de usuario (solo admin)
router.post('/registro', requireAuth, requireAdmin, [
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
], usuariosController.registrarUsuario);

// Ruta: GET /usuarios/ubicaciones/ciudades/:estadoId - API para obtener ciudades
router.get('/ubicaciones/ciudades/:estadoId', usuariosController.obtenerCiudadesPorEstado);

// Ruta: GET /usuarios/ubicaciones/municipios/:ciudadId - API para obtener municipios
router.get('/ubicaciones/municipios/:ciudadId', usuariosController.obtenerMunicipiosPorCiudad);

// Ruta: GET /usuarios/ubicaciones/parroquias/:municipioId - API para obtener parroquias
router.get('/ubicaciones/parroquias/:municipioId', usuariosController.obtenerParroquiasPorMunicipio);

// Ruta: POST /usuarios/validar-campo - Validar campos únicos en tiempo real
router.post('/validar-campo', usuariosController.validarCampo);

// Ruta: GET /usuarios/editar - Mostrar formulario de edición de usuario
router.get('/editar', requireAuth, refreshUserSession, async (req, res, next) => {
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
router.post('/editar', requireAuth, refreshUserSession, async (req, res, next) => {
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
        // Refrescar la sesión tras la edición
        const usuarioActualizado = await Usuario.buscarPorNombreUsuario(req.session.user.nombre_usuario);
        if (usuarioActualizado) req.session.user = usuarioActualizado;
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
router.get('/carnet', requireAuth, refreshUserSession, async (req, res) => {
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
router.get('/carnet/:id', requireAuth, refreshUserSession, async (req, res) => {
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
router.get('/:id/editar', requireAuth, refreshUserSession, async (req, res) => {
    try {
        const { id } = req.params;
        // Permitir edición a cualquier usuario autenticado (sin restricción)
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
router.post('/:id/editar', requireAuth, refreshUserSession, uploadProfile, handleMulterError, async (req, res) => {
    try {
        const { id } = req.params;
        // Permitir edición a cualquier usuario autenticado (sin restricción)
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
        // Refrescar la sesión si el usuario editado es el mismo de la sesión
        if (String(req.session.user.datos_id) === String(id)) {
            const usuarioActualizado = await Usuario.buscarPorNombreUsuario(req.session.user.nombre_usuario);
            if (usuarioActualizado) req.session.user = usuarioActualizado;
        }
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

// Ruta: POST /usuarios/:id/eliminar - Eliminar usuario (solo admin)
router.post('/:id/eliminar', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Eliminar usuario
        await Usuario.eliminarPorDatosId(id);
        req.session.success = {
            tipo: 'success',
            texto: 'Usuario eliminado correctamente.'
        };
        res.redirect('/lista-usuarios');
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        req.session.error = {
            tipo: 'error',
            texto: 'Error al eliminar el usuario. Intente nuevamente.'
        };
        res.redirect('/lista-usuarios');
    }
});

// Ruta: GET /usuarios/cambiar-password - Mostrar formulario de cambio de contraseña
router.get('/cambiar-password', requireAuth, refreshUserSession, (req, res) => {
    res.render('cambiar-password', {
        title: 'Cambiar Contraseña'
    });
});

// Ruta: POST /usuarios/cambiar-password - Procesar cambio de contraseña
router.post('/cambiar-password', requireAuth, refreshUserSession, async (req, res) => {
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
        // Refrescar la sesión tras el cambio de contraseña
        const usuarioActualizado = await Usuario.buscarPorNombreUsuario(req.session.user.nombre_usuario);
        if (usuarioActualizado) req.session.user = usuarioActualizado;
        req.session.success = { texto: 'Contraseña cambiada correctamente.' };
        res.redirect('/auth/dashboard');
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        req.session.error = { texto: 'Error interno del servidor. Intente nuevamente.' };
        res.redirect('/usuarios/cambiar-password');
    }
});

// Ruta para ver el perfil del usuario autenticado
router.get('/perfil', requireAuth, async (req, res) => {
    try {
        const usuario = await Usuario.buscarPorId(req.session.user.datos_id);
        if (!usuario) {
            return res.status(404).render('error', {
                title: 'Perfil no encontrado',
                message: 'No se pudo encontrar el perfil del usuario.'
            });
        }
        res.render('perfil-usuario', {
            title: 'Mi Perfil',
            usuario,
            isAuthenticated: true
        });
    } catch (error) {
        console.error('Error mostrando perfil:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'No se pudo cargar el perfil.'
        });
    }
});

module.exports = router;