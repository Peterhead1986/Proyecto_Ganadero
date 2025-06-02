-- database/schema.sql
-- Script para crear la base de datos del Sistema Ganadero Venezolano

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_ganadero_venezuela
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sistema_ganadero_venezuela;

-- Tabla de ubicaciones de Venezuela (Estados, Ciudades, Municipios, Parroquias)
CREATE TABLE IF NOT EXISTS ubicaciones_venezuela (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('estado', 'ciudad', 'municipio', 'parroquia') NOT NULL,
    padre_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_padre (padre_id),
    FOREIGN KEY (padre_id) REFERENCES ubicaciones_venezuela(id) ON DELETE CASCADE
);

-- Tabla de login de usuarios
CREATE TABLE IF NOT EXISTS usuarios_login (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario (nombre_usuario)
);

-- Tabla de datos personales de usuarios
CREATE TABLE IF NOT EXISTS usuarios_datos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_login_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    tipo_documento ENUM('cedula', 'rif_juridico') NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT,
    estado_id INT,
    ciudad_id INT,
    municipio_id INT,
    parroquia_id INT,
    foto_perfil VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_login_id) REFERENCES usuarios_login(id) ON DELETE CASCADE,
    FOREIGN KEY (estado_id) REFERENCES ubicaciones_venezuela(id),
    FOREIGN KEY (ciudad_id) REFERENCES ubicaciones_venezuela(id),
    FOREIGN KEY (municipio_id) REFERENCES ubicaciones_venezuela(id),
    FOREIGN KEY (parroquia_id) REFERENCES ubicaciones_venezuela(id),
    INDEX idx_correo (correo),
    INDEX idx_documento (numero_documento)
);

-- Tabla de datos de fincas
CREATE TABLE IF NOT EXISTS fincas_datos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre_finca VARCHAR(150) NOT NULL,
    direccion_finca TEXT,
    latitud DECIMAL(10,8) DEFAULT NULL,
    longitud DECIMAL(11,8) DEFAULT NULL,
    estado_id INT,
    ciudad_id INT,
    municipio_id INT,
    parroquia_id INT,
    logo_finca VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios_datos(id) ON DELETE CASCADE,
    FOREIGN KEY (estado_id) REFERENCES ubicaciones_venezuela(id),
    FOREIGN KEY (ciudad_id) REFERENCES ubicaciones_venezuela(id),
    FOREIGN KEY (municipio_id) REFERENCES ubicaciones_venezuela(id),
    FOREIGN KEY (parroquia_id) REFERENCES ubicaciones_venezuela(id),
    INDEX idx_usuario_finca (usuario_id),
    INDEX idx_nombre_finca (nombre_finca)
);