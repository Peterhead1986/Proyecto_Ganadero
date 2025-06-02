-- database/seed_ubicaciones.sql original no modificada
-- Datos de ubicaciones de Venezuela

USE sistema_ganadero_venezuela;

-- Insertar Estados de Venezuela
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Amazonas', 'estado', NULL),
('Anzoátegui', 'estado', NULL),
('Apure', 'estado', NULL),
('Aragua', 'estado', NULL),
('Barinas', 'estado', NULL),
('Bolívar', 'estado', NULL),
('Carabobo', 'estado', NULL),
('Cojedes', 'estado', NULL),
('Delta Amacuro', 'estado', NULL),
('Distrito Capital', 'estado', NULL),
('Falcón', 'estado', NULL),
('Guárico', 'estado', NULL),
('Lara', 'estado', NULL),
('Mérida', 'estado', NULL),
('Miranda', 'estado', NULL),
('Monagas', 'estado', NULL),
('Nueva Esparta', 'estado', NULL),
('Portuguesa', 'estado', NULL),
('Sucre', 'estado', NULL),
('Táchira', 'estado', NULL),
('Trujillo', 'estado', NULL),
('Vargas', 'estado', NULL),
('Yaracuy', 'estado', NULL),
('Zulia', 'estado', NULL);

-- Ciudades principales de algunos estados (ejemplo)
-- Estado Distrito Capital (ID: 10)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Caracas', 'ciudad', 10);

-- Estado Miranda (ID: 15)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Los Teques', 'ciudad', 15),
('Guarenas', 'ciudad', 15),
('Guatire', 'ciudad', 15),
('Petare', 'ciudad', 15);

-- Estado Carabobo (ID: 7)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Valencia', 'ciudad', 7),
('Puerto Cabello', 'ciudad', 7),
('Guacara', 'ciudad', 7);

-- Estado Zulia (ID: 24)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maracaibo', 'ciudad', 24),
('Cabimas', 'ciudad', 24),
('Ciudad Ojeda', 'ciudad', 24);

-- Estado Lara (ID: 13)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Barquisimeto', 'ciudad', 13),
('Cabudare', 'ciudad', 13);

-- Municipios de ejemplo para Distrito Capital
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Libertador', 'municipio', 25); -- Caracas tiene ID 25

-- Parroquias de ejemplo para Municipio Libertador
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Catedral', 'parroquia', 38),
('San Juan', 'parroquia', 38),
('Santa Teresa', 'parroquia', 38),
('La Pastora', 'parroquia', 38),
('Altagracia', 'parroquia', 38),
('San José', 'parroquia', 38),
('Sucre', 'parroquia', 38),
('23 de Enero', 'parroquia', 38),
('El Valle', 'parroquia', 38),
('El Recreo', 'parroquia', 38),
('Macarao', 'parroquia', 38);

-- Municipios y ciudades adicionales para otros estados
-- Estado Aragua (ID: 4)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maracay', 'ciudad', 4),
('La Victoria', 'ciudad', 4),
('El Limón', 'ciudad', 4);

-- Estado Táchira (ID: 20)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Cristóbal', 'ciudad', 20),
('Táriba', 'ciudad', 20),
('San Antonio del Táchira', 'ciudad', 20);