// test-db-connection.js
const { testConnection } = require('./config/database');

(async () => {
  const ok = await testConnection();
  if (ok) {
    console.log('Conexión exitosa a la base de datos.');
    process.exit(0);
  } else {
    console.error('No se pudo conectar a la base de datos.');
    process.exit(1);
  }
})();