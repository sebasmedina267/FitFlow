const ClaseModel = require('../models/claseModel');
const AuditoriaModel = require('../models/auditoriaModel');
const { AppError } = require('../middlewares/errorHandler');

const ClaseController = {
  // Obtener todas las clases
  async getAll(req, res, next) {
    try {
      const clases = await ClaseModel.getAll();
      res.json({ success: true, data: clases });
    } catch (error) {
      next(error);
    }
  },

  // Obtener clase por ID
  async getById(req, res, next) {
    try {
      const clase = await ClaseModel.getById(req.params.id);
      if (!clase) {
        throw new AppError('Clase no encontrada', 404);
      }
      res.json({ success: true, data: clase });
    } catch (error) {
      next(error);
    }
  },

  // Crear clase
  async create(req, res, next) {
    try {
      const { nombre, descripcion, precio, tipo_pago, horarios, clientes } = req.body;

      const idClase = await ClaseModel.create(
        { nombre, descripcion, precio, tipo_pago, horarios },
        req.admin.id_admin
      );

      // Agregar clientes si se proporcionan
      if (clientes && clientes.length > 0) {
        await ClaseModel.agregarClientes(idClase, clientes);
      }

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'CLASES',
        `Creó clase: ${nombre}`
      );

      res.status(201).json({
        success: true,
        message: 'Clase creada correctamente',
        data: { id_clase: idClase }
      });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar clase
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, tipo_pago, horarios } = req.body;

      const clase = await ClaseModel.getById(id);
      if (!clase) {
        throw new AppError('Clase no encontrada', 404);
      }

      await ClaseModel.update(id, { nombre, descripcion, precio, tipo_pago, horarios });

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'CLASES',
        `Actualizó clase ID: ${id}`
      );

      res.json({
        success: true,
        message: 'Clase actualizada correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Eliminar clase
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const clase = await ClaseModel.getById(id);
      if (!clase) {
        throw new AppError('Clase no encontrada', 404);
      }

      await ClaseModel.delete(id);

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'CLASES',
        `Eliminó clase: ${clase.nombre}`
      );

      res.json({
        success: true,
        message: 'Clase eliminada correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener estadísticas
  async getEstadisticas(req, res, next) {
    try {
      const estadisticas = await ClaseModel.getEstadisticas();
      res.json({ success: true, data: estadisticas });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ClaseController;
