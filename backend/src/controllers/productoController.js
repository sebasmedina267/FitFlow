const ProductoModel = require('../models/productoModel');
const AuditoriaModel = require('../models/auditoriaModel');
const { AppError } = require('../middlewares/errorHandler');
const fs = require('fs');
const path = require('path');

const ProductoController = {
  // Obtener todos los productos
  async getAll(req, res, next) {
    try {
      const productos = await ProductoModel.getAll();
      const totales = await ProductoModel.getTotales();
      res.json({ success: true, data: { productos, totales } });
    } catch (error) {
      next(error);
    }
  },

  // Obtener producto por ID
  async getById(req, res, next) {
    try {
      const producto = await ProductoModel.getById(req.params.id);
      if (!producto) {
        throw new AppError('Producto no encontrado', 404);
      }
      res.json({ success: true, data: producto });
    } catch (error) {
      next(error);
    }
  },

  // Crear producto (compra inicial)
  async create(req, res, next) {
    try {
      const { nombre, precio_venta, precio_compra, stock, descripcion } = req.body;
      const foto = req.file ? req.file.filename : null;

      const idProducto = await ProductoModel.create({
        nombre, precio_venta, precio_compra, stock, descripcion, foto
      }, req.admin.id_admin);

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'PRODUCTOS',
        `Creó producto: ${nombre} (Stock: ${stock})`
      );

      res.status(201).json({
        success: true,
        message: 'Producto creado correctamente',
        data: { id_producto: idProducto }
      });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar producto (solo descripcion, foto y precio_venta)
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { precio_venta, descripcion } = req.body;

      const producto = await ProductoModel.getById(id);
      if (!producto) {
        throw new AppError('Producto no encontrado', 404);
      }

      let foto = producto.foto;
      if (req.file) {
        if (producto.foto) {
          const oldPath = path.join(__dirname, '../../uploads', producto.foto);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        foto = req.file.filename;
      }

      await ProductoModel.update(id, { precio_venta, descripcion, foto });

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'PRODUCTOS',
        `Actualizó producto ID: ${id}`
      );

      res.json({
        success: true,
        message: 'Producto actualizado correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Registrar compra (aumentar stock)
  async compra(req, res, next) {
    try {
      const { id_producto, cantidad, precio_compra } = req.body;

      const producto = await ProductoModel.getById(id_producto);
      if (!producto) {
        throw new AppError('Producto no encontrado', 404);
      }

      const total = await ProductoModel.compra(id_producto, cantidad, precio_compra, req.admin.id_admin);

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'PRODUCTOS',
        `Compra de ${producto.nombre}: ${cantidad} unidades por $${total}`
      );

      res.json({
        success: true,
        message: 'Compra registrada correctamente',
        data: { total }
      });
    } catch (error) {
      next(error);
    }
  },

  // Registrar venta (disminuir stock)
  async venta(req, res, next) {
    try {
      const { id_producto, cantidad } = req.body;

      const producto = await ProductoModel.getById(id_producto);
      if (!producto) {
        throw new AppError('Producto no encontrado', 404);
      }

      if (producto.stock < cantidad) {
        throw new AppError('Stock insuficiente', 400);
      }

      const total = await ProductoModel.venta(id_producto, cantidad, req.admin.id_admin);

      // Auditoría
      await AuditoriaModel.registrar(
        req.admin.id_admin,
        'PRODUCTOS',
        `Venta de ${producto.nombre}: ${cantidad} unidades por $${total}`
      );

      res.json({
        success: true,
        message: 'Venta registrada correctamente',
        data: { total }
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener compras
  async getCompras(req, res, next) {
    try {
      const { id_producto, fecha_inicio, fecha_fin } = req.query;
      const compras = await ProductoModel.getCompras({
        idProducto: id_producto,
        fechaInicio: fecha_inicio,
        fechaFin: fecha_fin
      });
      
      const totalGastos = compras.reduce((sum, c) => sum + parseFloat(c.total), 0);
      
      res.json({ success: true, data: { compras, totalGastos } });
    } catch (error) {
      next(error);
    }
  },

  // Obtener ventas
  async getVentas(req, res, next) {
    try {
      const { id_producto, fecha_inicio, fecha_fin } = req.query;
      const ventas = await ProductoModel.getVentas({
        idProducto: id_producto,
        fechaInicio: fecha_inicio,
        fechaFin: fecha_fin
      });
      
      const totalIngresos = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
      
      res.json({ success: true, data: { ventas, totalIngresos } });
    } catch (error) {
      next(error);
    }
  },

  // Obtener estadísticas
  async getEstadisticas(req, res, next) {
    try {
      const estadisticas = await ProductoModel.getEstadisticas();
      res.json({ success: true, data: estadisticas });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ProductoController;
