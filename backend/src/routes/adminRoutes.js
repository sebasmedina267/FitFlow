const express = require('express');
const { body } = require('express-validator');
const AdminController = require('../controllers/adminController');
const { auth, isDueno } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const upload = require('../middlewares/upload');

const router = express.Router();

router.use(auth);

// Obtener auditoría
router.get('/auditoria', AdminController.getAuditoria);

// Obtener todos los administradores
router.get('/', AdminController.getAll);

// Obtener admin por ID
router.get('/:id', AdminController.getById);

// Actualizar perfil
router.put('/:id', 
  upload.single('foto'),
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('apellidos').trim().notEmpty().withMessage('Los apellidos son requeridos'),
    validateRequest
  ], 
  AdminController.update
);

// Eliminar administrador (solo dueño)
router.delete('/:id', isDueno, AdminController.delete);

module.exports = router;
