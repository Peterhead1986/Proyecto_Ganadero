// controllers/listadoFincasController.js
// Controlador dedicado para el listado general de fincas

const Finca = require('../models/Finca');
const Ubicacion = require('../models/Ubicacion');

// GET /listado-fincas
exports.listarFincas = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const filtro = req.query.filtro || '';
        const estado_id = req.query.estado_id || '';
        const ciudad_id = req.query.ciudad_id || '';
        const limite = 10;
        const { fincas, total } = await Finca.obtenerPaginado({ pagina, limite, filtro, estado_id, ciudad_id });
        const totalPaginas = Math.ceil(total / limite);
        const estados = await Ubicacion.obtenerEstados();
        let ciudades = [];
        if (estado_id) ciudades = await Ubicacion.obtenerCiudadesPorEstado(estado_id);
        res.render('listado_fincas', {
            title: 'Listado de Fincas',
            fincas,
            pagina,
            totalPaginas,
            filtro,
            estado_id,
            ciudad_id,
            estados,
            ciudades,
            usuario: req.session.user,
            error: null
        });
    } catch (error) {
        console.error('Error obteniendo listado de fincas:', error);
        res.render('error', {
            title: 'Error',
            message: 'No se pudo cargar el listado de fincas',
            error: error || {}
        });
    }
};
