const express = require('express');
const { body } = require('express-validator');
const EconomiaController = require('../controllers/economiaController');
const { auth } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.use(auth);

// Obtener balance general
router.get('/balance', EconomiaController.getBalance);

// Obtener estadísticas por período
router.get('/estadisticas', EconomiaController.getEstadisticas);

// Exportar a PDF
router.get('/exportar-pdf', EconomiaController.exportarPDF);

// Ingresos extra
router.get('/ingresos', EconomiaController.getIngresos);
router.post('/ingresos', [
  body('concepto').trim().notEmpty().withMessage('El concepto es requerido'),
  body('cantidad').isFloat({ min: 0 }).withMessage('La cantidad debe ser positiva'),
  validateRequest
], EconomiaController.createIngreso);

// Gastos extra
router.get('/gastos', EconomiaController.getGastos);
router.post('/gastos', [
  body('concepto').trim().notEmpty().withMessage('El concepto es requerido'),
  body('cantidad').isFloat({ min: 0 }).withMessage('La cantidad debe ser positiva'),
  validateRequest
], EconomiaController.createGasto);

module.exports = router;
