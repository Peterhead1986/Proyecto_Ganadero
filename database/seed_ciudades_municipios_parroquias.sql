-- database/seed_ciudades_municipios_parroquias.sql Modificada y asignado el id_padre
-- Ejemplo de inserción de ciudades, municipios y parroquias para Venezuela
-- NOTA: Este archivo contiene solo ejemplos. Para un volcado completo, se recomienda importar desde una fuente oficial o dataset CSV.

USE sistema_ganadero_venezuela;

-- Ejemplo: Estado Aragua (ID: 4)
-- Ciudades
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maracay', 'ciudad', 4),
('La Victoria', 'ciudad', 4),
('El Limón', 'ciudad', 4);

-- Municipios de Aragua
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Girardot', 'municipio', 4),
('Mario Briceño Iragorry', 'municipio', 4),
('José Félix Ribas', 'municipio', 4);

-- Parroquias de Girardot (ID: 50)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Las Delicias', 'parroquia', 50),
('Choroní', 'parroquia', 50),
('Los Tacariguas', 'parroquia', 50);

-- Ejemplo: Estado Zulia (ID: 24)
-- Ciudades
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maracaibo', 'ciudad', 24),
('Cabimas', 'ciudad', 24),
('Ciudad Ojeda', 'ciudad', 24);

-- Municipios de Zulia
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maracaibo', 'municipio', 24),
('San Francisco', 'municipio', 24),
('Cabimas', 'municipio', 24);

-- Parroquias de Maracaibo (ID: 60)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Chiquinquirá', 'parroquia', 60),
('Cacique Mara', 'parroquia', 60),
('Cristo de Aranza', 'parroquia', 60);

-- Puedes continuar agregando más estados, ciudades, municipios y parroquias siguiendo este formato.
-- Si tienes un dataset CSV, puedes convertirlo a SQL con herramientas online o scripts.

INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Distrito Federal', 'estado', 1),
('Miranda', 'estado', 2),
('Aragua', 'estado', 3),
('Carabobo', 'estado', 4),
('Lara', 'estado', 5),
('Falcón', 'estado', 6),
('Yaracuy', 'estado', 7),
('Portuguesa', 'estado', 8),
('Guárico', 'estado', 9),
('Anzoátegui', 'estado', 10),
('Monagas', 'estado', 11),
('Sucre', 'estado', 12),
('Bolívar', 'estado', 13),
('Amazonas', 'estado', 14),
('Zulia', 'estado', 15),
('Táchira', 'estado', 16),
('Mérida', 'estado', 17),
('Trujillo', 'estado', 18),
('Barinas', 'estado', 19),
('Apure', 'estado', 20),
('Delta Amacuro', 'estado', 21),
('Vargas', 'estado', 22),
('Cojedes', 'estado', 23),
('Nueva Esparta', 'estado', 24);

-- cuidades organizdas con el id_padre de Venezuela ordenados alfabéticamente

-- Ciudades del Distrito Capital (padre_id = 1)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Caracas', 'ciudad', 1),
('Catia', 'ciudad', 1),
('El Recreo', 'ciudad', 1),
('El Valle', 'ciudad', 1),
('La Candelaria', 'ciudad', 1),
('La Pastora', 'ciudad', 1),
('Petare', 'ciudad', 1),
('San Agustín', 'ciudad', 1),
('San Bernardino', 'ciudad', 1),
('San José', 'ciudad', 1),
('San Juan', 'ciudad', 1),
('San Pedro', 'ciudad', 1),
('Santa Rosalía', 'ciudad', 1);

-- Ciudades de Miranda (padre_id = 2)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Aragüita', 'ciudad', 2),
('Baruta', 'ciudad', 2),
('Caicagua', 'ciudad', 2),
('Cartanal', 'ciudad', 2),
('Chacao', 'ciudad', 2),
('Charallave', 'ciudad', 2),
('Chuspita', 'ciudad', 2),
('Cúa', 'ciudad', 2),
('El Hatillo', 'ciudad', 2),
('Guarenas', 'ciudad', 2),
('Guatire', 'ciudad', 2),
('Higuerote', 'ciudad', 2),
('Los Anaucos', 'ciudad', 2),
('Los Teques', 'ciudad', 2),
('Ocumare del Tuy', 'ciudad', 2),
('Panaquire', 'ciudad', 2),
('Paracotos', 'ciudad', 2),
('Río Chico', 'ciudad', 2),
('San Antonio de Los Altos', 'ciudad', 2),
('San Francisco de Yare', 'ciudad', 2),
('Santa Lucía', 'ciudad', 2),
('Santa Teresa', 'ciudad', 2),
('Tácata', 'ciudad', 2);

-- Ciudades de Aragua (padre_id = 3)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maracay', 'ciudad', 3),
('La Victoria', 'ciudad', 3),
('Palo Negro', 'ciudad', 3),
('San Mateo', 'ciudad', 3),
('Turmero', 'ciudad', 3),
('Villa de Cura', 'ciudad', 3),
('Cagua', 'ciudad', 3),
('El Limón', 'ciudad', 3),
('Santa Cruz', 'ciudad', 3),
('Zuata', 'ciudad', 3),
('Colonia Tovar', 'ciudad', 3),
('El Consejo', 'ciudad', 3),
('Las Tejerías', 'ciudad', 3),
('Magdaleno', 'ciudad', 3),
('Ocumare de la Costa', 'ciudad', 3),
('San Casimiro', 'ciudad', 3),
('San Sebastián', 'ciudad', 3),
('Santa Rita', 'ciudad', 3);

-- Ciudades de Carabobo (padre_id = 4)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Valencia', 'ciudad', 4),
('Guacara', 'ciudad', 4),
('Los Guayos', 'ciudad', 4),
('Mariara', 'ciudad', 4),
('Miranda', 'ciudad', 4),
('Montalbán', 'ciudad', 4),
('Morón', 'ciudad', 4),
('Naguanagua', 'ciudad', 4),
('Puerto Cabello', 'ciudad', 4),
('San Joaquín', 'ciudad', 4),
('Tocuyito', 'ciudad', 4),
('Urama', 'ciudad', 4),
('Bejuma', 'ciudad', 4),
('Belén', 'ciudad', 4),
('Campo de Carabobo', 'ciudad', 4),
('Caneyes', 'ciudad', 4),
('Güigüe', 'ciudad', 4),
('Independencia', 'ciudad', 4),
('Juan José Mora', 'ciudad', 4),
('La Isabelica', 'ciudad', 4),
('San Diego', 'ciudad', 4),
('San Blas', 'ciudad', 4),
('Tacarigua', 'ciudad', 4),
('Vigirimita', 'ciudad', 4);

-- Ciudades de Lara (padre_id = 5)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Barquisimeto', 'ciudad', 5),
('Cabudare', 'ciudad', 5),
('Carora', 'ciudad', 5),
('El Tocuyo', 'ciudad', 5),
('Quíbor', 'ciudad', 5),
('Sanare', 'ciudad', 5),
('Sarare', 'ciudad', 5),
('Siquisique', 'ciudad', 5),
('Tintorero', 'ciudad', 5),
('Aguada Grande', 'ciudad', 5),
('Atarigua', 'ciudad', 5),
('Barbacoas', 'ciudad', 5),
('Buría', 'ciudad', 5),
('Cubiro', 'ciudad', 5),
('Duaca', 'ciudad', 5),
('El Eneal', 'ciudad', 5),
('Guarico', 'ciudad', 5),
('Humocaro Alto', 'ciudad', 5),
('Humocaro Bajo', 'ciudad', 5),
('La Miel', 'ciudad', 5),
('Moroturo', 'ciudad', 5),
('Río Claro', 'ciudad', 5),
('San Miguel', 'ciudad', 5),
('Santa Inés', 'ciudad', 5),
('Yaritagua', 'ciudad', 5);

