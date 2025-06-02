// config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistema_ganadero_venezuela',
    charset: 'utf8mb4',
    timezone: '+00:00'
};

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para probar la conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅  Conexión a MySQL establecida correctamente');
        connection.release();
        return true;
    } catch (error) {
        console.error('  Error conectando a MySQL:', error.message);
        return false;
    }
}

// Función para ejecutar queries con manejo de errores (prepared statements)
async function executeQuery(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Error ejecutando query:', error.message);
        throw error;
    }
}

// Función para ejecutar queries RAW (para transacciones y comandos especiales)
async function executeRawQuery(query, params = []) {
    try {
        const [results] = await pool.query(query, params);
        return results;
    } catch (error) {
        console.error('Error ejecutando raw query:', error.message);
        throw error;
    }
}

module.exports = {
    pool,
    testConnection,
    executeQuery,
    executeRawQuery
};