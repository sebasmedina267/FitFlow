const express = require('express');
const { body } = require('express-validator');
const MaquinaController = require('../controllers/maquinaController');
const { auth } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const upload = require('../middlewares/upload');

const router = express.Router();

router.use(auth);

// Obtener todas las máquinas
router.get('/', MaquinaController.getAll);

// Obtener máquina por ID
router.get('/:id', MaquinaController.getById);

// Crear máquina
router.post('/', 
  upload.single('foto'),
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    validateRequest
  ], 
  MaquinaController.create
);

// Actualizar máquina
router.put('/:id', 
  upload.single('foto'),
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    validateRequest
  ], 
  MaquinaController.update
);

// Eliminar máquina
router.delete('/:id', MaquinaController.delete);

module.exports = router;