-- Ciudades de Falcón (padre_id = 6)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Coro', 'ciudad', 6),
('Punto Fijo', 'ciudad', 6),
('Santa Ana de Coro', 'ciudad', 6),
('Pueblo Nuevo', 'ciudad', 6),
('Adícora', 'ciudad', 6),
('Boca de Aroa', 'ciudad', 6),
('Cabure', 'ciudad', 6),
('Capadare', 'ciudad', 6),
('Chichiriviche', 'ciudad', 6),
('Dabajuro', 'ciudad', 6),
('Judibana', 'ciudad', 6),
('La Cruz de Taratara', 'ciudad', 6),
('La Vela de Coro', 'ciudad', 6),
('Los Taques', 'ciudad', 6),
('Mirimire', 'ciudad', 6),
('Paraguaná', 'ciudad', 6),
('Pedregal', 'ciudad', 6),
('Píritu', 'ciudad', 6),
('San Juan de los Cayos', 'ciudad', 6),
('San Luis', 'ciudad', 6),
('Santa Cruz de Bucaral', 'ciudad', 6),
('Tucacas', 'ciudad', 6),
('Yaracal', 'ciudad', 6);

-- Ciudades de Yaracuy (padre_id = 7)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Felipe', 'ciudad', 7),
('Yaritagua', 'ciudad', 7),
('Chivacoa', 'ciudad', 7),
('Nirgua', 'ciudad', 7),
('Cocorote', 'ciudad', 7),
('Guama', 'ciudad', 7),
('Urachiche', 'ciudad', 7),
('Albarico', 'ciudad', 7),
('Aroa', 'ciudad', 7),
('Boraure', 'ciudad', 7),
('Campo Elías', 'ciudad', 7),
('Farriar', 'ciudad', 7),
('La Trinidad', 'ciudad', 7),
('Sabana de Parra', 'ciudad', 7),
('Salom', 'ciudad', 7);

-- Ciudades de Portuguesa (padre_id = 8)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Guanare', 'ciudad', 8),
('Acarigua', 'ciudad', 8),
('Araure', 'ciudad', 8),
('Agua Blanca', 'ciudad', 8),
('Biscucuy', 'ciudad', 8),
('Boconoíto', 'ciudad', 8),
('Guanarito', 'ciudad', 8),
('Ospino', 'ciudad', 8),
('Píritu', 'ciudad', 8),
('Villa Bruzual', 'ciudad', 8),
('Payara', 'ciudad', 8),
('San Genaro de Boconoíto', 'ciudad', 8),
('San Rafael de Onoto', 'ciudad', 8),
('Santa Rosalía', 'ciudad', 8),
('Turén', 'ciudad', 8);

-- Ciudades de Guárico (padre_id = 9)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Juan de los Morros', 'ciudad', 9),
('Calabozo', 'ciudad', 9),
('Valle de la Pascua', 'ciudad', 9),
('Zaraza', 'ciudad', 9),
('Altagracia de Orituco', 'ciudad', 9),
('Camaguán', 'ciudad', 9),
('Chaguaramas', 'ciudad', 9),
('El Socorro', 'ciudad', 9),
('Las Mercedes', 'ciudad', 9),
('Ortiz', 'ciudad', 9),
('San José de Guaribe', 'ciudad', 9),
('Santa María de Ipire', 'ciudad', 9),
('Tucupido', 'ciudad', 9);

-- Ciudades de Anzoátegui (padre_id = 10)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Barcelona', 'ciudad', 10),
('Puerto La Cruz', 'ciudad', 10),
('El Tigre', 'ciudad', 10),
('Anaco', 'ciudad', 10),
('Cantaura', 'ciudad', 10),
('Lechería', 'ciudad', 10),
('Pariaguán', 'ciudad', 10),
('Clarines', 'ciudad', 10),
('Guanta', 'ciudad', 10),
('Píritu', 'ciudad', 10),
('Puerto Píritu', 'ciudad', 10),
('San José de Guanipa', 'ciudad', 10),
('San Mateo', 'ciudad', 10),
('Santa Ana', 'ciudad', 10),
('Soledad', 'ciudad', 10);

-- Ciudades de Monagas (padre_id = 11)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maturín', 'ciudad', 11),
('Caripito', 'ciudad', 11),
('Punta de Mata', 'ciudad', 11),
('Temblador', 'ciudad', 11),
('Aguasay', 'ciudad', 11),
('Aragua de Maturín', 'ciudad', 11),
('Barrancas', 'ciudad', 11),
('Caicara de Maturín', 'ciudad', 11),
('Caripe', 'ciudad', 11),
('El Furrial', 'ciudad', 11),
('El Tejero', 'ciudad', 11),
('Jusepín', 'ciudad', 11),
('La Pica', 'ciudad', 11),
('San Antonio de Maturín', 'ciudad', 11),
('San Vicente', 'ciudad', 11);

-- Ciudades de Sucre (padre_id = 12)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Cumaná', 'ciudad', 12),
('Carúpano', 'ciudad', 12),
('Güiria', 'ciudad', 12),
('Araya', 'ciudad', 12),
('Cariaco', 'ciudad', 12),
('Casanay', 'ciudad', 12),
('El Pilar', 'ciudad', 12),
('Irapa', 'ciudad', 12),
('Marigüitar', 'ciudad', 12),
('Río Caribe', 'ciudad', 12),
('San Antonio del Golfo', 'ciudad', 12),
('Santa Fe', 'ciudad', 12),
('Tunapuy', 'ciudad', 12),
('Yaguaraparo', 'ciudad', 12),
('El Morro de Puerto Santo', 'ciudad', 12);

-- Ciudades de Bolívar (padre_id = 13)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Ciudad Bolívar', 'ciudad', 13),
('Ciudad Guayana', 'ciudad', 13),
('Upata', 'ciudad', 13),
('Caicara del Orinoco', 'ciudad', 13),
('El Callao', 'ciudad', 13),
('El Dorado', 'ciudad', 13),
('Guasipati', 'ciudad', 13),
('Maripa', 'ciudad', 13),
('Santa Elena de Uairén', 'ciudad', 13),
('Tumeremo', 'ciudad', 13),
('Puerto Ordaz', 'ciudad', 13),
('San Félix', 'ciudad', 13),
('San José de Chiquitos', 'ciudad', 13),
('Santa Bárbara', 'ciudad', 13),
('Surgidero de Parnaiba', 'ciudad', 13);

-- Ciudades de Amazonas (padre_id = 14)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Puerto Ayacucho', 'ciudad', 14),
('Maroa', 'ciudad', 14),
('San Carlos de Río Negro', 'ciudad', 14),
('San Fernando de Atabapo', 'ciudad', 14),
('San Juan de Manapiare', 'ciudad', 14),
('La Esmeralda', 'ciudad', 14);

-- Ciudades de Zulia (padre_id = 15)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maracaibo', 'ciudad', 15),
('Cabimas', 'ciudad', 15),
('Ciudad Ojeda', 'ciudad', 15),
('Santa Bárbara del Zulia', 'ciudad', 15),
('Machiques', 'ciudad', 15),
('La Concepción', 'ciudad', 15),
('San Carlos del Zulia', 'ciudad', 15),
('Sinamaica', 'ciudad', 15),
('Lagunillas', 'ciudad', 15),
('Mene Grande', 'ciudad', 15),
('Rosario de Perijá', 'ciudad', 15),
('San Francisco', 'ciudad', 15),
('San José de Perijá', 'ciudad', 15),
('Santa Rita', 'ciudad', 15),
('Villa del Rosario', 'ciudad', 15);

-- Ciudades de Táchira (padre_id = 16)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Cristóbal', 'ciudad', 16),
('Rubio', 'ciudad', 16),
('San Antonio del Táchira', 'ciudad', 16),
('Táriba', 'ciudad', 16),
('La Fría', 'ciudad', 16),
('Colón', 'ciudad', 16),
('Palmira', 'ciudad', 16),
('Ureña', 'ciudad', 16),
('Queniquea', 'ciudad', 16),
('San José de Bolívar', 'ciudad', 16),
('Santa Ana del Táchira', 'ciudad', 16),
('Capacho Nuevo', 'ciudad', 16),
('Capacho Viejo', 'ciudad', 16),
('La Grita', 'ciudad', 16),
('Lobatera', 'ciudad', 16);

