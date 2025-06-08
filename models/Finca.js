// models/Finca.js - Modelo para manejo de fincas
const { executeQuery } = require('../config/database');

class Finca {
    // Crear nueva finca
    static async crear(datosFinca) {
        try {
            const result = await executeQuery(`
                INSERT INTO fincas_datos (
                    usuario_id, nombre_finca, direccion_finca, latitud, longitud,
                    estado_id, ciudad_id, municipio_id, parroquia_id, logo_finca
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                datosFinca.usuario_id,
                datosFinca.nombre_finca,
                datosFinca.direccion_finca,
                datosFinca.latitud || null,
                datosFinca.longitud || null,
                datosFinca.estado_id || null,
                datosFinca.ciudad_id || null,
                datosFinca.municipio_id || null,
                datosFinca.parroquia_id || null,
                datosFinca.logo_finca || null
            ]);
            return result.insertId;
        } catch (error) {
            console.error('Error creando finca:', error);
            throw error;
        }
    }

    // Buscar fincas por usuario
    static async buscarPorUsuario(usuarioId) {
        try {
            const result = await executeQuery(`
                SELECT 
                    fd.*,
                    e.nombre as estado_nombre,
                    c.nombre as ciudad_nombre,
                    m.nombre as municipio_nombre,
                    p.nombre as parroquia_nombre
                FROM fincas_datos fd
                LEFT JOIN ubicaciones_venezuela e ON fd.estado_id = e.id
                LEFT JOIN ubicaciones_venezuela c ON fd.ciudad_id = c.id
                LEFT JOIN ubicaciones_venezuela m ON fd.municipio_id = m.id
                LEFT JOIN ubicaciones_venezuela p ON fd.parroquia_id = p.id
                WHERE fd.usuario_id = ?
                ORDER BY fd.nombre_finca ASC
            `, [usuarioId]);
            return result;
        } catch (error) {
            console.error('Error buscando fincas por usuario:', error);
            throw error;
        }
    }

    // Eliminar finca
    static async eliminar(id) {
        try {
            const result = await executeQuery('DELETE FROM fincas_datos WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error eliminando finca:', error);
            throw error;
        }
    }

    // Verificar si el usuario es dueño de la finca
    static async verificarPropietario(fincaId, usuarioId) {
        try {
            const result = await executeQuery(
                'SELECT COUNT(*) as count FROM fincas_datos WHERE id = ? AND usuario_id = ?',
                [fincaId, usuarioId]
            );
            return result[0].count > 0;
        } catch (error) {
            console.error('Error verificando propietario:', error);
            throw error;
        }
    }

    // Obtener listado completo de fincas con datos de usuario y ubicación
    static async obtenerListadoCompleto() {
        try {
            const result = await executeQuery(`
                SELECT 
                    fd.*, -- Todos los campos de la finca
                    e.nombre AS estado_nombre,
                    c.nombre AS ciudad_nombre,
                    m.nombre AS municipio_nombre,
                    p.nombre AS parroquia_nombre,
                    u.nombre AS usuario_nombre,
                    u.apellido AS usuario_apellido,
                    u.numero_documento AS usuario_cedula
                FROM fincas_datos fd
                LEFT JOIN ubicaciones_venezuela e ON fd.estado_id = e.id
                LEFT JOIN ubicaciones_venezuela c ON fd.ciudad_id = c.id
                LEFT JOIN ubicaciones_venezuela m ON fd.municipio_id = m.id
                LEFT JOIN ubicaciones_venezuela p ON fd.parroquia_id = p.id
                LEFT JOIN usuarios_datos u ON fd.usuario_id = u.id
                ORDER BY fd.nombre_finca ASC
            `);
            return result;
        } catch (error) {
            console.error('Error obteniendo listado completo de fincas:', error);
            throw error;
        }
    }

    // Obtener fincas paginadas y filtradas
    static async obtenerPaginado({ pagina = 1, limite = 10, filtro = '', estado_id, ciudad_id, municipio_id, parroquia_id, propietario_id }) {
        const offset = (pagina - 1) * limite;
        const filtroSQL = filtro ? `%${filtro}%` : '%';
        let where = `WHERE (fd.nombre_finca LIKE ? OR fd.direccion_finca LIKE ?)`;
        let params = [filtroSQL, filtroSQL];
        if (estado_id) { where += ' AND fd.estado_id = ?'; params.push(estado_id); }
        if (ciudad_id) { where += ' AND fd.ciudad_id = ?'; params.push(ciudad_id); }
        if (municipio_id) { where += ' AND fd.municipio_id = ?'; params.push(municipio_id); }
        if (parroquia_id) { where += ' AND fd.parroquia_id = ?'; params.push(parroquia_id); }
        if (propietario_id) { where += ' AND fd.usuario_id = ?'; params.push(propietario_id); }
        // Total
        const totalRes = await executeQuery(
            `SELECT COUNT(*) as total FROM fincas_datos fd ${where}`,
            params
        );
        const total = totalRes[0].total;
        // Página
        const fincas = await executeQuery(
            `SELECT fd.*, 
                e.nombre as estado_nombre,
                c.nombre as ciudad_nombre,
                m.nombre as municipio_nombre,
                p.nombre as parroquia_nombre,
                u.nombre as usuario_nombre,
                u.apellido as usuario_apellido,
                u.numero_documento as usuario_cedula
             FROM fincas_datos fd
             LEFT JOIN ubicaciones_venezuela e ON fd.estado_id = e.id
             LEFT JOIN ubicaciones_venezuela c ON fd.ciudad_id = c.id
             LEFT JOIN ubicaciones_venezuela m ON fd.municipio_id = m.id
             LEFT JOIN ubicaciones_venezuela p ON fd.parroquia_id = p.id
             LEFT JOIN usuarios_datos u ON fd.usuario_id = u.id
             ${where}
             ORDER BY fd.nombre_finca ASC
             LIMIT ? OFFSET ?`,
            [...params, limite, offset]
        );
        return { fincas, total };
    }
}

module.exports = Finca;
