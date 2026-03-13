const AdminModel = require('../models/adminModel');
const AuditoriaModel = require('../models/auditoriaModel');
const { AppError } = require('../middlewares/errorHandler');
const fs = require('fs');
const path = require('path');

const AdminController = {
  // Obtener todos los administradores
  async getAll(req, res, next) {
    try {
      const admins = await AdminModel.getAll();
      res.json({ success: true, data: admins });
    } catch (error) {
      next(error);
    }
  },

  // Obtener admin por ID
  async getById(req, res, next) {
    try {
      const admin = await AdminModel.getById(req.params.id);
      if (!admin) {
        throw new AppError('Administrador no encontrado', 404);
      }
      res.json({ success: true, data: admin });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar perfil
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, apellidos, edad, sexo, direccion } = req.body;

      // Solo el propio admin o el dueño pueden actualizar
      if (req.admin.id_admin !== parseInt(id) && req.admin.rol !== 'dueno') {
        throw new AppError('No tienes permiso para actualizar este perfil', 403);
      }

      const admin = await AdminModel.getById(id);
      if (!admin) {
        throw new AppError('Administrador no encontrado', 404);
      }

      let foto = admin.foto;
      if (req.file) {
        if (admin.foto) {
          const oldPath = path.join(__dirname, '../../uploads', admin.foto);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        foto = req.file.filename;
      }

      await AdminModel.update(id, { nombre, apellidos, edad, sexo, direccion, foto });

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'ADMINISTRADORES',
        `Actualizó perfil de admin ID: ${id}`
      );

      res.json({
        success: true,
        message: 'Perfil actualizado correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Eliminar administrador (solo dueño)
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const admin = await AdminModel.getById(id);
      if (!admin) {
        throw new AppError('Administrador no encontrado', 404);
      }

      // No se puede eliminar al dueño
      if (admin.rol === 'dueno') {
        throw new AppError('No se puede eliminar al dueño del sistema', 400);
      }

      // Eliminar foto si existe
      if (admin.foto) {
        const fotoPath = path.join(__dirname, '../../uploads', admin.foto);
        if (fs.existsSync(fotoPath)) {
          fs.unlinkSync(fotoPath);
        }
      }

      await AdminModel.delete(id);

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'ADMINISTRADORES',
        `Eliminó administrador: ${admin.nombre} ${admin.apellidos}`
      );

      res.json({
        success: true,
        message: 'Administrador eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener auditoría
  async getAuditoria(req, res, next) {
    try {
      const { id_admin, fecha_inicio, fecha_fin, modulo } = req.query;
      
      // Si no es dueño, solo puede ver sus propias operaciones
      const filtros = {
        fechaInicio: fecha_inicio,
        fechaFin: fecha_fin,
        modulo
      };

      if (req.admin.rol !== 'dueno') {
        filtros.idAdmin = req.admin.id_admin;
      } else if (id_admin) {
        filtros.idAdmin = id_admin;
      }

      const auditoria = await AuditoriaModel.getAll(filtros);
      res.json({ success: true, data: auditoria });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AdminController;
