require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { testConnection } = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const claseRoutes = require('./routes/claseRoutes');
const maquinaRoutes = require('./routes/maquinaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const economiaRoutes = require('./routes/economiaRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/maquinas', maquinaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/economia', economiaRoutes);
app.use('/api/admins', adminRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'FitFlow API funcionando correctamente' });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
