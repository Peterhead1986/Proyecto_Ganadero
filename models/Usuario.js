// models/Usuario.js - Modelo para manejo de usuarios
const bcrypt = require('bcryptjs');
const { executeQuery, executeRawQuery } = require('../config/database');

class Usuario {
    constructor(data) {
        this.id = data.id;
        this.nombreUsuario = data.nombre_usuario;
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.correo = data.correo;
        this.tipoDocumento = data.tipo_documento;
        this.numeroDocumento = data.numero_documento;
        this.direccion = data.direccion;
        this.estadoId = data.estado_id;
        this.ciudadId = data.ciudad_id;
        this.municipioId = data.municipio_id;
        this.parroquiaId = data.parroquia_id;
        this.fotoPerfil = data.foto_perfil;
        this.numeroContacto = data.numero_contacto;
        this.createdAt = data.created_at;
    }

    // Crear usuario completo (login + datos)
    static async crear(datosLogin, datosPersonales) {
        try {
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(datosLogin.password, saltRounds);
            await executeRawQuery('START TRANSACTION');
            const resultLogin = await executeQuery(
                'INSERT INTO usuarios_login (nombre_usuario, password_hash) VALUES (?, ?)',
                [datosLogin.nombre_usuario, passwordHash]
            );
            const usuarioLoginId = resultLogin.insertId;
            const resultDatos = await executeQuery(`
                INSERT INTO usuarios_datos (
                    usuario_login_id, nombre, apellido, correo, tipo_documento, 
                    numero_documento, direccion, estado_id, ciudad_id, 
                    foto_perfil, numero_contacto
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                usuarioLoginId,
                datosPersonales.nombre,
                datosPersonales.apellido,
                datosPersonales.correo,
                datosPersonales.tipo_documento,
                datosPersonales.numero_documento,
                datosPersonales.direccion,
                datosPersonales.estado_id || null,
                datosPersonales.ciudad_id || null,
                datosPersonales.foto_perfil || null,
                datosPersonales.numero_contacto || null
            ]);
            await executeRawQuery('COMMIT');
            return {
                usuario_login_id: usuarioLoginId,
                usuario_datos_id: resultDatos.insertId
            };
        } catch (error) {
            await executeRawQuery('ROLLBACK');
            throw error;
        }
    }

    // Buscar usuario por nombre de usuario para login
    static async buscarPorNombreUsuario(nombreUsuario) {
        try {
            const result = await executeQuery(`
                SELECT 
                    ul.id as login_id,
                    ul.nombre_usuario,
                    ul.password_hash,
                    ul.rol,
                    ud.id as datos_id,
                    ud.nombre,
                    ud.apellido,
                    ud.correo,
                    ud.tipo_documento,
                    ud.numero_documento,
                    ud.direccion,
                    ud.estado_id,
                    ud.ciudad_id,
                    e.nombre as estado_nombre,
                    c.nombre as ciudad_nombre,
                    ud.numero_contacto
                FROM usuarios_login ul
                LEFT JOIN usuarios_datos ud ON ul.id = ud.usuario_login_id
                LEFT JOIN ubicaciones_venezuela e ON ud.estado_id = e.id
                LEFT JOIN ubicaciones_venezuela c ON ud.ciudad_id = c.id
                WHERE ul.nombre_usuario = ?
            `, [nombreUsuario]);
            return result[0] || null;
        } catch (error) {
            console.error('Error buscando usuario:', error);
            throw error;
        }
    }

    // Verificar contraseña
    static async verificarPassword(password, passwordHash) {
        try {
            return await bcrypt.compare(password, passwordHash);
        } catch (error) {
            console.error('Error verificando contraseña:', error);
            throw error;
        }
    }

    // Buscar usuario por ID
    static async buscarPorId(id) {
        try {
            const result = await executeQuery(`
                SELECT 
                    ul.id as login_id,
                    ul.nombre_usuario,
                    ud.id as datos_id,
                    ud.nombre,
                    ud.apellido,
                    ud.correo,
                    ud.tipo_documento,
                    ud.numero_documento,
                    ud.direccion,
                    ud.estado_id,
                    ud.ciudad_id,
                    e.nombre as estado_nombre,
                    c.nombre as ciudad_nombre,
                    ud.numero_contacto,
                    ud.foto_perfil
                FROM usuarios_login ul
                LEFT JOIN usuarios_datos ud ON ul.id = ud.usuario_login_id
                LEFT JOIN ubicaciones_venezuela e ON ud.estado_id = e.id
                LEFT JOIN ubicaciones_venezuela c ON ud.ciudad_id = c.id
                WHERE ud.id = ?
            `, [id]);
            return result[0] || null;
        } catch (error) {
            console.error('Error buscando usuario por ID:', error);
            throw error;
        }
    }

    // Verificar si existe un nombre de usuario
    static async existeNombreUsuario(nombreUsuario) {
        try {
            const result = await executeQuery(
                'SELECT COUNT(*) as count FROM usuarios_login WHERE nombre_usuario = ?',
                [nombreUsuario]
            );
            return result[0].count > 0;
        } catch (error) {
            console.error('Error verificando nombre de usuario:', error);
            throw error;
        }
    }

    // Verificar si existe un correo
    static async existeCorreo(correo) {
        try {
            const result = await executeQuery(
                'SELECT COUNT(*) as count FROM usuarios_datos WHERE correo = ?',
                [correo]
            );
            return result[0].count > 0;
        } catch (error) {
            console.error('Error verificando correo:', error);
            throw error;
        }
    }

    // Verificar si existe un documento
    static async existeDocumento(numeroDocumento) {
        try {
            const result = await executeQuery(
                'SELECT COUNT(*) as count FROM usuarios_datos WHERE numero_documento = ?',
                [numeroDocumento]
            );
            return result[0].count > 0;
        } catch (error) {
            console.error('Error verificando documento:', error);
            throw error;
        }
    }

    // Cambiar contraseña
    static async cambiarPassword(usuarioId, nuevaPassword) {
        try {
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(nuevaPassword, saltRounds);
            const result = await executeQuery(
                'UPDATE usuarios_login SET password_hash = ?, updated_at = NOW() WHERE id = ?',
                [passwordHash, usuarioId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            throw error;
        }
    }

    // Buscar usuarios por texto para autocompletado (solo admins)
    static async buscarPorTexto(texto) {
        try {
            const query = `%${texto}%`;
            const result = await executeQuery(`
                SELECT 
                    ud.id as datos_id,
                    ul.nombre_usuario,
                    ud.nombre,
                    ud.apellido,
                    ud.correo
                FROM usuarios_datos ud
                INNER JOIN usuarios_login ul ON ud.usuario_login_id = ul.id
                WHERE 
                    ud.nombre LIKE ? OR
                    ud.apellido LIKE ? OR
                    ul.nombre_usuario LIKE ? OR
                    ud.correo LIKE ?
                ORDER BY ud.nombre ASC, ud.apellido ASC
                LIMIT 10
            `, [query, query, query, query]);
            return result;
        } catch (error) {
            console.error('Error en buscarPorTexto:', error);
            return [];
        }
    }

    // Actualizar datos de usuario (admin o propio)
    static async actualizar(datosId, datosActualizados) {
        // datosId: id de usuarios_datos
        // datosActualizados: { nombre, apellido, correo, tipo_documento, numero_documento, direccion, estado_id, ciudad_id, foto_perfil, nombre_usuario?, password? }
        try {
            await executeRawQuery('START TRANSACTION');

            // Actualizar datos personales
            await executeQuery(`
                UPDATE usuarios_datos SET
                    nombre = ?,
                    apellido = ?,
                    correo = ?,
                    tipo_documento = ?,
                    numero_documento = ?,
                    direccion = ?,
                    estado_id = ?,
                    ciudad_id = ?,
                    foto_perfil = ?,
                    numero_contacto = ?
                WHERE id = ?
            `, [
                datosActualizados.nombre,
                datosActualizados.apellido,
                datosActualizados.correo,
                datosActualizados.tipo_documento,
                datosActualizados.numero_documento,
                datosActualizados.direccion || null,
                datosActualizados.estado_id || null,
                datosActualizados.ciudad_id || null,
                datosActualizados.foto_perfil || null,
                datosActualizados.numero_contacto || null,
                datosId
            ]);

            // Si se requiere actualizar nombre_usuario o password
            if (datosActualizados.nombre_usuario || datosActualizados.password) {
                // Obtener usuario_login_id
                const datos = await executeQuery('SELECT usuario_login_id FROM usuarios_datos WHERE id = ?', [datosId]);
                if (!datos[0]) throw new Error('Usuario no encontrado');
                const usuarioLoginId = datos[0].usuario_login_id;
                let setStr = [];
                let params = [];
                if (datosActualizados.nombre_usuario) {
                    setStr.push('nombre_usuario = ?');
                    params.push(datosActualizados.nombre_usuario);
                }
                if (datosActualizados.password) {
                    const saltRounds = 12;
                    const passwordHash = await bcrypt.hash(datosActualizados.password, saltRounds);
                    setStr.push('password_hash = ?');
                    params.push(passwordHash);
                }
                if (setStr.length > 0) {
                    await executeQuery(
                        `UPDATE usuarios_login SET ${setStr.join(', ')}, updated_at = NOW() WHERE id = ?`,
                        [...params, usuarioLoginId]
                    );
                }
            }

            await executeRawQuery('COMMIT');
            return true;
        } catch (error) {
            await executeRawQuery('ROLLBACK');
            console.error('Error actualizando usuario:', error);
            throw error;
        }
    }

    // Obtener todos los usuarios (para admins)
    static async obtenerTodos() {
        try {
            const result = await executeQuery(`
                SELECT 
                    ul.id as login_id,
                    ul.nombre_usuario,
                    ud.id as datos_id,
                    ud.nombre,
                    ud.apellido,
                    ud.correo,
                    ud.tipo_documento,
                    ud.numero_documento,
                    ud.direccion,
                    ud.estado_id,
                    ud.ciudad_id,
                    ud.foto_perfil,
                    ul.created_at as creado,
                    ul.updated_at as actualizado,
                    ud.numero_contacto
                FROM usuarios_login ul
                LEFT JOIN usuarios_datos ud ON ul.id = ud.usuario_login_id
                ORDER BY ud.nombre ASC, ud.apellido ASC
            `);
            return result;
        } catch (error) {
            console.error('Error obteniendo todos los usuarios:', error);
            throw error;
        }
    }

    // Obtener usuarios paginados y filtrados
    static async obtenerPaginado({ pagina = 1, limite = 10, filtro = '' }) {
        const offset = (pagina - 1) * limite;
        const filtroSQL = filtro ? `%${filtro}%` : '%';
        // Contar total
        const totalRes = await executeQuery(
            `SELECT COUNT(*) as total FROM usuarios_datos ud
             INNER JOIN usuarios_login ul ON ud.usuario_login_id = ul.id
             WHERE ud.nombre LIKE ? OR ud.apellido LIKE ? OR ul.nombre_usuario LIKE ? OR ud.correo LIKE ?`,
            [filtroSQL, filtroSQL, filtroSQL, filtroSQL]
        );
        const total = totalRes[0].total;
        // Obtener página
        const usuarios = await executeQuery(
            `SELECT ul.id as login_id, ul.nombre_usuario, ud.id as datos_id, ud.nombre, ud.apellido, ud.correo, ud.tipo_documento, ud.numero_documento, ud.direccion, ud.estado_id, ud.ciudad_id, ud.foto_perfil, ul.created_at as creado, ul.updated_at as actualizado,
                e.nombre as estado_nombre,
                c.nombre as ciudad_nombre,
                ud.numero_contacto
             FROM usuarios_login ul
             LEFT JOIN usuarios_datos ud ON ul.id = ud.usuario_login_id
             LEFT JOIN ubicaciones_venezuela e ON ud.estado_id = e.id
             LEFT JOIN ubicaciones_venezuela c ON ud.ciudad_id = c.id
             WHERE ud.nombre LIKE ? OR ud.apellido LIKE ? OR ul.nombre_usuario LIKE ? OR ud.correo LIKE ?
             ORDER BY ud.nombre ASC, ud.apellido ASC
             LIMIT ? OFFSET ?`,
            [...params, limite, offset]
        );
        return { usuarios, total };
    }

    // Obtener usuarios paginados y filtrados por texto y ubicaciones
    static async obtenerPaginado({ pagina = 1, limite = 10, filtro = '', estado_id, ciudad_id }) {
        const offset = (pagina - 1) * limite;
        const filtroSQL = filtro ? `%${filtro}%` : '%';
        let where = `WHERE (ud.nombre LIKE ? OR ud.apellido LIKE ? OR ul.nombre_usuario LIKE ? OR ud.correo LIKE ?)`;
        let params = [filtroSQL, filtroSQL, filtroSQL, filtroSQL];
        if (estado_id) { where += ' AND ud.estado_id = ?'; params.push(estado_id); }
        if (ciudad_id) { where += ' AND ud.ciudad_id = ?'; params.push(ciudad_id); }
        // Contar total
        const totalRes = await executeQuery(
            `SELECT COUNT(*) as total FROM usuarios_datos ud
             INNER JOIN usuarios_login ul ON ud.usuario_login_id = ul.id
             ${where}`,
            params
        );
        const total = totalRes[0].total;
        // Obtener página
        const usuarios = await executeQuery(
            `SELECT ul.id as login_id, ul.nombre_usuario, ud.id as datos_id, ud.nombre, ud.apellido, ud.correo, ud.tipo_documento, ud.numero_documento, ud.direccion, ud.estado_id, ud.ciudad_id, ud.foto_perfil, ul.created_at as creado, ul.updated_at as actualizado,
                e.nombre as estado_nombre,
                c.nombre as ciudad_nombre,
                ud.numero_contacto
             FROM usuarios_login ul
             LEFT JOIN usuarios_datos ud ON ul.id = ud.usuario_login_id
             LEFT JOIN ubicaciones_venezuela e ON ud.estado_id = e.id
             LEFT JOIN ubicaciones_venezuela c ON ud.ciudad_id = c.id
             ${where}
             ORDER BY ud.nombre ASC, ud.apellido ASC
             LIMIT ? OFFSET ?`,
            [...params, limite, offset]
        );
        return { usuarios, total };
    }

    // Eliminar usuario por datos_id (admin)
    static async eliminarPorDatosId(datosId) {
        try {
            await executeRawQuery('START TRANSACTION');
            // Obtener usuario_login_id
            const datos = await executeQuery('SELECT usuario_login_id FROM usuarios_datos WHERE id = ?', [datosId]);
            if (!datos[0]) throw new Error('Usuario no encontrado');
            const usuarioLoginId = datos[0].usuario_login_id;
            // Eliminar datos personales
            await executeQuery('DELETE FROM usuarios_datos WHERE id = ?', [datosId]);
            // Eliminar login
            await executeQuery('DELETE FROM usuarios_login WHERE id = ?', [usuarioLoginId]);
            await executeRawQuery('COMMIT');
            return true;
        } catch (error) {
            await executeRawQuery('ROLLBACK');
            console.error('Error eliminando usuario:', error);
            throw error;
        }
    }
}

module.exports = Usuario;
