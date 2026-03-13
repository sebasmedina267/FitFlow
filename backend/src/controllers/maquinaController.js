const MaquinaModel = require('../models/maquinaModel');
const AuditoriaModel = require('../models/auditoriaModel');
const { AppError } = require('../middlewares/errorHandler');
const fs = require('fs');
const path = require('path');

const MaquinaController = {
  // Obtener todas las máquinas
  async getAll(req, res, next) {
    try {
      const maquinas = await MaquinaModel.getAll();
      res.json({ success: true, data: maquinas });
    } catch (error) {
      next(error);
    }
  },

  // Obtener máquina por ID
  async getById(req, res, next) {
    try {
      const maquina = await MaquinaModel.getById(req.params.id);
      if (!maquina) {
        throw new AppError('Máquina no encontrada', 404);
      }
      res.json({ success: true, data: maquina });
    } catch (error) {
      next(error);
    }
  },

  // Crear máquina
  async create(req, res, next) {
    try {
      const { nombre, descripcion } = req.body;
      const foto = req.file ? req.file.filename : null;

      const idMaquina = await MaquinaModel.create(
        { nombre, descripcion, foto },
        req.admin.id_admin
      );

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'MAQUINAS',
        `Creó máquina: ${nombre}`
      );

      res.status(201).json({
        success: true,
        message: 'Máquina creada correctamente',
        data: { id_maquina: idMaquina }
      });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar máquina
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      const maquina = await MaquinaModel.getById(id);
      if (!maquina) {
        throw new AppError('Máquina no encontrada', 404);
      }

      let foto = maquina.foto;
      if (req.file) {
        // Eliminar foto anterior si existe
        if (maquina.foto) {
          const oldPath = path.join(__dirname, '../../uploads', maquina.foto);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        foto = req.file.filename;
      }

      await MaquinaModel.update(id, { nombre, descripcion, foto });

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'MAQUINAS',
        `Actualizó máquina ID: ${id}`
      );

      res.json({
        success: true,
        message: 'Máquina actualizada correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Eliminar máquina
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const maquina = await MaquinaModel.getById(id);
      if (!maquina) {
        throw new AppError('Máquina no encontrada', 404);
      }

      // Eliminar foto si existe
      if (maquina.foto) {
        const fotoPath = path.join(__dirname, '../../uploads', maquina.foto);
        if (fs.existsSync(fotoPath)) {
          fs.unlinkSync(fotoPath);
        }
      }

      await MaquinaModel.delete(id);

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'MAQUINAS',
        `Eliminó máquina: ${maquina.nombre}`
      );

      res.json({
        success: true,
        message: 'Máquina eliminada correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = MaquinaController;
