const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');

describe('Lista de usuarios - visibilidad del botón Editar', function() {
  let agentAdmin, agentUsuario;

  before(async function() {
    // Crear agentes para mantener sesión
    agentAdmin = request.agent(app);
    agentUsuario = request.agent(app);
    // Login admin
    await agentAdmin
      .post('/login')
      .send({ usuario: 'admin', password: 'admin123' });
    // Login usuario normal
    await agentUsuario
      .post('/login')
      .send({ usuario: 'usuario', password: 'usuario123' });
  });

  it('debe mostrar el botón Editar como enlace para admin', async function() {
    const res = await agentAdmin.get('/lista-usuarios');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('href="/usuarios/');
    expect(res.text).to.include('btn-editar');
  });

  it('no debe mostrar el botón Editar como enlace para usuario normal', async function() {
    const res = await agentUsuario.get('/lista-usuarios');
    expect(res.status).to.equal(200);
    // No debe haber ningún enlace de edición
    expect(res.text).to.not.include('href="/usuarios/');
    // Debe haber un botón deshabilitado
    expect(res.text).to.include('disabled');
    expect(res.text).to.include('btn-editar');
  });
});