-- Ciudades de Mérida (padre_id = 17)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Mérida', 'ciudad', 17),
('El Vigía', 'ciudad', 17),
('Ejido', 'ciudad', 17),
('Tovar', 'ciudad', 17),
('Lagunillas', 'ciudad', 17),
('Bailadores', 'ciudad', 17),
('Canagua', 'ciudad', 17),
('Chiguará', 'ciudad', 17),
('Guaraque', 'ciudad', 17),
('La Azulita', 'ciudad', 17),
('Mucuchíes', 'ciudad', 17),
('Mucurubá', 'ciudad', 17),
('Pueblo Llano', 'ciudad', 17),
('Santa Cruz de Mora', 'ciudad', 17),
('Santo Domingo', 'ciudad', 17);

-- Ciudades de Trujillo (padre_id = 18)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Trujillo', 'ciudad', 18),
('Valera', 'ciudad', 18),
('Boconó', 'ciudad', 18),
('La Quebrada', 'ciudad', 18),
('Monay', 'ciudad', 18),
('Pampán', 'ciudad', 18),
('Pampanito', 'ciudad', 18),
('Betijoque', 'ciudad', 18),
('Carvajal', 'ciudad', 18),
('Escuque', 'ciudad', 18),
('Isnotú', 'ciudad', 18),
('Jajó', 'ciudad', 18),
('La Mesa de Esnujaque', 'ciudad', 18),
('Santa Ana', 'ciudad', 18),
('Sabana Libre', 'ciudad', 18);

-- Ciudades de Barinas (padre_id = 19)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Barinas', 'ciudad', 19),
('Barinitas', 'ciudad', 19),
('Altamira', 'ciudad', 19),
('Calderas', 'ciudad', 19),
('Ciudad Bolivia', 'ciudad', 19),
('Dolores', 'ciudad', 19),
('Libertad', 'ciudad', 19),
('Sabaneta', 'ciudad', 19),
('Santa Bárbara', 'ciudad', 19),
('Socopó', 'ciudad', 19),
('Cañadón', 'ciudad', 19),
('El Cantón', 'ciudad', 19),
('La Luz', 'ciudad', 19),
('Mantecal', 'ciudad', 19),
('Puerto Nutrias', 'ciudad', 19);

-- Ciudades de Apure (padre_id = 20)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Fernando de Apure', 'ciudad', 20),
('Guasdualito', 'ciudad', 20),
('Achaguas', 'ciudad', 20),
('Biruaca', 'ciudad', 20),
('El Amparo', 'ciudad', 20),
('El Nula', 'ciudad', 20),
('La Victoria', 'ciudad', 20),
('Puerto Páez', 'ciudad', 20),
('San Juan de Payara', 'ciudad', 20),
('San Rafael de Atamaica', 'ciudad', 20),
('Santa Rosa', 'ciudad', 20);

-- Ciudades de Delta Amacuro (padre_id = 21)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Tucupita', 'ciudad', 21),
('Curiapo', 'ciudad', 21),
('Pedernales', 'ciudad', 21),
('San José de Amacuro', 'ciudad', 21),
('Juan Millán', 'ciudad', 21);

-- Ciudades de Vargas (padre_id = 22)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('La Guaira', 'ciudad', 22),
('Catia La Mar', 'ciudad', 22),
('Macuto', 'ciudad', 22),
('Caraballeda', 'ciudad', 22),
('Carayaca', 'ciudad', 22),
('El Junko', 'ciudad', 22),
('La Sabana', 'ciudad', 22),
('Oricao', 'ciudad', 22),
('Naiguatá', 'ciudad', 22),
('Tarma', 'ciudad', 22);

-- Ciudades de Cojedes (padre_id = 23)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Carlos', 'ciudad', 23),
('Tinaquillo', 'ciudad', 23),
('El Baúl', 'ciudad', 23),
('El Pao', 'ciudad', 23),
('Las Vegas', 'ciudad', 23),
('Libertad', 'ciudad', 23),
('Tinaco', 'ciudad', 23),
('El Amparo', 'ciudad', 23),
('La Sierra', 'ciudad', 23),
('Rómulo Gallegos', 'ciudad', 23);
-- Ciudades de Nueva Esparta (padre_id = 24)
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('La Asunción', 'ciudad', 24),
('Porlamar', 'ciudad', 24),
('Pampatar', 'ciudad', 24),
('Juan Griego', 'ciudad', 24),
('San Juan Bautista', 'ciudad', 24),
('El Valle del Espíritu Santo', 'ciudad', 24),
('Santa Ana', 'ciudad', 24),
('El Cercado', 'ciudad', 24),
('Los Robles', 'ciudad', 24),
('Villa Rosa', 'ciudad', 24);
















-----------------------------------------------------------------------------------------------------------------------

-- Municipios del Distrito Capital (padre_id = 1)

INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Libertador', 'municipio', 1);

-- Municipios de Miranda (padre_id = 2)

INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Acevedo', 'municipio', 2),
('Andrés Bello', 'municipio', 2),
('Baruta', 'municipio', 2),
('Brión', 'municipio', 2),
('Buroz', 'municipio', 2),
('Carrizal', 'municipio', 2),
('Chacao', 'municipio', 2),
('Cristóbal Rojas', 'municipio', 2),
('El Hatillo', 'municipio', 2),
('Guaicaipuro', 'municipio', 2),
('Independencia', 'municipio', 2),
('Lander', 'municipio', 2),
('Los Salias', 'municipio', 2),
('Páez', 'municipio', 2),
('Paz Castillo', 'municipio', 2),
('Pedro Gual', 'municipio', 2),
('Plaza', 'municipio', 2),
('Simón Bolívar', 'municipio', 2),
('Sucre', 'municipio', 2),
('Urdaneta', 'municipio', 2),
('Zamora', 'municipio', 2);

-- Municipios de Aragua (padre_id = 3)

INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Bolívar', 'municipio', 3),
('Camatagua', 'municipio', 3),
('Francisco Linares Alcántara', 'municipio', 3),
('Girardot', 'municipio', 3),
('José Ángel Lamas', 'municipio', 3),
('José Félix Ribas', 'municipio', 3),
('José Rafael Revenga', 'municipio', 3),
('Libertador', 'municipio', 3),
('Mario Briceño Iragorry', 'municipio', 3),
('Ocumare de la Costa de Oro', 'municipio', 3),
('San Casimiro', 'municipio', 3),
('San Sebastián', 'municipio', 3),
('Santiago Mariño', 'municipio', 3),
('Santos Michelena', 'municipio', 3),
('Sucre', 'municipio', 3),
('Tovar', 'municipio', 3),
('Urdaneta', 'municipio', 3),
('Zamora', 'municipio', 3);

-- Municipios de Carabobo (padre_id = 4)

INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Bejuma', 'municipio', 4),
('Carlos Arvelo', 'municipio', 4),
('Diego Ibarra', 'municipio', 4),
('Guacara', 'municipio', 4),
('Juan José Mora', 'municipio', 4),
('Libertador', 'municipio', 4),
('Los Guayos', 'municipio', 4),
('Miranda', 'municipio', 4),
('Montalbán', 'municipio', 4),
('Naguanagua', 'municipio', 4),
('Puerto Cabello', 'municipio', 4),
('San Diego', 'municipio', 4),
('San Joaquín', 'municipio', 4),
('Valencia', 'municipio', 4);

-- Municipios de Lara (padre_id = 5)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Andrés Eloy Blanco', 'municipio', 5),
('Crespo', 'municipio', 5),
('Iribarren', 'municipio', 5),
('Jiménez', 'municipio', 5),
('Morán', 'municipio', 5),
('Palavecino', 'municipio', 5),
('Simón Planas', 'municipio', 5),
('Torres', 'municipio', 5),
('Urdaneta', 'municipio', 5);

-- Municipios de Falcón (padre_id = 6)




INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Acosta', 'municipio', 6),
('Bolívar', 'municipio', 6),
('Buchivacoa', 'municipio', 6),
('Cacique Manaure', 'municipio', 6),
('Carirubana', 'municipio', 6),
('Colina', 'municipio', 6),
('Dabajuro', 'municipio', 6),
('Democracia', 'municipio', 6),
('Falcón', 'municipio', 6),
('Federación', 'municipio', 6),
('Jacura', 'municipio', 6),
('Los Taques', 'municipio', 6),
('Mauroa', 'municipio', 6),
('Miranda', 'municipio', 6),
('Monseñor Iturriza', 'municipio', 6),
('Palmasola', 'municipio', 6),
('Petit', 'municipio', 6),
('Píritu', 'municipio', 6),
('San Francisco', 'municipio', 6),
('Sucre', 'municipio', 6),
('Tocópero', 'municipio', 6),
('Unión', 'municipio', 6),
('Urumaco', 'municipio', 6),
('Zamora', 'municipio', 6);

