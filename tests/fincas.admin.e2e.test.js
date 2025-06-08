// tests/fincas.admin.e2e.test.js
// Pruebas automáticas para el flujo de registro de finca por admin
const request = require('supertest');
const app = require('../app');
const Usuario = require('../models/Usuario');
const Finca = require('../models/Finca');

let adminCookie;
let testUserId;

describe('Flujo admin: registro de finca para usuario', () => {
    beforeAll(async () => {
        // Crea un usuario admin de prueba y un usuario normal
        // (Ajusta según tu lógica de creación de usuarios y sesiones)
        const admin = await Usuario.buscarPorNombreUsuario('admin');
        if (!admin) throw new Error('No existe usuario admin para pruebas');
        // Simula login admin
        const res = await request(app)
            .post('/auth/login')
            .send({ nombre_usuario: 'admin', password: 'admin123' });
        adminCookie = res.headers['set-cookie'];
        // Crea un usuario normal de prueba si no existe
        let user = await Usuario.buscarPorNombreUsuario('testuser');
        if (!user) {
            // Debes tener una función para crear usuarios de prueba
            // user = await Usuario.crear(...)
        }
        user = await Usuario.buscarPorNombreUsuario('testuser');
        testUserId = user.datos_id;
    });

    it('GET /fincas/registro?usuario_id=... solo admin puede acceder', async () => {
        const res = await request(app)
            .get(`/fincas/registro?usuario_id=${testUserId}`)
            .set('Cookie', adminCookie);
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Registro de Finca');
        expect(res.text).toContain('Usuario propietario de la finca');
    });

    it('POST /fincas/registro como admin registra finca para usuario', async () => {
        const fincaData = {
            usuario_id: testUserId,
            nombre_finca: 'Finca Test Admin',
            direccion_finca: 'Dirección de prueba',
            estado_id: 1,
            ciudad_id: 1,
            municipio_id: 1,
            parroquia_id: 1
        };
        const res = await request(app)
            .post('/fincas/registro')
            .set('Cookie', adminCookie)
            .field('usuario_id', fincaData.usuario_id)
            .field('nombre_finca', fincaData.nombre_finca)
            .field('direccion_finca', fincaData.direccion_finca)
            .field('estado_id', fincaData.estado_id)
            .field('ciudad_id', fincaData.ciudad_id)
            .field('municipio_id', fincaData.municipio_id)
            .field('parroquia_id', fincaData.parroquia_id);
        expect(res.statusCode).toBe(302); // Redirige tras éxito
        // Opcional: verifica en la base de datos
        const finca = await Finca.buscarPorNombre('Finca Test Admin');
        expect(finca).toBeTruthy();
        expect(finca.usuario_id).toBe(testUserId);
    });

    it('GET /fincas/registro?usuario_id=... falla para no admin', async () => {
        // Simula login de usuario normal
        const userRes = await request(app)
            .post('/auth/login')
            .send({ nombre_usuario: 'testuser', password: 'testuser123' });
        const userCookie = userRes.headers['set-cookie'];
        const res = await request(app)
            .get(`/fincas/registro?usuario_id=${testUserId}`)
            .set('Cookie', userCookie);
        expect(res.statusCode).toBe(403);
        expect(res.text).toContain('Solo los administradores pueden registrar fincas para otros usuarios');
    });

    it('POST /fincas/registro falla si falta nombre_finca', async () => {
        const res = await request(app)
            .post('/fincas/registro')
            .set('Cookie', adminCookie)
            .field('usuario_id', testUserId)
            // .field('nombre_finca', '') // omitido
            .field('direccion_finca', 'Dirección de prueba')
            .field('estado_id', 1)
            .field('ciudad_id', 1)
            .field('municipio_id', 1)
            .field('parroquia_id', 1);
        expect(res.statusCode).toBe(200); // Renderiza el formulario con error
        expect(res.text).toContain('El nombre de la finca es requerido');
    });

    it('POST /fincas/registro falla si usuario_id no existe', async () => {
        const res = await request(app)
            .post('/fincas/registro')
            .set('Cookie', adminCookie)
            .field('usuario_id', 999999) // id inexistente
            .field('nombre_finca', 'Finca Error')
            .field('direccion_finca', 'Dirección de prueba')
            .field('estado_id', 1)
            .field('ciudad_id', 1)
            .field('municipio_id', 1)
            .field('parroquia_id', 1);
        expect(res.statusCode).toBe(404);
        expect(res.text).toContain('El usuario especificado no existe');
    });

    it('POST /fincas/registro falla si no está autenticado', async () => {
        const res = await request(app)
            .post('/fincas/registro')
            .field('usuario_id', testUserId)
            .field('nombre_finca', 'Finca Sin Login')
            .field('direccion_finca', 'Dirección de prueba')
            .field('estado_id', 1)
            .field('ciudad_id', 1)
            .field('municipio_id', 1)
            .field('parroquia_id', 1);
        // Redirige a login o error 401
        expect([302, 401]).toContain(res.statusCode);
    });

    it('POST /fincas/registro como usuario normal solo puede registrar para sí mismo', async () => {
        // Simula login de usuario normal
        const userRes = await request(app)
            .post('/auth/login')
            .send({ nombre_usuario: 'testuser', password: 'testuser123' });
        const userCookie = userRes.headers['set-cookie'];
        // Intenta registrar finca para otro usuario (no admin)
        const res = await request(app)
            .post('/fincas/registro')
            .set('Cookie', userCookie)
            .field('usuario_id', admin.datos_id) // intenta para admin
            .field('nombre_finca', 'Finca No Permitida')
            .field('direccion_finca', 'Dirección de prueba')
            .field('estado_id', 1)
            .field('ciudad_id', 1)
            .field('municipio_id', 1)
            .field('parroquia_id', 1);
        expect(res.statusCode).toBe(403);
        expect(res.text).toContain('Solo los administradores pueden registrar fincas para otros usuarios');
    });
});
