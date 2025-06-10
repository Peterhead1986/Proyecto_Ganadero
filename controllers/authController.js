// controllers/authController.js
// Controlador dedicado para autenticación y login

const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');

// GET /auth/login
exports.mostrarLogin = (req, res) => {
    res.render('login', {
        title: 'Iniciar Sesión',
    });
};

// POST /auth/login
exports.procesarLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', {
            title: 'Iniciar Sesión',
            error: { texto: errors.array()[0].msg },
            formData: req.body
        });
    }
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
            estado_nombre: usuario.estado_nombre,
            rol: usuario.rol
        };
        res.redirect('/auth/dashboard');
    } catch (error) {
        console.error('Error en login:', error);
        res.render('login', {
            title: 'Iniciar Sesión',
            error: { texto: 'Error interno del servidor' },
            formData: req.body
        });
    }
};