-- Municipios de Yaracuy (padre_id = 7)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Arístides Bastidas', 'municipio', 7),
('Bolívar', 'municipio', 7),
('Bruzual', 'municipio', 7),
('Cocorote', 'municipio', 7),
('Independencia', 'municipio', 7),
('José Antonio Páez', 'municipio', 7),
('La Trinidad', 'municipio', 7),
('Manuel Monge', 'municipio', 7),
('Nirgua', 'municipio', 7),
('Peña', 'municipio', 7),
('San Felipe', 'municipio', 7),
('Sucre', 'municipio', 7),
('Urachiche', 'municipio', 7),
('Veroes', 'municipio', 7);

-- Municipios de Portuguesa (padre_id = 8)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Agua Blanca', 'municipio', 8),
('Araure', 'municipio', 8),
('Esteller', 'municipio', 8),
('Guanare', 'municipio', 8),
('Guanarito', 'municipio', 8),
('Monseñor José Vicente de Unda', 'municipio', 8),
('Ospino', 'municipio', 8),
('Páez', 'municipio', 8),
('Papelón', 'municipio', 8),
('San Genaro de Boconoíto', 'municipio', 8),
('San Rafael de Onoto', 'municipio', 8),
('Santa Rosalía', 'municipio', 8),
('Sucre', 'municipio', 8),
('Turén', 'municipio', 8);

-- Municipios de Guárico (padre_id = 9)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Camaguán', 'municipio', 9),
('Chaguaramas', 'municipio', 9),
('El Socorro', 'municipio', 9),
('Francisco de Miranda', 'municipio', 9),
('José Félix Ribas', 'municipio', 9),
('José Tadeo Monagas', 'municipio', 9),
('Juan Germán Roscio', 'municipio', 9),
('Julián Mellado', 'municipio', 9),
('Las Mercedes', 'municipio', 9),
('Leonardo Infante', 'municipio', 9),
('Pedro Zaraza', 'municipio', 9),
('Ortiz', 'municipio', 9),
('San Gerónimo de Guayabal', 'municipio', 9),
('San José de Guaribe', 'municipio', 9),
('Santa María de Ipire', 'municipio', 9);

-- Municipios de Anzoátegui (padre_id = 10)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Anaco', 'municipio', 10),
('Aragua', 'municipio', 10),
('Bolívar', 'municipio', 10),
('Bruzual', 'municipio', 10),
('Cajigal', 'municipio', 10),
('Carvajal', 'municipio', 10),
('Diego Bautista Urbaneja', 'municipio', 10),
('Freites', 'municipio', 10),
('Guanipa', 'municipio', 10),
('Guanta', 'municipio', 10),
('Independencia', 'municipio', 10),
('Libertad', 'municipio', 10),
('McGregor', 'municipio', 10),
('Miranda', 'municipio', 10),
('Monagas', 'municipio', 10),
('Peñalver', 'municipio', 10),
('Píritu', 'municipio', 10),
('San Juan de Capistrano', 'municipio', 10),
('Santa Ana', 'municipio', 10),
('Simón Bolívar', 'municipio', 10),
('Sotillo', 'municipio', 10),
('Urbaneja', 'municipio', 10),
('Zamora', 'municipio', 10);

-- Municipios de Monagas (padre_id = 11)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Acosta', 'municipio', 11),
('Aguasay', 'municipio', 11),
('Bolívar', 'municipio', 11),
('Caripe', 'municipio', 11),
('Cedeño', 'municipio', 11),
('Ezequiel Zamora', 'municipio', 11),
('Libertador', 'municipio', 11),
('Maturín', 'municipio', 11),
('Piar', 'municipio', 11),
('Punceres', 'municipio', 11),
('Santa Bárbara', 'municipio', 11),
('Sotillo', 'municipio', 11),
('Uracoa', 'municipio', 11);

-- Municipios de Sucre (padre_id = 12)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Andrés Eloy Blanco', 'municipio', 12),
('Andrés Mata', 'municipio', 12),
('Arismendi', 'municipio', 12),
('Benítez', 'municipio', 12),
('Bermúdez', 'municipio', 12),
('Bolívar', 'municipio', 12),
('Cajigal', 'municipio', 12),
('Cruz Salmerón Acosta', 'municipio', 12),
('Libertador', 'municipio', 12),
('Mariño', 'municipio', 12),
('Mejía', 'municipio', 12),
('Montes', 'municipio', 12),
('Ribero', 'municipio', 12),
('Sucre', 'municipio', 12),
('Valdez', 'municipio', 12);

-- Municipios de Bolívar (padre_id = 13)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Caroní', 'municipio', 13),
('Cedeño', 'municipio', 13),
('El Callao', 'municipio', 13),
('Gran Sabana', 'municipio', 13),
('Heres', 'municipio', 13),
('Piar', 'municipio', 13),
('Raúl Leoni', 'municipio', 13),
('Roscio', 'municipio', 13),
('Sifontes', 'municipio', 13),
('Sucre', 'municipio', 13),
('Padre Pedro Chien', 'municipio', 13);

-- Municipios de Amazonas (padre_id = 14)

INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Alto Orinoco', 'municipio', 14),
('Atabapo', 'municipio', 14),
('Atures', 'municipio', 14),
('Autana', 'municipio', 14),
('Manapiare', 'municipio', 14),
('Maroa', 'municipio', 14),
('Río Negro', 'municipio', 14);

-- Municipios de Zulia (padre_id = 15)

INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Almirante Padilla', 'municipio', 15),
('Baralt', 'municipio', 15),
('Cabimas', 'municipio', 15),
('Catatumbo', 'municipio', 15),
('Colón', 'municipio', 15),
('Francisco Javier Pulgar', 'municipio', 15),
('Jesús Enrique Lossada', 'municipio', 15),
('Jesús María Semprún', 'municipio', 15),
('La Cañada de Urdaneta', 'municipio', 15),
('Lagunillas', 'municipio', 15),
('Machiques de Perijá', 'municipio', 15),
('Mara', 'municipio', 15),
('Maracaibo', 'municipio', 15),
('Miranda', 'municipio', 15),
('Páez', 'municipio', 15),
('Rosario de Perijá', 'municipio', 15),
('San Francisco', 'municipio', 15),
('Santa Rita', 'municipio', 15),
('Simón Bolívar', 'municipio', 15),
('Sucre', 'municipio', 15),
('Valmore Rodríguez', 'municipio', 15);

-- Municipios de Táchira (padre_id = 16)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Andrés Bello', 'municipio', 16),
('Antonio Rómulo Costa', 'municipio', 16),
('Ayacucho', 'municipio', 16),
('Bolívar', 'municipio', 16),
('Cárdenas', 'municipio', 16),
('Córdoba', 'municipio', 16),
('Fernández Feo', 'municipio', 16),
('Francisco de Miranda', 'municipio', 16),
('García de Hevia', 'municipio', 16),
('Guásimos', 'municipio', 16),
('Independencia', 'municipio', 16),
('Jáuregui', 'municipio', 16),
('José María Vargas', 'municipio', 16),
('Junín', 'municipio', 16),
('Libertad', 'municipio', 16),
('Libertador', 'municipio', 16),
('Lobatera', 'municipio', 16),
('Michelena', 'municipio', 16),
('Panamericano', 'municipio', 16),
('Pedro María Ureña', 'municipio', 16),
('Rafael Urdaneta', 'municipio', 16),
('Samuel Darío Maldonado', 'municipio', 16),
('San Cristóbal', 'municipio', 16),
('San Judas Tadeo', 'municipio', 16),
('Seboruco', 'municipio', 16),
('Simón Rodríguez', 'municipio', 16),
('Sucre', 'municipio', 16),
('Torbes', 'municipio', 16);

