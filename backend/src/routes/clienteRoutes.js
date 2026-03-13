const express = require('express');
const { body } = require('express-validator');
const ClienteController = require('../controllers/clienteController');
const { auth } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Obtener estadísticas (antes de :id para evitar conflicto)
router.get('/estadisticas', ClienteController.getEstadisticas);

// Obtener todos los clientes
router.get('/', ClienteController.getAll);

// Obtener cliente por ID
router.get('/:id', ClienteController.getById);

// Crear cliente
router.post('/', [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('edad').isInt({ min: 1 }).withMessage('La edad debe ser un número positivo'),
  body('sexo').isIn(['hombre', 'mujer']).withMessage('El sexo debe ser hombre o mujer'),
  validateRequest
], ClienteController.create);

// Actualizar cliente
router.put('/:id', [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('edad').isInt({ min: 1 }).withMessage('La edad debe ser un número positivo'),
  body('sexo').isIn(['hombre', 'mujer']).withMessage('El sexo debe ser hombre o mujer'),
  validateRequest
], ClienteController.update);

// Eliminar cliente
router.delete('/:id', ClienteController.delete);

module.exports = router;
