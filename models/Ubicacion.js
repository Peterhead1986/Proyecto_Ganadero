// models/Ubicacion.js - Modelo para manejo de ubicaciones (estados, ciudades, municipios, parroquias)
const { executeQuery } = require('../config/database');

class Ubicacion {
    // Obtener todos los estados
    static async obtenerEstados() {
        try {
            const result = await executeQuery(
                "SELECT id, nombre FROM ubicaciones_venezuela WHERE tipo = 'estado' ORDER BY nombre ASC"
            );
            return result;
        } catch (error) {
            console.error('Error obteniendo estados:', error);
            throw error;
        }
    }

    // Obtener ciudades por estado
    static async obtenerCiudadesPorEstado(estadoId) {
        try {
            const result = await executeQuery(
                "SELECT id, nombre FROM ubicaciones_venezuela WHERE tipo = 'ciudad' AND padre_id = ? ORDER BY nombre ASC",
                [estadoId]
            );
            return result;
        } catch (error) {
            console.error('Error obteniendo ciudades:', error);
            throw error;
        }
    }

    // Obtener municipios por estado
    static async obtenerMunicipiosPorEstado(estadoId) {
        try {
            const result = await executeQuery(
                "SELECT id, nombre FROM ubicaciones_venezuela WHERE tipo = 'municipio' AND padre_id = ? ORDER BY nombre ASC",
                [estadoId]
            );
            return result;
        } catch (error) {
            console.error('Error obteniendo municipios:', error);
            throw error;
        }
    }

    // Obtener parroquias por municipio
    static async obtenerParroquiasPorMunicipio(municipioId) {
        try {
            const result = await executeQuery(
                "SELECT id, nombre FROM ubicaciones_venezuela WHERE tipo = 'parroquia' AND padre_id = ? ORDER BY nombre ASC",
                [municipioId]
            );
            return result;
        } catch (error) {
            console.error('Error obteniendo parroquias:', error);
            throw error;
        }
    }

    // Obtener municipios por ciudad
    static async obtenerMunicipiosPorCiudad(ciudadId) {
        try {
            const result = await executeQuery(
                "SELECT id, nombre FROM ubicaciones_venezuela WHERE tipo = 'municipio' AND padre_id = ? ORDER BY nombre ASC",
                [ciudadId]
            );
            return result;
        } catch (error) {
            console.error('Error obteniendo municipios por ciudad:', error);
            throw error;
        }
    }

    // Buscar ubicaciones por nombre (opcional: filtrar por tipo)
    static async buscarPorNombre(nombre, tipo = null) {
        try {
            let query = "SELECT id, nombre, tipo, padre_id FROM ubicaciones_venezuela WHERE nombre LIKE ?";
            let params = [`%${nombre}%`];
            if (tipo) {
                query += ' AND tipo = ?';
                params.push(tipo);
            }
            query += ' ORDER BY nombre ASC LIMIT 20';
            const result = await executeQuery(query, params);
            return result;
        } catch (error) {
            console.error('Error buscando ubicaciones:', error);
            throw error;
        }
    }

    // Validar jerarquía de ubicaciones (estado, ciudad, municipio, parroquia)
    static async validarJerarquia(estadoId, ciudadId, municipioId, parroquiaId) {
        try {
            // Validar estado
            if (!estadoId) {
                return { valido: false, mensaje: 'Debe seleccionar un estado' };
            }
            // Validar ciudad (si aplica)
            if (ciudadId) {
                const ciudades = await this.obtenerCiudadesPorEstado(estadoId);
                if (!ciudades.some(c => c.id == ciudadId)) {
                    return { valido: false, mensaje: 'La ciudad no pertenece al estado seleccionado' };
                }
            }
            // Validar municipio (si aplica)
            if (municipioId) {
                let municipios;
                if (ciudadId) {
                    municipios = await this.obtenerMunicipiosPorCiudad(ciudadId);
                } else {
                    municipios = await this.obtenerMunicipiosPorEstado(estadoId);
                }
                if (!municipios.some(m => m.id == municipioId)) {
                    return { valido: false, mensaje: 'El municipio no pertenece a la ciudad o estado seleccionado' };
                }
            }
            // Validar parroquia (si aplica)
            if (parroquiaId && municipioId) {
                const parroquias = await this.obtenerParroquiasPorMunicipio(municipioId);
                if (!parroquias.some(p => p.id == parroquiaId)) {
                    return { valido: false, mensaje: 'La parroquia no pertenece al municipio seleccionado' };
                }
            }
            return { valido: true };
        } catch (error) {
            console.error('Error validando jerarquía de ubicaciones:', error);
            return { valido: false, mensaje: 'Error validando la jerarquía de ubicaciones' };
        }
    }
}

module.exports = Ubicacion;