-- Municipios de Táchira (padre_id = 17)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Tulio Febres Cordero', 'municipio', 17),
('Caracciolo Parra Olmedo', 'municipio', 17),
('Campo Elías', 'municipio', 17),
('Guaraque', 'municipio', 17),
('Julio César Salas', 'municipio', 17),
('Justo Briceño', 'municipio', 17),
('Libertador', 'municipio', 17),
('Miranda', 'municipio', 17),
('Obispo Ramos de Lora', 'municipio', 17),
('Padre Noguera', 'municipio', 17),
('Pueblo Llano', 'municipio', 17),
('Rangel', 'municipio', 17),
('Rivas Dávila', 'municipio', 17),
('Santos Marquina', 'municipio', 17),
('Sucre', 'municipio', 17),
('Tovar', 'municipio', 17),
('Zea', 'municipio', 17);

-- Municipios de Trujillo (padre_id = 18)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Andrés Bello', 'municipio', 18),
('Boconó', 'municipio', 18),
('Bolívar', 'municipio', 18),
('Candelaria', 'municipio', 18),
('Carache', 'municipio', 18),
('Escuque', 'municipio', 18),
('José Felipe Márquez Cañizales', 'municipio', 18),
('Juan Vicente Campos Elías', 'municipio', 18),
('La Ceiba', 'municipio', 18),('Miranda', 'municipio', 18),
('Monte Carmelo', 'municipio', 18),('Motatán', 'municipio', 18),
('Pampán', 'municipio', 18),
('Pampanito', 'municipio', 18),
('Rafael Rangel', 'municipio', 18),
('San Rafael de Carvajal', 'municipio', 18),
('Sucre', 'municipio', 18),
('Trujillo', 'municipio', 18),
('Urdaneta', 'municipio', 18),
('Valera', 'municipio', 18);

-- Municipios de Barinas (padre_id = 19)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Barinas', 'municipio', 19),
('Bolívar', 'municipio', 19),
('Cruz Paredes', 'municipio', 19),
('Ezequiel Zamora', 'municipio', 19),
('Obispos', 'municipio', 19),
('Pedraza', 'municipio', 19),
('Rojas', 'municipio', 19),
('Sosa', 'municipio', 19);

-- Municipios de Apure (padre_id = 20)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Andrés Eloy Blanco', 'municipio', 20),
('Achaguas', 'municipio', 20),
('Biruaca', 'municipio', 20),
('Muñoz', 'municipio', 20),
('Páez', 'municipio', 20),
('Pedro Camejo', 'municipio', 20),
('Rómulo Gallegos', 'municipio', 20),
('San Fernando', 'municipio', 20);

-- Municipios de Delta Amacuro (padre_id = 21)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Antonio Díaz', 'municipio', 21),
('Casacoima', 'municipio', 21),
('Pedernales', 'municipio', 21),
('Tucupita', 'municipio', 21);

-- Municipios de Vargas (padre_id = 22)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Vargas', 'municipio', 22);

-- Municipios de Cojedes (padre_id = 23)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Carlos', 'municipio', 23),
('Anzoátegui', 'municipio', 23),
('Girardot', 'municipio', 23),
('Lima Blanco', 'municipio', 23),
('Pao de San Juan Bautista', 'municipio', 23),
('Ricaurte', 'municipio', 23),
('Rómulo Gallegos', 'municipio', 23),
('Tinaco', 'municipio', 23),
('Tinaquillo', 'municipio', 23);

-- Municipios de Nueva Esparta (padre_id = 24)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Arismendi', 'municipio', 24),
('Díaz', 'municipio', 24),
('García', 'municipio', 24),
('Gómez', 'municipio', 24),
('Maneiro', 'municipio', 24),
('Marcano', 'municipio', 24),
('Mariño', 'municipio', 24),
('Península de Macanao', 'municipio', 24),
('Tubores', 'municipio', 24),
('Villalba', 'municipio', 24);


---------------------------------------------------------------------------------------------------------

-- PARROQUIAS DEL DISTRITO CAPITAL (padre_id = 1)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('23 de Enero', 'parroquia', 1),
('Altagracia', 'parroquia', 1),
('Antímano', 'parroquia', 1),
('Caricuao', 'parroquia', 1),
('Catedral', 'parroquia', 1),
('Coche', 'parroquia', 1),
('El Junquito', 'parroquia', 1),
('El Paraíso', 'parroquia', 1),
('El Recreo', 'parroquia', 1),
('El Valle', 'parroquia', 1),
('La Pastora', 'parroquia', 1),
('La Vega', 'parroquia', 1),
('Macarao', 'parroquia', 1),
('San Agustín', 'parroquia', 1),
('San Bernardino', 'parroquia', 1),
('San José', 'parroquia', 1),
('San Juan', 'parroquia', 1),
('San Pedro', 'parroquia', 1),
('Santa Rosalía', 'parroquia', 1),
('Santa Teresa', 'parroquia', 1),
('Sucre', 'parroquia', 1);

-- PARROQUIAS DE MIRANDA (padre_id = 2)




INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Aragüita', 'parroquia', 2),
('Baruta', 'parroquia', 2),
('Caicagua', 'parroquia', 2),
('Cartanal', 'parroquia', 2),
('Chacao', 'parroquia', 2),
('Charallave', 'parroquia', 2),
('Chuspita', 'parroquia', 2),
('Cúa', 'parroquia', 2),
('El Hatillo', 'parroquia', 2),
('Guarenas', 'parroquia', 2),
('Guatire', 'parroquia', 2),
('Higuerote', 'parroquia', 2),
('Los Anaucos', 'parroquia', 2),
('Los Teques', 'parroquia', 2),
('Ocumare del Tuy', 'parroquia', 2),
('Panaquire', 'parroquia', 2),
('Paracotos', 'parroquia', 2),
('Río Chico', 'parroquia', 2),
('San Antonio de Los Altos', 'parroquia', 2),
('San Francisco de Yare', 'parroquia', 2),
('Santa Lucía', 'parroquia', 2),
('Santa Teresa', 'parroquia', 2),
('Tácata', 'parroquia', 2);

-- PARROQUIAS DE ARAGUA (padre_id = 3)

INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Las Delicias', 'parroquia', 3),
('Choroní', 'parroquia', 3),
('San Mateo', 'parroquia', 3),
('Turmero', 'parroquia', 3),
('Villa de Cura', 'parroquia', 3),
('Cagua', 'parroquia', 3),
('El Limón', 'parroquia', 3),
('Santa Cruz', 'parroquia', 3),
('Zuata', 'parroquia', 3),
('Colonia Tovar', 'parroquia', 3),
('El Consejo', 'parroquia', 3),
('Las Tejerías', 'parroquia', 3),
('Magdaleno', 'parroquia', 3),
('Ocumare de la Costa', 'parroquia', 3),
('San Casimiro', 'parroquia', 3),
('San Sebastián', 'parroquia', 3),
('Santa Rita', 'parroquia', 3);

-- PARROQUIAS DE CARABOBO (padre_id = 4)



INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Valencia', 'parroquia', 4),
('Guacara', 'parroquia', 4),
('Los Guayos', 'parroquia', 4),
('Mariara', 'parroquia', 4),
('Miranda', 'parroquia', 4),
('Montalbán', 'parroquia', 4),
('Morón', 'parroquia', 4),
('Naguanagua', 'parroquia', 4),
('Puerto Cabello', 'parroquia', 4),
('San Joaquín', 'parroquia', 4),
('Tocuyito', 'parroquia', 4),
('Urama', 'parroquia', 4),
('Bejuma', 'parroquia', 4),
('Belén', 'parroquia', 4),
('Campo de Carabobo', 'parroquia', 4),
('Caneyes', 'parroquia', 4),
('Güigüe', 'parroquia', 4),
('Independencia', 'parroquia', 4),
('Juan José Mora', 'parroquia', 4),
('La Isabelica', 'parroquia', 4),
('San Diego', 'parroquia', 4),
('San Blas', 'parroquia', 4),
('Tacarigua', 'parroquia', 4),
('Vigirimita', 'parroquia', 4);

