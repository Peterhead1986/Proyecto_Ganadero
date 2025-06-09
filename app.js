// app.js - Aplicación principal del Sistema Ganadero Venezolano
const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

// Importar configuración de base de datos
const { testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const fincaRoutes = require('./routes/fincas');
const listadoFincasRoutes = require('./routes/listado_fincas');
const listaUsuariosRoutes = require('./routes/lista-usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'ganadero_secret',
    name: process.env.SESSION_NAME || 'ganadero_session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambiar a true en producción con HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware flash robusto (debe ir después de la sesión y ANTES de las rutas)
const flash = require('./middleware/flash');
app.use(flash);

// Middleware para hacer disponible la información de sesión en todas las vistas
app.use((req, res, next) => {
    res.locals.usuario = req.session.user || null;
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rutas principales
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/fincas', fincaRoutes);
app.use('/listado-fincas', listadoFincasRoutes);
app.use('/lista-usuarios', listaUsuariosRoutes);

// Ruta principal - Redirige al login
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/auth/dashboard');
    } else {
        res.redirect('/auth/login');
    }
});

// Ruta para servir archivos de upload de forma segura
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'public', 'uploads', filename);
    
    // Verificar que el archivo existe y enviarlo
    res.sendFile(filepath, (err) => {
        if (err) {
            console.error('Error sirviendo archivo:', err);
            res.status(404).send('Archivo no encontrado');
        }
    });
});

// Middleware de manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Página no encontrada',
        message: 'La página que buscas no existe',
        error: { status: 404 }
    });
});

// Middleware de manejo de errores globales
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    
    res.status(err.status || 500).render('error', {
        title: 'Error del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Iniciar servidor
async function startServer() {
    try {
        // Probar conexión a la base de datos
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('Error: No se puede conectar a la base de datos');
            process.exit(1);
        }
        
        // Iniciar servidor HTTP
        app.listen(PORT, () => {
            console.log('🐄 =================================== 🐄');
            console.log('🌾  Sistema Ganadero Venezolano       🌾');
            console.log('🐄 =================================== 🐄');
            console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log('🐄 =================================== 🐄');
        });
        
    } catch (error) {
        console.error(' Error iniciando servidor:', error);
        process.exit(1);
    }
}

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log(' Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log(' Cerrando servidor...');
    process.exit(0);
});

// Iniciar aplicación
startServer();

module.exports = app;
