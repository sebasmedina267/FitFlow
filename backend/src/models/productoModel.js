const { pool } = require('../config/database');

const ProductoModel = {
  // Obtener todos los productos
  async getAll() {
    const [rows] = await pool.query(`
      SELECT *, 
        (precio_venta * stock) as valor_total_venta,
        (precio_compra * stock) as valor_total_compra
      FROM productos 
      ORDER BY nombre
    `);
    return rows;
  },

  // Obtener por ID
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
    return rows[0];
  },

  // Crear producto (mediante compra)
  async create(productoData) {
    const { nombre, precio_venta, precio_compra, stock, descripcion, foto } = productoData;
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, precio_venta, precio_compra, stock, descripcion, foto) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, precio_venta, precio_compra, stock || 0, descripcion || null, foto || null]
    );
    return result.insertId;
  },

  // Actualizar producto (solo descripcion, foto y precio)
  async update(id, productoData) {
    const { precio_venta, descripcion, foto } = productoData;
    await pool.query(
      'UPDATE productos SET precio_venta = ?, descripcion = ?, foto = ? WHERE id_producto = ?',
      [precio_venta, descripcion || null, foto || null, id]
    );
  },

  // Eliminar producto
  async delete(id) {
    await pool.query('DELETE FROM productos WHERE id_producto = ?', [id]);
  },

  // Registrar compra (aumenta stock)
  async compra(idProducto, cantidad, precioCompra, idAdmin) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Actualizar stock y precio de compra
      await connection.query(
        'UPDATE productos SET stock = stock + ?, precio_compra = ? WHERE id_producto = ?',
        [cantidad, precioCompra, idProducto]
      );

      // Registrar la compra
      const total = cantidad * precioCompra;
      await connection.query(
        'INSERT INTO compras_productos (id_producto, cantidad, precio_compra, total, registrado_por) VALUES (?, ?, ?, ?, ?)',
        [idProducto, cantidad, precioCompra, total, idAdmin]
      );

      await connection.commit();
      return total;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Registrar venta (disminuye stock)
  async venta(idProducto, cantidad, idAdmin) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Verificar stock disponible
      const [producto] = await connection.query(
        'SELECT stock, precio_venta FROM productos WHERE id_producto = ?',
        [idProducto]
      );

      if (!producto[0] || producto[0].stock < cantidad) {
        throw new Error('Stock insuficiente');
      }

      // Actualizar stock
      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
        [cantidad, idProducto]
      );

      // Registrar la venta
      const total = cantidad * producto[0].precio_venta;
      await connection.query(
        'INSERT INTO ventas_productos (id_producto, cantidad, precio_venta, total, registrado_por) VALUES (?, ?, ?, ?, ?)',
        [idProducto, cantidad, producto[0].precio_venta, total, idAdmin]
      );

      await connection.commit();
      return total;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Obtener compras
  async getCompras(filtros = {}) {
    let query = `
      SELECT cp.*, p.nombre as producto_nombre
      FROM compras_productos cp
      JOIN productos p ON cp.id_producto = p.id_producto
      WHERE 1=1
    `;
    const params = [];

    if (filtros.idProducto) {
      query += ' AND cp.id_producto = ?';
      params.push(filtros.idProducto);
    }
    if (filtros.fechaInicio) {
      query += ' AND DATE(cp.fecha) >= ?';
      params.push(filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query += ' AND DATE(cp.fecha) <= ?';
      params.push(filtros.fechaFin);
    }

    query += ' ORDER BY cp.fecha DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Obtener ventas
  async getVentas(filtros = {}) {
    let query = `
      SELECT vp.*, p.nombre as producto_nombre
      FROM ventas_productos vp
      JOIN productos p ON vp.id_producto = p.id_producto
      WHERE 1=1
    `;
    const params = [];

    if (filtros.idProducto) {
      query += ' AND vp.id_producto = ?';
      params.push(filtros.idProducto);
    }
    if (filtros.fechaInicio) {
      query += ' AND DATE(vp.fecha) >= ?';
      params.push(filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query += ' AND DATE(vp.fecha) <= ?';
      params.push(filtros.fechaFin);
    }

    query += ' ORDER BY vp.fecha DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Totales de inventario
  async getTotales() {
    const [totales] = await pool.query(`
      SELECT 
        SUM(precio_venta * stock) as valor_total_venta,
        SUM(precio_compra * stock) as valor_total_compra,
        SUM(stock) as stock_total
      FROM productos
    `);
    return totales[0];
  },

  // Estadísticas de productos
  async getEstadisticas() {
    // Total ingresos por ventas
    const [ingresos] = await pool.query('SELECT COALESCE(SUM(total), 0) as total FROM ventas_productos');
    
    // Total gastos por compras
    const [gastos] = await pool.query('SELECT COALESCE(SUM(total), 0) as total FROM compras_productos');

    // Beneficios
    const beneficios = ingresos[0].total - gastos[0].total;

    // Por producto
    const [porProducto] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        COALESCE(SUM(vp.total), 0) as total_ventas,
        COALESCE(SUM(cp.total), 0) as total_compras,
        COALESCE(SUM(vp.total), 0) - COALESCE(SUM(cp.total), 0) as beneficio
      FROM productos p
      LEFT JOIN ventas_productos vp ON p.id_producto = vp.id_producto
      LEFT JOIN compras_productos cp ON p.id_producto = cp.id_producto
      GROUP BY p.id_producto
    `);

    return {
      totalIngresos: ingresos[0].total,
      totalGastos: gastos[0].total,
      beneficios,
      porProducto
    };
  }
};

module.exports = ProductoModel;