-- PARROQUIAS DE LARA (padre_id = 5)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Barquisimeto', 'parroquia', 5),
('Cabudare', 'parroquia', 5),
('Carora', 'parroquia', 5),
('El Tocuyo', 'parroquia', 5),
('Quíbor', 'parroquia', 5),
('Sanare', 'parroquia', 5),
('Sarare', 'parroquia', 5),
('Siquisique', 'parroquia', 5),
('Tintorero', 'parroquia', 5),
('Aguada Grande', 'parroquia', 5),
('Atarigua', 'parroquia', 5),
('Barbacoas', 'parroquia', 5),
('Buría', 'parroquia', 5),
('Cubiro', 'parroquia', 5),
('Duaca', 'parroquia', 5),
('El Eneal', 'parroquia', 5),
('Guarico', 'parroquia', 5),
('Humocaro Alto', 'parroquia', 5),
('Humocaro Bajo', 'parroquia', 5),
('La Miel', 'parroquia', 5),
('Moroturo', 'parroquia', 5),
('Río Claro', 'parroquia', 5),
('San Miguel', 'parroquia', 5),
('Santa Inés', 'parroquia', 5),
('Yaritagua', 'parroquia', 5);

-- PARROQUIAS DE FALCÓN (padre_id = 6)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Coro', 'parroquia', 6),
('Punto Fijo', 'parroquia', 6),
('Santa Ana de Coro', 'parroquia', 6),
('Pueblo Nuevo', 'parroquia', 6),
('Adícora', 'parroquia', 6),
('Boca de Aroa', 'parroquia', 6),
('Cabure', 'parroquia', 6),
('Capadare', 'parroquia', 6),
('Chichiriviche', 'parroquia', 6),
('Dabajuro', 'parroquia', 6),
('Judibana', 'parroquia', 6),
('La Cruz de Taratara', 'parroquia', 6),
('La Vela de Coro', 'parroquia', 6),
('Los Taques', 'parroquia', 6),
('Mirimire', 'parroquia', 6),
('Paraguaná', 'parroquia', 6),
('Pedregal', 'parroquia', 6),
('Píritu', 'parroquia', 6),
('San Juan de los Cayos', 'parroquia', 6),
('San Luis', 'parroquia', 6),
('Santa Cruz de Bucaral', 'parroquia', 6),
('Tucacas', 'parroquia', 6),
('Yaracal', 'parroquia', 6);

-- PARROQUIAS DE YARACUY (padre_id = 7)



INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Felipe', 'parroquia', 7),
('Yaritagua', 'parroquia', 7),
('Chivacoa', 'parroquia', 7),
('Nirgua', 'parroquia', 7),
('Cocorote', 'parroquia', 7),
('Guama', 'parroquia', 7),
('Urachiche', 'parroquia', 7),
('Albarico', 'parroquia', 7),
('Aroa', 'parroquia', 7),
('Boraure', 'parroquia', 7),
('Campo Elías', 'parroquia', 7),
('Farriar', 'parroquia', 7),
('La Trinidad', 'parroquia', 7),
('Sabana de Parra', 'parroquia', 7),
('Salom', 'parroquia', 7);

-- PARROQUIAS DE PORTUGUESA (padre_id = 8)



INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Guanare', 'parroquia', 8),
('Acarigua', 'parroquia', 8),
('Araure', 'parroquia', 8),
('Agua Blanca', 'parroquia', 8),
('Biscucuy', 'parroquia', 8),
('Boconoíto', 'parroquia', 8),
('Guanarito', 'parroquia', 8),
('Ospino', 'parroquia', 8),
('Píritu', 'parroquia', 8),
('Villa Bruzual', 'parroquia', 8),
('Payara', 'parroquia', 8),
('San Genaro de Boconoíto', 'parroquia', 8),
('San Rafael de Onoto', 'parroquia', 8),
('Santa Rosalía', 'parroquia', 8),
('Turén', 'parroquia', 8);

-- PARROQUIAS DE GUÁRICO (padre_id = 9)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Juan de los Morros', 'parroquia', 9),
('Calabozo', 'parroquia', 9),
('Valle de la Pascua', 'parroquia', 9),
('Zaraza', 'parroquia', 9),
('Altagracia de Orituco', 'parroquia', 9),
('Camaguán', 'parroquia', 9),
('Chaguaramas', 'parroquia', 9),
('El Socorro', 'parroquia', 9),
('Las Mercedes', 'parroquia', 9),
('Ortiz', 'parroquia', 9),
('San José de Guaribe', 'parroquia', 9),
('Santa María de Ipire', 'parroquia', 9),
('Tucupido', 'parroquia', 9);

-- PARROQUIAS DE ANZOÁTEGUI (padre_id = 10)



INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Barcelona', 'parroquia', 10),
('Puerto La Cruz', 'parroquia', 10),
('El Tigre', 'parroquia', 10),
('Anaco', 'parroquia', 10),
('Cantaura', 'parroquia', 10),
('Lechería', 'parroquia', 10),
('Pariaguán', 'parroquia', 10),
('Clarines', 'parroquia', 10),
('Guanta', 'parroquia', 10),
('Píritu', 'parroquia', 10),
('Puerto Píritu', 'parroquia', 10),
('San José de Guanipa', 'parroquia', 10),
('San Mateo', 'parroquia', 10),
('Santa Ana', 'parroquia', 10),
('Soledad', 'parroquia', 10);

-- PARROQUIAS DE MONAGAS (padre_id = 11)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maturín', 'parroquia', 11),
('Caripito', 'parroquia', 11),
('Punta de Mata', 'parroquia', 11),
('Temblador', 'parroquia', 11),
('Aguasay', 'parroquia', 11),
('Aragua de Maturín', 'parroquia', 11),
('Barrancas', 'parroquia', 11),
('Caicara de Maturín', 'parroquia', 11),
('Caripe', 'parroquia', 11),
('El Furrial', 'parroquia', 11),
('El Tejero', 'parroquia', 11),
('Jusepín', 'parroquia', 11),
('La Pica', 'parroquia', 11),
('San Antonio de Maturín', 'parroquia', 11),
('San Vicente', 'parroquia', 11);

-- PARROQUIAS DE SUCRE (padre_id = 12)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Cumaná', 'parroquia', 12),
('Carúpano', 'parroquia', 12),
('Güiria', 'parroquia', 12),
('Araya', 'parroquia', 12),
('Cariaco', 'parroquia', 12),
('Casanay', 'parroquia', 12),
('El Pilar', 'parroquia', 12),
('Irapa', 'parroquia', 12),
('Marigüitar', 'parroquia', 12),
('Río Caribe', 'parroquia', 12),
('San Antonio del Golfo', 'parroquia', 12),
('Santa Fe', 'parroquia', 12),
('Tunapuy', 'parroquia', 12),
('Yaguaraparo', 'parroquia', 12),
('El Morro de Puerto Santo', 'parroquia', 12);

-- PARROQUIAS DE BOLÍVAR (padre_id = 13)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Ciudad Bolívar', 'parroquia', 13),
('Ciudad Guayana', 'parroquia', 13),
('Upata', 'parroquia', 13),
('Caicara del Orinoco', 'parroquia', 13),
('El Callao', 'parroquia', 13),
('El Dorado', 'parroquia', 13),
('Guasipati', 'parroquia', 13),
('Maripa', 'parroquia', 13),
('Santa Elena de Uairén', 'parroquia', 13),
('Tumeremo', 'parroquia', 13),
('Puerto Ordaz', 'parroquia', 13),
('San Félix', 'parroquia', 13),
('San José de Chiquitos', 'parroquia', 13),
('Santa Bárbara', 'parroquia', 13),
('Surgidero de Parnaiba', 'parroquia', 13);

-- PARROQUIAS DE AMAZONAS (padre_id = 14)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Puerto Ayacucho', 'parroquia', 14),
('Maroa', 'parroquia', 14),
('San Carlos de Río Negro', 'parroquia', 14),
('San Fernando de Atabapo', 'parroquia', 14),
('San Juan de Manapiare', 'parroquia', 14),
('La Esmeralda', 'parroquia', 14);

-- PARROQUIAS DE ZULIA (padre_id = 15)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Maracaibo', 'parroquia', 15),
('Cabimas', 'parroquia', 15),
('Ciudad Ojeda', 'parroquia', 15),
('Santa Bárbara del Zulia', 'parroquia', 15),
('Machiques', 'parroquia', 15),
('La Concepción', 'parroquia', 15),
('San Carlos del Zulia', 'parroquia', 15),
('Sinamaica', 'parroquia', 15),
('Lagunillas', 'parroquia', 15),
('Mene Grande', 'parroquia', 15),
('Rosario de Perijá', 'parroquia', 15),
('San Francisco', 'parroquia', 15),
('San José de Perijá', 'parroquia', 15),
('Santa Rita', 'parroquia', 15),
('Villa del Rosario', 'parroquia', 15);

