const express = require('express');
const { body } = require('express-validator');
const ProductoController = require('../controllers/productoController');
const { auth } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const upload = require('../middlewares/upload');

const router = express.Router();

router.use(auth);

// Obtener estadísticas
router.get('/estadisticas', ProductoController.getEstadisticas);

// Obtener compras
router.get('/compras', ProductoController.getCompras);

// Obtener ventas
router.get('/ventas', ProductoController.getVentas);

// Obtener todos los productos
router.get('/', ProductoController.getAll);

// Obtener producto por ID
router.get('/:id', ProductoController.getById);

// Crear producto (compra inicial)
router.post('/', 
  upload.single('foto'),
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('precio_venta').isFloat({ min: 0 }).withMessage('El precio de venta debe ser positivo'),
    body('precio_compra').isFloat({ min: 0 }).withMessage('El precio de compra debe ser positivo'),
    validateRequest
  ], 
  ProductoController.create
);

// Actualizar producto
router.put('/:id', 
  upload.single('foto'),
  [
    body('precio_venta').isFloat({ min: 0 }).withMessage('El precio de venta debe ser positivo'),
    validateRequest
  ], 
  ProductoController.update
);

// Registrar compra (aumentar stock)
router.post('/compra', [
  body('id_producto').isInt().withMessage('ID de producto inválido'),
  body('cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),
  body('precio_compra').isFloat({ min: 0 }).withMessage('El precio de compra debe ser positivo'),
  validateRequest
], ProductoController.compra);

// Registrar venta (disminuir stock)
router.post('/venta', [
  body('id_producto').isInt().withMessage('ID de producto inválido'),
  body('cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),
  validateRequest
], ProductoController.venta);

module.exports = router;
