// routes/auth.js - Rutas de autenticación
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { requireGuest, requireAuth, handleFlashMessages } = require('../middleware/auth');
const Usuario = require('../models/Usuario');

// Middleware de mensajes flash
router.use(handleFlashMessages);

// Ruta: GET /auth/login - Mostrar formulario de login
router.get('/login', requireGuest, (req, res) => {
    res.render('login', {
        title: 'Iniciar Sesión',
    });
});

// Ruta: POST /auth/login - Procesar login
router.post('/login', requireGuest, [
    body('nombre_usuario').notEmpty().withMessage('El usuario es requerido'),
    body('contrasena').notEmpty().withMessage('La contraseña es requerida')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', {
            title: 'Iniciar Sesión',
            error: { texto: errors.array()[0].msg },
            formData: req.body
        });
    }
    // Permitir ambos nombres de campo para compatibilidad
    const { nombre_usuario, contrasena, password } = req.body;
    const passwordToCheck = contrasena || password;
    try {
        const usuario = await Usuario.buscarPorNombreUsuario(nombre_usuario);
        if (!usuario) {
            return res.render('login', {
                title: 'Iniciar Sesión',
                error: { texto: 'Usuario o contraseña incorrectos' },
                formData: req.body
            });
        }
        const passwordOk = await Usuario.verificarPassword(passwordToCheck, usuario.password_hash);
        if (!passwordOk) {
            return res.render('login', {
                title: 'Iniciar Sesión',
                error: { texto: 'Usuario o contraseña incorrectos' },
                formData: req.body
            });
        }
        // Guardar datos mínimos en sesión
        req.session.user = {
            login_id: usuario.login_id,
            datos_id: usuario.datos_id,
            nombre_usuario: usuario.nombre_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            tipo_documento: usuario.tipo_documento,
            numero_documento: usuario.numero_documento,
            foto_perfil: usuario.foto_perfil,
            estado_nombre: usuario.estado_nombre
        };
        // Redirigir al dashboard
        res.redirect('/auth/dashboard');
    } catch (error) {
        console.error('Error en login:', error);
        res.render('login', {
            title: 'Iniciar Sesión',
            error: { texto: 'Error interno del servidor' },
            formData: req.body
        });
    }
});

// Ruta: POST /auth/registrar - Registro rápido desde login
router.post('/registrar', [
    body('nombre_usuario')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido')
        .isLength({ min: 3, max: 50 }).withMessage('Debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Solo letras, números y guiones bajos'),
    body('contrasena')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', {
            title: 'Iniciar Sesión',
            error: { texto: errors.array()[0].msg },
            formData: req.body
        });
    }
    const { nombre_usuario, contrasena } = req.body;
    try {
        // Verificar unicidad
        if (await Usuario.existeNombreUsuario(nombre_usuario)) {
            return res.render('login', {
                title: 'Iniciar Sesión',
                error: { texto: 'El nombre de usuario ya está en uso' },
                formData: req.body
            });
        }
        // Crear usuario solo en usuarios_login
        const saltRounds = 12;
        const passwordHash = await require('bcryptjs').hash(contrasena, saltRounds);
        const result = await require('../config/database').executeQuery(
            'INSERT INTO usuarios_login (nombre_usuario, password_hash) VALUES (?, ?)',
            [nombre_usuario, passwordHash]
        );
        // Buscar usuario recién creado
        const usuario = await Usuario.buscarPorNombreUsuario(nombre_usuario);
        // Guardar en sesión y redirigir al dashboard
        req.session.user = {
            login_id: usuario.login_id,
            datos_id: usuario.datos_id,
            nombre_usuario: usuario.nombre_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            tipo_documento: usuario.tipo_documento,
            numero_documento: usuario.numero_documento,
            foto_perfil: usuario.foto_perfil,
            estado_nombre: usuario.estado_nombre
        };
        return res.redirect('/auth/dashboard');
    } catch (error) {
        console.error('Error en registro rápido:', error);
        return res.render('login', {
            title: 'Iniciar Sesión',
            error: { texto: 'Error interno del servidor' },
            formData: req.body
        });
    }
});

module.exports = router;