// controllers/listaUsuariosController.js
// Controlador dedicado para el listado y gestión de usuarios (solo admins)

const Usuario = require('../models/Usuario');
const Ubicacion = require('../models/Ubicacion');

// GET /lista-usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        // Log inicial de la sesión
        console.log('DEBUG listaUsuariosController - Usuario en sesión (inicio):', req.session.user);
        if (req.session.user && (!req.session.user.datos_id || !req.session.user.rol)) {
            try {
                const usuario = await Usuario.buscarPorNombreUsuario(req.session.user.nombre_usuario);
                if (usuario) req.session.user = usuario;
            } catch (e) {
                console.error('Error refrescando sesión:', e);
            }
        }
        // Log después de refrescar sesión
        console.log('DEBUG listaUsuariosController - Usuario en sesión (después de refrescar):', req.session.user);
        if (!req.session.user) {
            return res.status(403).render('error', {
                title: 'No autorizado',
                message: 'Debe iniciar sesión para ver la lista de usuarios.',
                error: { status: 403 }
            });
        }
        // Permitir acceso a admin y normal, pero solo admin puede ver acciones
        const pagina = parseInt(req.query.pagina) || 1;
        const filtro = req.query.filtro || '';
        const estado_id = req.query.estado_id || '';
        const ciudad_id = req.query.ciudad_id || '';
        const limite = 10;
        const { usuarios, total } = await Usuario.obtenerPaginado({ pagina, limite, filtro, estado_id, ciudad_id });
        const totalPaginas = Math.ceil(total / limite);
        const estados = await Ubicacion.obtenerEstados();
        let ciudades = [];
        if (estado_id) ciudades = await Ubicacion.obtenerCiudadesPorEstado(estado_id);
        res.render('lista-usuarios', {
            title: 'Lista de Usuarios',
            usuarios: usuarios.map(usuario => ({ ...usuario, numero_contacto: usuario.numero_contacto })),
            pagina,
            totalPaginas,
            filtro,
            estado_id,
            ciudad_id,
            estados,
            ciudades,
            usuario: req.session.user,
            isAuthenticated: !!req.session.user,
            error: null
        });
    } catch (error) {
        console.error('Error listando usuarios:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'No se pudo cargar la lista de usuarios.',
            error: error || { status: 500 }
        });
    }
};
