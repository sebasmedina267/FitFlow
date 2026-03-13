const PagoModel = require('../models/pagoModel');
const AuditoriaModel = require('../models/auditoriaModel');
const { AppError } = require('../middlewares/errorHandler');

const PagoController = {
  // Obtener todos los pagos
  async getAll(req, res, next) {
    try {
      const { id_clase, pagado, fecha_inicio, fecha_fin } = req.query;
      const pagos = await PagoModel.getAll({
        idClase: id_clase,
        pagado: pagado !== undefined ? pagado === 'true' : undefined,
        fechaInicio: fecha_inicio,
        fechaFin: fecha_fin
      });
      res.json({ success: true, data: pagos });
    } catch (error) {
      next(error);
    }
  },

  // Obtener pagos por clase
  async getByClase(req, res, next) {
    try {
      const pagos = await PagoModel.getByClase(req.params.id_clase);
      res.json({ success: true, data: pagos });
    } catch (error) {
      next(error);
    }
  },

  // Marcar pago como pagado/no pagado
  async togglePago(req, res, next) {
    try {
      const { id } = req.params;
      const { pagado, importe } = req.body;

      if (pagado) {
        await PagoModel.marcarPagado(id, importe, req.admin.id_admin);
        
        // Auditoría
        await AuditoriaModel.registrar(
          req.admin.id_admin,
          'PAGOS',
          `Registró pago ID: ${id} por $${importe}`
        );
      } else {
        await PagoModel.marcarNoPagado(id);
        
        // Auditoría
        await AuditoriaModel.registrar(
          req.admin.id_admin,
          'PAGOS',
          `Desmarcó pago ID: ${id}`
        );
      }

      res.json({
        success: true,
        message: pagado ? 'Pago registrado' : 'Pago desmarcado'
      });
    } catch (error) {
      next(error);
    }
  },

  // Crear pago pendiente
  async create(req, res, next) {
    try {
      const { id_cliente, id_clase, importe } = req.body;

      const idPago = await PagoModel.crearPagoPendiente(
        id_cliente, id_clase, importe, req.admin.id_admin
      );

      res.status(201).json({
        success: true,
        message: 'Pago pendiente creado',
        data: { id_pago: idPago }
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener estadísticas
  async getEstadisticas(req, res, next) {
    try {
      const estadisticas = await PagoModel.getEstadisticas();
      res.json({ success: true, data: estadisticas });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = PagoController;
