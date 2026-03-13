const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No autorizado. Token no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401));
    }
    next(error);
  }
};

// Middleware para verificar si es dueño
const isDueno = (req, res, next) => {
  if (req.admin.rol !== 'dueno') {
    return next(new AppError('Acceso denegado. Solo el dueño puede realizar esta acción', 403));
  }
  next();
};

module.exports = { auth, isDueno };
