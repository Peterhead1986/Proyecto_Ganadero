// controllers/usuariosController.js
// Controlador dedicado para la gestión de usuarios

const Usuario = require('../models/Usuario');
const Ubicacion = require('../models/Ubicacion');

// Middleware para requerir rol admin (se puede exportar si se usa en otros controladores)
function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.rol !== 'admin') {
        return res.status(403).render('error', {
            title: 'Acceso denegado',
            message: 'Solo los administradores pueden acceder a esta función.',
            error: { status: 403 }
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

// GET /usuarios/registro
exports.mostrarFormularioRegistro = async (req, res) => {
    try {
        // Limpieza de variable de sesión temporal antes de mostrar el formulario
        if (req.session.registro_temporal) delete req.session.registro_temporal;
        const estados = await Ubicacion.obtenerEstados();
        res.render('registro-usuario', {
            title: 'Registro de Usuario - Sistema Ganadero',
            estados: estados,
            error: null
        });
    } catch (error) {
        console.error('Error cargando formulario de registro:', error);
        res.render('error', {
            title: 'Error',
            message: 'Error cargando el formulario de registro',
            error: error || {}
        });
    }
};

// POST /usuarios/registro
exports.registrarUsuario = async (req, res) => {
    const { validationResult } = require('express-validator');
    try {
        // Limpieza de variable de sesión temporal antes de registrar
        if (req.session.registro_temporal) delete req.session.registro_temporal;
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
            return renderRegistroConError(res, req, 'El nombre de usuario ingresado ya está en uso. Por favor, elija otro diferente.');
        }
        if (await Usuario.existeCorreo(correo)) {
            return renderRegistroConError(res, req, 'El correo electrónico ingresado ya está registrado. Intente con otro correo.');
        }
        if (await Usuario.existeDocumento(numero_documento)) {
            return renderRegistroConError(res, req, 'El número de documento ya está registrado en el sistema.');
        }
        // Validar archivo subido (si existe)
        if (req.file && !req.file.mimetype.startsWith('image/')) {
            return renderRegistroConError(res, req, 'Solo se permiten archivos de imagen (JPG, PNG, GIF) para la foto de perfil.');
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
            foto_perfil: req.file ? req.file.filename : null,
            numero_contacto: req.body.numero_contacto || null
        };
        // Crear usuario
        const resultado = await Usuario.crear(datosLogin, datosPersonales);
        // Si el flujo requiere registro de finca inmediato, mantener la variable, si no, limpiarla
        if (req.body.continuar_a_finca) {
            req.session.registro_temporal = {
                datos_id: resultado.usuario_datos_id,
                nombre: req.body.nombre,
                apellido: req.body.apellido
            };
            req.session.success = {
                tipo: 'success',
                texto: 'Usuario registrado correctamente. Ahora puede continuar con el registro de la finca.'
            };
            return res.redirect('/fincas/registro');
        }
        req.session.success = {
            tipo: 'success',
            texto: '¡Usuario registrado exitosamente! Puede gestionar los datos desde el panel de usuarios.'
        };
        res.redirect('/lista-usuarios');
    } catch (error) {
        console.error('Error registrando usuario:', error);
        return renderRegistroConError(res, req, 'Error interno del servidor. Intente nuevamente.');
    }
};

// GET /usuarios/ubicaciones/ciudades/:estadoId
exports.obtenerCiudadesPorEstado = async (req, res) => {
    try {
        const estadoId = req.params.estadoId;
        const ciudades = await Ubicacion.obtenerCiudadesPorEstado(estadoId);
        res.json({ success: true, ciudades });
    } catch (error) {
        console.error('Error obteniendo ciudades:', error);
        res.status(500).json({ success: false, message: 'Error obteniendo ciudades' });
    }
};

// GET /usuarios/ubicaciones/municipios/:ciudadId
exports.obtenerMunicipiosPorCiudad = async (req, res) => {
    try {
        const ciudadId = req.params.ciudadId;
        const municipios = await Ubicacion.obtenerMunicipiosPorCiudad(ciudadId);
        res.json({ success: true, municipios });
    } catch (error) {
        console.error('Error obteniendo municipios:', error);
        res.status(500).json({ success: false, message: 'Error obteniendo municipios' });
    }
};

// GET /usuarios/ubicaciones/parroquias/:municipioId
exports.obtenerParroquiasPorMunicipio = async (req, res) => {
    try {
        const municipioId = req.params.municipioId;
        const parroquias = await Ubicacion.obtenerParroquiasPorMunicipio(municipioId);
        res.json({ success: true, parroquias });
    } catch (error) {
        console.error('Error obteniendo parroquias:', error);
        res.status(500).json({ success: false, message: 'Error obteniendo parroquias' });
    }
};

// POST /usuarios/validar-campo
exports.validarCampo = async (req, res) => {
    try {
        const { campo, valor } = req.body;
        if (!campo || !valor) {
            return res.status(400).json({ success: false, message: 'Campo y valor requeridos' });
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
                return res.status(400).json({ success: false, message: 'Campo no válido' });
        }
        res.json({ success: true, existe, mensaje });
    } catch (error) {
        console.error('Error validando campo:', error);
        res.status(500).json({ success: false, message: 'Error validando campo' });
    }
};

// Exportar utilidades si se usan en otros controladores
exports.requireAdmin = requireAdmin;
exports.renderRegistroConError = renderRegistroConError;
