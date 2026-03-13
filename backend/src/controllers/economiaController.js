const EconomiaModel = require('../models/economiaModel');
const AuditoriaModel = require('../models/auditoriaModel');
const PDFDocument = require('pdfkit');

const EconomiaController = {
  // Obtener ingresos extra
  async getIngresos(req, res, next) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const ingresos = await EconomiaModel.getIngresos({
        fechaInicio: fecha_inicio,
        fechaFin: fecha_fin
      });
      res.json({ success: true, data: ingresos });
    } catch (error) {
      next(error);
    }
  },

  // Crear ingreso extra
  async createIngreso(req, res, next) {
    try {
      const { concepto, cantidad } = req.body;

      const idIngreso = await EconomiaModel.createIngreso(
        concepto, cantidad, req.admin.id_admin
      );

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'ECONOMIA',
        `Registró ingreso extra: ${concepto} por $${cantidad}`
      );

      res.status(201).json({
        success: true,
        message: 'Ingreso registrado correctamente',
        data: { id_ingreso: idIngreso }
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener gastos extra
  async getGastos(req, res, next) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const gastos = await EconomiaModel.getGastos({
        fechaInicio: fecha_inicio,
        fechaFin: fecha_fin
      });
      res.json({ success: true, data: gastos });
    } catch (error) {
      next(error);
    }
  },

  // Crear gasto extra
  async createGasto(req, res, next) {
    try {
      const { concepto, cantidad } = req.body;

      const idGasto = await EconomiaModel.createGasto(
        concepto, cantidad, req.admin.id_admin
      );

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'ECONOMIA',
        `Registró gasto extra: ${concepto} por $${cantidad}`
      );

      res.status(201).json({
        success: true,
        message: 'Gasto registrado correctamente',
        data: { id_gasto: idGasto }
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener balance general
  async getBalance(req, res, next) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const balance = await EconomiaModel.getBalance({
        fechaInicio: fecha_inicio,
        fechaFin: fecha_fin
      });
      res.json({ success: true, data: balance });
    } catch (error) {
      next(error);
    }
  },

  // Obtener estadísticas por período
  async getEstadisticas(req, res, next) {
    try {
      const { periodo } = req.query; // dia, mes, ano
      const estadisticas = await EconomiaModel.getEstadisticasPorPeriodo(periodo || 'mes');
      res.json({ success: true, data: estadisticas });
    } catch (error) {
      next(error);
    }
  },

  // Exportar a PDF
  async exportarPDF(req, res, next) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const balance = await EconomiaModel.getBalance({
        fechaInicio: fecha_inicio,
        fechaFin: fecha_fin
      });

      const doc = new PDFDocument();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte_economia_${Date.now()}.pdf`);
      
      doc.pipe(res);

      // Título
      doc.fontSize(20).text('FitFlow - Reporte Económico', { align: 'center' });
      doc.moveDown();

      // Fecha del reporte
      const fechaReporte = new Date().toLocaleDateString('es-ES');
      doc.fontSize(12).text(`Fecha de generación: ${fechaReporte}`, { align: 'right' });
      
      if (fecha_inicio || fecha_fin) {
        doc.text(`Período: ${fecha_inicio || 'Inicio'} - ${fecha_fin || 'Actual'}`, { align: 'right' });
      }
      doc.moveDown(2);

      // Ingresos
      doc.fontSize(16).text('INGRESOS', { underline: true });
      doc.fontSize(12);
      doc.text(`Pagos de clientes: $${balance.ingresos.pagosClientes.toFixed(2)}`);
      doc.text(`Ventas de productos: $${balance.ingresos.ventasProductos.toFixed(2)}`);
      doc.text(`Ingresos extra: $${balance.ingresos.extra.toFixed(2)}`);
      doc.fontSize(14).text(`Total Ingresos: $${balance.ingresos.total.toFixed(2)}`, { underline: true });
      doc.moveDown();

      // Gastos
      doc.fontSize(16).text('GASTOS', { underline: true });
      doc.fontSize(12);
      doc.text(`Compras de productos: $${balance.gastos.comprasProductos.toFixed(2)}`);
      doc.text(`Gastos extra: $${balance.gastos.extra.toFixed(2)}`);
      doc.fontSize(14).text(`Total Gastos: $${balance.gastos.total.toFixed(2)}`, { underline: true });
      doc.moveDown();

      // Beneficios
      doc.fontSize(18);
      const color = balance.beneficios >= 0 ? 'green' : 'red';
      doc.fillColor(color).text(`BENEFICIOS: $${balance.beneficios.toFixed(2)}`, { underline: true });

      doc.end();

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'ECONOMIA',
        'Exportó reporte económico a PDF'
      );
    } catch (error) {
      next(error);
    }
  }
};

module.exports = EconomiaController;
