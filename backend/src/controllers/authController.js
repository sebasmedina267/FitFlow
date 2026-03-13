const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');
const AuditoriaModel = require('../models/auditoriaModel');
const { AppError } = require('../middlewares/errorHandler');

const AuthController = {
  // Registro de administrador
  async register(req, res, next) {
    try {
      const { nombre, apellidos, rol, password } = req.body;

      // Validar que si es dueño, no exista otro
      if (rol === 'dueno') {
        const existeDueno = await AdminModel.existeDueno();
        if (existeDueno) {
          throw new AppError('Ya existe un dueño registrado en el sistema', 400);
        }
      }

      // Verificar que no exista admin con mismo nombre y apellidos
      const existeAdmin = await AdminModel.getByNombreCompleto(nombre, apellidos);
      if (existeAdmin) {
        throw new AppError('Ya existe un administrador con ese nombre y apellidos', 400);
      }

      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear administrador
      const idAdmin = await AdminModel.create({
        nombre,
        apellidos,
        rol,
        password: hashedPassword
      });

      // Registrar en auditoría
      await AuditoriaModel.registrar(idAdmin, 'AUTH', `Registro de ${rol}: ${nombre} ${apellidos}`);

      res.status(201).json({
        success: true,
        message: 'Administrador registrado correctamente',
        data: { id_admin: idAdmin }
      });
    } catch (error) {
      next(error);
    }
  },

  // Login
  async login(req, res, next) {
    try {
      const { nombre, apellidos, password } = req.body;

      // Buscar administrador
      const admin = await AdminModel.getByNombreCompleto(nombre, apellidos);
      if (!admin) {
        throw new AppError('Credenciales incorrectas', 401);
      }

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        throw new AppError('Credenciales incorrectas', 401);
      }

      // Generar token
      const token = jwt.sign(
        { 
          id_admin: admin.id_admin, 
          nombre: admin.nombre, 
          apellidos: admin.apellidos,
          rol: admin.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Registrar en auditoría
      await AuditoriaModel.registrar(admin.id_admin, 'AUTH', 'Inicio de sesión');

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          admin: {
            id_admin: admin.id_admin,
            nombre: admin.nombre,
            apellidos: admin.apellidos,
            rol: admin.rol,
            foto: admin.foto
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Recuperar contraseña
  async recoverPassword(req, res, next) {
    try {
      const { nombre, apellidos, newPassword } = req.body;

      // Buscar administrador
      const admin = await AdminModel.getByNombreCompleto(nombre, apellidos);
      if (!admin) {
        throw new AppError('No se encontró un administrador con ese nombre', 404);
      }

      // Encriptar nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Actualizar contraseña
      await AdminModel.updatePassword(admin.id_admin, hashedPassword);

      // Registrar en auditoría
      await AuditoriaModel.registrar(admin.id_admin, 'AUTH', 'Recuperación de contraseña');

      res.json({
        success: true,
        message: 'Contraseña actualizada correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Verificar si existe dueño
  async checkDueno(req, res, next) {
    try {
      const existe = await AdminModel.existeDueno();
      res.json({
        success: true,
        data: { existeDueno: existe }
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener perfil del admin autenticado
  async getProfile(req, res, next) {
    try {
      const admin = await AdminModel.getById(req.admin.id_admin);
      if (!admin) {
        throw new AppError('Administrador no encontrado', 404);
      }

      res.json({
        success: true,
        data: admin
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;
