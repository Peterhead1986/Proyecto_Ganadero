// middleware/auth.js - Middleware de autenticación
const Usuario = require('../models/Usuario');

// Middleware para verificar si el usuario está autenticado
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            // Si es una petición AJAX, devolver JSON
            return res.status(401).json({
                success: false,
                message: 'Debe iniciar sesión para acceder a este recurso'
            });
        } else {
            // Si es una petición normal, redirigir al login
            req.session.redirectUrl = req.originalUrl;
            return res.redirect('/auth/login?mensaje=Debe iniciar sesión para continuar');
        }
    }
    next();
};

// Middleware para verificar si el usuario NO está autenticado
const requireGuest = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/auth/dashboard');
    }
    next();
};

// Middleware para verificar si el usuario ha completado su registro
const requireCompleteProfile = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        // Verificar si el usuario tiene datos completos
        const usuario = await Usuario.buscarPorId(req.session.user.datos_id);
        
        if (!usuario || !usuario.nombre || !usuario.apellido || !usuario.correo) {
            req.session.mensaje = {
                tipo: 'warning',
                texto: 'Debe completar su perfil antes de continuar'
            };
            return res.redirect('/usuarios/registro');
        }

        next();
    } catch (error) {
        console.error('Error verificando perfil completo:', error);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'Error verificando el perfil del usuario'
        });
    }
};

// Middleware para inyectar información del usuario en las vistas
const injectUserData = async (req, res, next) => {
    if (req.session.user) {
        try {
            const usuario = await Usuario.buscarPorId(req.session.user.datos_id);
            res.locals.currentUser = usuario;
            res.locals.isLoggedIn = true;
        } catch (error) {
            console.error('Error obteniendo datos del usuario:', error);
            res.locals.currentUser = null;
            res.locals.isLoggedIn = false;
        }
    } else {
        res.locals.currentUser = null;
        res.locals.isLoggedIn = false;
    }
    next();
};

// Middleware para manejar mensajes flash
const handleFlashMessages = (req, res, next) => {
    res.locals.mensaje = req.session.mensaje || null;
    res.locals.error = req.session.error || null;
    res.locals.success = req.session.success || null;
    
    // Limpiar mensajes después de usarlos
    delete req.session.mensaje;
    delete req.session.error;
    delete req.session.success;
    
    next();
};

// Middleware para logging de acciones de usuario
const logUserActions = (req, res, next) => {
    if (req.session.user && req.method !== 'GET') {
        console.log(`[${new Date().toISOString()}] Usuario ${req.session.user.nombre_usuario} - ${req.method} ${req.originalUrl}`);
    }
    next();
};

// Middleware para validar permisos de acceso a recursos
const checkResourceOwnership = (resourceType) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params.id;
            const userId = req.session.user.datos_id;

            let isOwner = false;

            switch (resourceType) {
                case 'finca':
                    const Finca = require('../models/Finca');
                    isOwner = await Finca.verificarPropietario(resourceId, userId);
                    break;
                case 'usuario':
                    isOwner = (resourceId == userId);
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Tipo de recurso no válido'
                    });
            }

            if (!isOwner) {
                if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tiene permisos para acceder a este recurso'
                    });
                } else {
                    req.session.error = {
                        tipo: 'error',
                        texto: 'No tiene permisos para acceder a este recurso'
                    };
                    return res.redirect('/auth/dashboard');
                }
            }

            next();
        } catch (error) {
            console.error('Error verificando propiedad del recurso:', error);
            res.status(500).json({
                success: false,
                message: 'Error verificando permisos'
            });
        }
    };
};

// Middleware para limitar intentos de login
const rateLimitLogin = (() => {
    const attempts = new Map();
    const MAX_ATTEMPTS = 5;
    const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        if (!attempts.has(ip)) {
            attempts.set(ip, { count: 0, resetTime: now + WINDOW_MS });
        }

        const userAttempts = attempts.get(ip);

        if (now > userAttempts.resetTime) {
            userAttempts.count = 0;
            userAttempts.resetTime = now + WINDOW_MS;
        }

        if (userAttempts.count >= MAX_ATTEMPTS) {
            return res.status(429).render('login', {
                title: 'Iniciar Sesión',
                error: {
                    tipo: 'error',
                    texto: 'Demasiados intentos fallidos. Intente nuevamente en 15 minutos.'
                }
            });
        }

        userAttempts.count++;
        attempts.set(ip, userAttempts);
        
        next();
    };
})();

module.exports = {
    requireAuth,
    requireGuest,
    requireCompleteProfile,
    injectUserData,
    handleFlashMessages,
    logUserActions,
    checkResourceOwnership,
    rateLimitLogin
};
