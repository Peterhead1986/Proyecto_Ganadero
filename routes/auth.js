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
            errors: errors.array()
        });
    }
    // ...lógica de autenticación aquí...
    // Si éxito:
    // req.session.user = { ... };
    // res.redirect('/auth/dashboard');
    // Si error:
    // res.render('login', { ... });
});

// Ruta: GET /auth/logout - Cerrar sesión
router.get('/logout', requireAuth, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

// Ruta: GET /auth/dashboard - Panel principal (requiere login)
router.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard', {
        title: 'Panel de Usuario',
        user: req.session.user
    });
});

module.exports = router;