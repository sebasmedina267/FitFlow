require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await testConnection();

    // Iniciar el servidor
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Servidor FitFlow corriendo en http://localhost:${PORT}`);
      console.log(`📝 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`⚙️  Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
    });

    // Manejo de errores del servidor
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${PORT} ya está en uso`);
      } else {
        console.error('❌ Error en el servidor:', error.message);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error.message);
  process.exit(1);
});

// Iniciar el servidor
startServer();