-- PARROQUIAS DE TÁCHIRA (padre_id = 16)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Cristóbal', 'parroquia', 16),
('Rubio', 'parroquia', 16),
('San Antonio del Táchira', 'parroquia', 16),
('Táriba', 'parroquia', 16),
('La Fría', 'parroquia', 16),
('Colón', 'parroquia', 16),
('Palmira', 'parroquia', 16),
('Ureña', 'parroquia', 16),
('Queniquea', 'parroquia', 16),
('San José de Bolívar', 'parroquia', 16),
('Santa Ana del Táchira', 'parroquia', 16),
('Capacho Nuevo', 'parroquia', 16),
('Capacho Viejo', 'parroquia', 16),
('La Grita', 'parroquia', 16),
('Lobatera', 'parroquia', 16);

-- PARROQUIAS DE MÉRIDA (padre_id = 17)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Mérida', 'parroquia', 17),
('El Vigía', 'parroquia', 17),
('Ejido', 'parroquia', 17),
('Tovar', 'parroquia', 17),
('Lagunillas', 'parroquia', 17),
('Bailadores', 'parroquia', 17),
('Canagua', 'parroquia', 17),
('Chiguará', 'parroquia', 17),
('Guaraque', 'parroquia', 17),
('La Azulita', 'parroquia', 17),
('Mucuchíes', 'parroquia', 17),
('Mucurubá', 'parroquia', 17),
('Pueblo Llano', 'parroquia', 17),
('Santa Cruz de Mora', 'parroquia', 17),
('Santo Domingo', 'parroquia', 17);

-- PARROQUIAS DE TRUJILLO (padre_id = 18)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Trujillo', 'parroquia', 18),
('Valera', 'parroquia', 18),
('Boconó', 'parroquia', 18),
('La Quebrada', 'parroquia', 18),
('Monay', 'parroquia', 18),
('Pampán', 'parroquia', 18),
('Pampanito', 'parroquia', 18),
('Betijoque', 'parroquia', 18),
('Carvajal', 'parroquia', 18),
('Escuque', 'parroquia', 18),
('Isnotú', 'parroquia', 18),
('Jajó', 'parroquia', 18),
('La Mesa de Esnujaque', 'parroquia', 18),
('Santa Ana', 'parroquia', 18),
('Sabana Libre', 'parroquia', 18);

-- PARROQUIAS DE BARINAS (padre_id = 19)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Barinas', 'parroquia', 19),
('Barinitas', 'parroquia', 19),
('Altamira', 'parroquia', 19),
('Calderas', 'parroquia', 19),
('Ciudad Bolivia', 'parroquia', 19),
('Dolores', 'parroquia', 19),
('Libertad', 'parroquia', 19),
('Sabaneta', 'parroquia', 19),
('Santa Bárbara', 'parroquia', 19),
('Socopó', 'parroquia', 19),
('Cañadón', 'parroquia', 19),
('El Cantón', 'parroquia', 19),
('La Luz', 'parroquia', 19),
('Mantecal', 'parroquia', 19),
('Puerto Nutrias', 'parroquia', 19);

-- PARROQUIAS DE APURE (padre_id = 20)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Fernando de Apure', 'parroquia', 20),
('Guasdualito', 'parroquia', 20),
('Achaguas', 'parroquia', 20),
('Biruaca', 'parroquia', 20),
('El Amparo', 'parroquia', 20),
('El Nula', 'parroquia', 20),
('La Victoria', 'parroquia', 20),
('Puerto Páez', 'parroquia', 20),
('San Juan de Payara', 'parroquia', 20),
('San Rafael de Atamaica', 'parroquia', 20),
('Santa Rosa', 'parroquia', 20);

-- PARROQUIAS DE DELTA AMACURO (padre_id = 21)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('Tucupita', 'parroquia', 21),
('Curiapo', 'parroquia', 21),
('Pedernales', 'parroquia', 21),
('San José de Amacuro', 'parroquia', 21),
('Juan Millán', 'parroquia', 21);

-- PARROQUIAS DE VARGAS (padre_id = 22)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('La Guaira', 'parroquia', 22),
('Catia La Mar', 'parroquia', 22),
('Macuto', 'parroquia', 22),
('Caraballeda', 'parroquia', 22),
('Carayaca', 'parroquia', 22),
('El Junko', 'parroquia', 22),
('La Sabana', 'parroquia', 22),
('Oricao', 'parroquia', 22),
('Naiguatá', 'parroquia', 22),
('Tarma', 'parroquia', 22);

-- PARROQUIAS DE COJEDES (padre_id = 23)


INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('San Carlos', 'parroquia', 23),
('Tinaquillo', 'parroquia', 23),
('El Baúl', 'parroquia', 23),
('El Pao', 'parroquia', 23),
('Las Vegas', 'parroquia', 23),
('Libertad', 'parroquia', 23),
('Tinaco', 'parroquia', 23),
('El Amparo', 'parroquia', 23),
('La Sierra', 'parroquia', 23),
('Rómulo Gallegos', 'parroquia', 23);

-- PARROQUIAS DE NUEVA ESPARTA (padre_id = 24)



INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('La Asunción', 'parroquia', 24),
('Porlamar', 'parroquia', 24),
('Pampatar', 'parroquia', 24),
('Juan Griego', 'parroquia', 24),
('San Juan Bautista', 'parroquia', 24),
('El Valle del Espíritu Santo', 'parroquia', 24),
('Santa Ana', 'parroquia', 24),
('El Cercado', 'parroquia', 24),
('Los Robles', 'parroquia', 24),
('Villa Rosa', 'parroquia', 24);







---------------------------------------------------------------------------------------------------------------

