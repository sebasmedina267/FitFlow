const ClienteModel = require('../models/clienteModel');
const AuditoriaModel = require('../models/auditoriaModel');
const { AppError } = require('../middlewares/errorHandler');

const ClienteController = {
  // Obtener todos los clientes
  async getAll(req, res, next) {
    try {
      const clientes = await ClienteModel.getAll();
      res.json({ success: true, data: clientes });
    } catch (error) {
      next(error);
    }
  },

  // Obtener cliente por ID
  async getById(req, res, next) {
    try {
      const cliente = await ClienteModel.getById(req.params.id);
      if (!cliente) {
        throw new AppError('Cliente no encontrado', 404);
      }
      res.json({ success: true, data: cliente });
    } catch (error) {
      next(error);
    }
  },

  // Crear cliente
  async create(req, res, next) {
    try {
      const { nombre, edad, sexo, clases } = req.body;
      
      const idCliente = await ClienteModel.create(
        { nombre, edad, sexo },
        req.admin.id_admin
      );

      // Asignar clases si se proporcionan
      if (clases && clases.length > 0) {
        await ClienteModel.actualizarClases(idCliente, clases);
      }

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'CLIENTES',
        `Creó cliente: ${nombre}`
      );

      res.status(201).json({
        success: true,
        message: 'Cliente creado correctamente',
        data: { id_cliente: idCliente }
      });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar cliente
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, edad, sexo, clases } = req.body;

      const cliente = await ClienteModel.getById(id);
      if (!cliente) {
        throw new AppError('Cliente no encontrado', 404);
      }

      await ClienteModel.update(id, { nombre, edad, sexo });

      // Actualizar clases si se proporcionan
      if (clases !== undefined) {
        await ClienteModel.actualizarClases(id, clases);
      }

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'CLIENTES',
        `Actualizó cliente ID: ${id}`
      );

      res.json({
        success: true,
        message: 'Cliente actualizado correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Eliminar cliente
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const cliente = await ClienteModel.getById(id);
      if (!cliente) {
        throw new AppError('Cliente no encontrado', 404);
      }

      await ClienteModel.delete(id);

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'CLIENTES',
        `Eliminó cliente: ${cliente.nombre}`
      );

      res.json({
        success: true,
        message: 'Cliente eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener estadísticas
  async getEstadisticas(req, res, next) {
    try {
      const estadisticas = await ClienteModel.getEstadisticas();
      res.json({ success: true, data: estadisticas });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ClienteController;
