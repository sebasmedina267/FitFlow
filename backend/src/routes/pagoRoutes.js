const express = require('express');
const { body } = require('express-validator');
const PagoController = require('../controllers/pagoController');
const { auth } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.use(auth);

// Obtener estadísticas
router.get('/estadisticas', PagoController.getEstadisticas);

// Obtener pagos por clase
router.get('/clase/:id_clase', PagoController.getByClase);

// Obtener todos los pagos
router.get('/', PagoController.getAll);

// Crear pago pendiente
router.post('/', [
  body('id_cliente').isInt().withMessage('ID de cliente inválido'),
  body('id_clase').isInt().withMessage('ID de clase inválido'),
  body('importe').isFloat({ min: 0 }).withMessage('El importe debe ser positivo'),
  validateRequest
], PagoController.create);

// Marcar como pagado
router.post('/:id/pagar', [
  body('importe').isFloat({ gt: 0 }).withMessage('El importe debe ser un número positivo'),
  validateRequest
], PagoController.marcarPagado);

// Marcar como no pagado
router.post('/:id/desmarcar', PagoController.marcarNoPagado);

module.exports = router;
