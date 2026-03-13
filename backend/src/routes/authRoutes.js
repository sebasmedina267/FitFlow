const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Validación de contraseña: mínimo 8 caracteres, 1 mayúscula, 1 número, 1 símbolo
const passwordValidation = body('password')
  .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
  .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
  .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
  .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe contener al menos un símbolo');

// Registro
router.post('/register', [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son requeridos'),
  body('rol').isIn(['dueno', 'empleado']).withMessage('El rol debe ser dueno o empleado'),
  passwordValidation,
  validateRequest
], AuthController.register);

// Login
router.post('/login', [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son requeridos'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validateRequest
], AuthController.login);

// Recuperar contraseña
router.post('/recover-password', [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son requeridos'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe contener al menos un símbolo'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),
  validateRequest
], AuthController.recoverPassword);

// Verificar si existe dueño
router.get('/check-dueno', AuthController.checkDueno);

// Obtener perfil (requiere autenticación)
router.get('/profile', auth, AuthController.getProfile);

module.exports = router;