-- Parroquias de Venezuela ordenadas alfabéticamente
INSERT INTO ubicaciones_venezuela (nombre, tipo, padre_id) VALUES
('23 de Enero', 'parroquia', 107),
('Altagracia', 'parroquia', 107),
('Antímano', 'parroquia', 107),
('Candelaria', 'parroquia', 107),
('Caricuao', 'parroquia', 107),
('Catedral', 'parroquia', 107),
('Coche', 'parroquia', 107),
('El Junquito', 'parroquia', 107),
('El Paraíso', 'parroquia', 107),
('El Recreo', 'parroquia', 107),
('El Valle', 'parroquia', 107),
('La Pastora', 'parroquia', 107),
('La Vega', 'parroquia', 107),
('Macarao', 'parroquia', 107),
('San Agustín', 'parroquia', 107),
('San Bernardino', 'parroquia', 107),
('San José', 'parroquia', 107),
('San Juan', 'parroquia', 107),
('San Pedro', 'parroquia', 107),
('San Roque', 'parroquia', 107),
('Santa Rosalía', 'parroquia', 107),
('Santa Teresa', 'parroquia', 107),
('Sucre', 'parroquia', 107),
('Araguaney', 'parroquia', 208),
('El Jagüito', 'parroquia', 208),
('La Esperanza', 'parroquia', 208),
('Santa Isabel', 'parroquia', 208),
('Boconó', 'parroquia', 209),
('El Carmen', 'parroquia', 209),
('Mosquey', 'parroquia', 209),
('Ayacucho', 'parroquia', 210),
('Bretaña', 'parroquia', 210),
('General Rivas', 'parroquia', 210),
('Guaramacal', 'parroquia', 210),
('Vega de Guaramacal', 'parroquia', 210),
('Bolivia', 'parroquia', 211),
('Carvajal', 'parroquia', 211),
('Escuque', 'parroquia', 211),
('La Concepción', 'parroquia', 211),
('Santa Cruz', 'parroquia', 211),
('Arnoldo Gabaldón', 'parroquia', 212),
('Bolívar', 'parroquia', 212),
('Candelaria', 'parroquia', 212),
('Carrillo', 'parroquia', 212),
('Cegarra', 'parroquia', 212),
('Chejendé', 'parroquia', 212),
('Concepción', 'parroquia', 212),
('Cuicas', 'parroquia', 212),
('El Dividive', 'parroquia', 212),
('El Jobo', 'parroquia', 212),
('La Ceiba', 'parroquia', 212),
('La Concepción', 'parroquia', 212),
('Mendoza', 'parroquia', 212),
('Mercedes Díaz', 'parroquia', 212),
('San Lázaro', 'parroquia', 212),
('Santa Ana', 'parroquia', 212),
('Sucre', 'parroquia', 212),
('Tres de Febrero', 'parroquia', 212),
('Agua Santa', 'parroquia', 213),
('Agua Caliente', 'parroquia', 213),
('El Cenizo', 'parroquia', 213),
('El Recreo', 'parroquia', 213),
('La Palmita', 'parroquia', 213),
('Sabana Libre', 'parroquia', 213),
('Valerita', 'parroquia', 213),
('Andrés Bello', 'parroquia', 214),
('Antonio Pinto Salinas', 'parroquia', 214),
('Barinitas', 'parroquia', 214),
('Calderas', 'parroquia', 214),
('Cruz Carrillo', 'parroquia', 214),
('El Llano', 'parroquia', 214),
('La Venta', 'parroquia', 214),
('Las Llanadas', 'parroquia', 214),
('Mucuchachí', 'parroquia', 214),
('Mucurubá', 'parroquia', 214),
('San Rafael', 'parroquia', 214),
('Santa Cruz', 'parroquia', 214),
('Tovar', 'parroquia', 214),
('Acequias', 'parroquia', 215),
('Jají', 'parroquia', 215),
('La Mesa', 'parroquia', 215),
('San José', 'parroquia', 215),
('Tucaní', 'parroquia', 215),
('Florencio Ramírez', 'parroquia', 216),
('Pueblo Llano', 'parroquia', 216),
('San Pablo', 'parroquia', 216),
('Santa Bárbara', 'parroquia', 216),
('Timotes', 'parroquia', 216),
('Chachopo', 'parroquia', 217),
('El Morro', 'parroquia', 217),
('Guiria', 'parroquia', 217),
('La Azulita', 'parroquia', 217),
('La Blanca', 'parroquia', 217),
('La Puerta', 'parroquia', 217),
('Mesa Bolívar', 'parroquia', 217),
('Mesa de Las Palmas', 'parroquia', 217),
('Rangel', 'parroquia', 217),
('San Antonio', 'parroquia', 217),
('San Isidro', 'parroquia', 217),
('San José del Sur', 'parroquia', 217),
('Santa María de Caparo', 'parroquia', 217),
('Tovar', 'parroquia', 217),
('Zea', 'parroquia', 217),
('Alberto Adriani', 'parroquia', 218),
('Andrés Eloy Blanco', 'parroquia', 218),
('Capitán Vivas', 'parroquia', 218),
('Guaraque', 'parroquia', 218),
('Julio César Salas', 'parroquia', 218),
('Justo Briceño', 'parroquia', 218),
('Libertad', 'parroquia', 218),
('Obispo Ramos de Lora', 'parroquia', 218),
('Padre Noguera', 'parroquia', 218),
('Pueblo Nuevo del Sur', 'parroquia', 218),
('Rivas Dávila', 'parroquia', 218),
('Santos Marquina', 'parroquia', 218),
('Sucre', 'parroquia', 218),
('Torbes', 'parroquia', 218),
('Tulio Febres Cordero', 'parroquia', 218),
('Zea', 'parroquia', 218),
('Aragua', 'parroquia', 219),
('Arévalo González', 'parroquia', 219),
('Capacho Nuevo', 'parroquia', 219),
('Capacho Viejo', 'parroquia', 219),
('Cárdenas', 'parroquia', 219),
('Cordero', 'parroquia', 219),
('El Cobre', 'parroquia', 219),
('Fernández Feo', 'parroquia', 219),
('Francisco Romero Lobo', 'parroquia', 219),
('García de Hevia', 'parroquia', 219),
('Guásimos', 'parroquia', 219),
('Independencia', 'parroquia', 219),
('Jauregui', 'parroquia', 219),
('José María Vargas', 'parroquia', 219),
('Junín', 'parroquia', 219),
('La Concordia', 'parroquia', 219),
('Libertad', 'parroquia', 219),
('Libertador', 'parroquia', 219),
('Lobatera', 'parroquia', 219),
('Michelena', 'parroquia', 219),
('Panamericano', 'parroquia', 219),
('Pedro María Ureña', 'parroquia', 219),
('Rafael Urdaneta', 'parroquia', 219),
('Samuel Darío Maldonado', 'parroquia', 219),
('San Judas Tadeo', 'parroquia', 219),
('San Juan Bautista', 'parroquia', 219),
('San Sebastián', 'parroquia', 219),
('Seboruco', 'parroquia', 219),
('Simón Rodríguez', 'parroquia', 219),
('Sucre', 'parroquia', 219),
('Uribante', 'parroquia', 219),
('Ureña', 'parroquia', 219),
('Urribarrí', 'parroquia', 219),
('Andrés Bello', 'parroquia', 220),
('Antonio Rómulo Costa', 'parroquia', 220),
('Ayacucho', 'parroquia', 220),
('Bolívar', 'parroquia', 220),
('Cárdenas', 'parroquia', 220),
('Córdoba', 'parroquia', 220),
('Fernández Feo', 'parroquia', 220),
('Francisco de Miranda', 'parroquia', 220),
('García de Hevia', 'parroquia', 220),
('Guásimos', 'parroquia', 220),
('Independencia', 'parroquia', 220),
('Jáuregui', 'parroquia', 220),
('José María Vargas', 'parroquia', 220),
('Junín', 'parroquia', 220),
('La Concordia', 'parroquia', 220),
('Libertad', 'parroquia', 220),
('Libertador', 'parroquia', 220),
('Lobatera', 'parroquia', 220),
('Michelena', 'parroquia', 220),
('Panamericano', 'parroquia', 220),
('Pedro María Ureña', 'parroquia', 220),
('Rafael Urdaneta', 'parroquia', 220),
('Samuel Darío Maldonado', 'parroquia', 220),
('San Judas Tadeo', 'parroquia', 220),
('San Juan Bautista', 'parroquia', 220),
('San Sebastián', 'parroquia', 220),
('Seboruco', 'parroquia', 220),
('Simón Rodríguez', 'parroquia', 220),
('Sucre', 'parroquia', 220),
('Torbes', 'parroquia', 220),
('Uribante', 'parroquia', 220),
('Ureña', 'parroquia', 220),
('Urribarrí', 'parroquia', 220),
('Andrés Bello', 'parroquia', 221),
('Antonio Rómulo Costa', 'parroquia', 221),
('Ayacucho', 'parroquia', 221),
('Bolívar', 'parroquia', 221),
('Cárdenas', 'parroquia', 221),
('Córdoba', 'parroquia', 221),
('Fernández Feo', 'parroquia', 221),
('Francisco de Miranda', 'parroquia', 221),
('García de Hevia', 'parroquia', 221),
('Guásimos', 'parroquia', 221),
('Independencia', 'parroquia', 221),
('Jáuregui', 'parroquia', 221),
('José María Vargas', 'parroquia', 221),
('Junín', 'parroquia', 221),
('La Concordia', 'parroquia', 221),
('Libertad', 'parroquia', 221),
('Libertador', 'parroquia', 221),
('Lobatera', 'parroquia', 221),
('Michelena', 'parroquia', 221),
('Panamericano', 'parroquia', 221),
('Pedro María Ureña', 'parroquia', 221),
('Rafael Urdaneta', 'parroquia', 221),
('Samuel Darío Maldonado', 'parroquia', 221),
('San Judas Tadeo', 'parroquia', 221),
('San Juan Bautista', 'parroquia', 221),
('San Sebastián', 'parroquia', 221),
('Seboruco', 'parroquia', 221),
('Simón Rodríguez', 'parroquia', 221),
('Sucre', 'parroquia', 221),
('Torbes', 'parroquia', 221),
('Uribante', 'parroquia', 221),
('Ureña', 'parroquia', 221),
('Urribarrí', 'parroquia', 221),
('Las Delicias', 'parroquia', 50),
('Choroní', 'parroquia', 50),
('Los Tacariguas', 'parroquia', 50);