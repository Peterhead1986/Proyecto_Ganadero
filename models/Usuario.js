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
                    municipio_id, parroquia_id, foto_perfil
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                datosPersonales.municipio_id || null,
                datosPersonales.parroquia_id || null,
                datosPersonales.foto_perfil || null
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
                    ud.id as datos_id,
                    ud.nombre,
                    ud.apellido,
                    ud.correo,
                    ud.tipo_documento,
                    ud.numero_documento,
                    ud.direccion,
                    ud.estado_id,
                    ud.ciudad_id,
                    ud.municipio_id,
                    ud.parroquia_id,
                    ud.foto_perfil,
                    e.nombre as estado_nombre,
                    c.nombre as ciudad_nombre,
                    m.nombre as municipio_nombre,
                    p.nombre as parroquia_nombre
                FROM usuarios_login ul
                LEFT JOIN usuarios_datos ud ON ul.id = ud.usuario_login_id
                LEFT JOIN ubicaciones_venezuela e ON ud.estado_id = e.id
                LEFT JOIN ubicaciones_venezuela c ON ud.ciudad_id = c.id
                LEFT JOIN ubicaciones_venezuela m ON ud.municipio_id = m.id
                LEFT JOIN ubicaciones_venezuela p ON ud.parroquia_id = p.id
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
                    ud.municipio_id,
                    ud.parroquia_id,
                    ud.foto_perfil,
                    e.nombre as estado_nombre,
                    c.nombre as ciudad_nombre,
                    m.nombre as municipio_nombre,
                    p.nombre as parroquia_nombre
                FROM usuarios_login ul
                LEFT JOIN usuarios_datos ud ON ul.id = ud.usuario_login_id
                LEFT JOIN ubicaciones_venezuela e ON ud.estado_id = e.id
                LEFT JOIN ubicaciones_venezuela c ON ud.ciudad_id = c.id
                LEFT JOIN ubicaciones_venezuela m ON ud.municipio_id = m.id
                LEFT JOIN ubicaciones_venezuela p ON ud.parroquia_id = p.id
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
}

module.exports = Usuario;
