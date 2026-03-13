const express = require('express');
const { body } = require('express-validator');
const ClaseController = require('../controllers/claseController');
const { auth } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.use(auth);

// Obtener estadísticas
router.get('/estadisticas', ClaseController.getEstadisticas);

// Obtener todas las clases
router.get('/', ClaseController.getAll);

// Obtener clase por ID
router.get('/:id', ClaseController.getById);

// Crear clase
router.post('/', [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('tipo_pago').isIn(['mes', 'medio_mes', 'clase', 'dia']).withMessage('Tipo de pago inválido'),
  validateRequest
], ClaseController.create);

// Actualizar clase
router.put('/:id', [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('tipo_pago').isIn(['mes', 'medio_mes', 'clase', 'dia']).withMessage('Tipo de pago inválido'),
  validateRequest
], ClaseController.update);

// Eliminar clase
router.delete('/:id', ClaseController.delete);

module.exports = router;
