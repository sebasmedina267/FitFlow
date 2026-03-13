const { pool } = require('../config/database');

const PagoModel = {
  // Obtener pagos con filtros
  async getAll(filtros = {}) {
    let query = `
      SELECT pc.*, c.nombre as cliente_nombre, cl.nombre as clase_nombre, cl.precio as precio_clase
      FROM pagos_clientes pc
      JOIN clientes c ON pc.id_cliente = c.id_cliente
      JOIN clases cl ON pc.id_clase = cl.id_clase
      WHERE 1=1
    `;
    const params = [];

    if (filtros.idClase) {
      query += ' AND pc.id_clase = ?';
      params.push(filtros.idClase);
    }
    if (filtros.pagado !== undefined) {
      query += ' AND pc.pagado = ?';
      params.push(filtros.pagado);
    }
    if (filtros.fechaInicio) {
      query += ' AND DATE(pc.fecha_pago) >= ?';
      params.push(filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query += ' AND DATE(pc.fecha_pago) <= ?';
      params.push(filtros.fechaFin);
    }

    query += ' ORDER BY c.nombre';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Obtener pagos por clase
  async getByClase(idClase) {
    const [rows] = await pool.query(`
      SELECT pc.*, c.nombre as cliente_nombre
      FROM pagos_clientes pc
      JOIN clientes c ON pc.id_cliente = c.id_cliente
      WHERE pc.id_clase = ?
      ORDER BY c.nombre
    `, [idClase]);
    return rows;
  },

  // Crear registro de pago
  async create(pagoData, idAdmin) {
    const { id_cliente, id_clase, importe } = pagoData;
    const [result] = await pool.query(
      'INSERT INTO pagos_clientes (id_cliente, id_clase, importe, registrado_por) VALUES (?, ?, ?, ?)',
      [id_cliente, id_clase, importe, idAdmin]
    );
    return result.insertId;
  },

  // Marcar como pagado
  async marcarPagado(idPago, importe, idAdmin) {
    await pool.query(
      'UPDATE pagos_clientes SET pagado = TRUE, fecha_pago = CURRENT_DATE, importe = ?, registrado_por = ? WHERE id_pago = ?',
      [importe, idAdmin, idPago]
    );
  },

  // Marcar como no pagado
  async marcarNoPagado(idPago) {
    await pool.query(
      'UPDATE pagos_clientes SET pagado = FALSE, fecha_pago = NULL WHERE id_pago = ?',
      [idPago]
    );
  },

  // Crear pagos pendientes para cliente en clase
  async crearPagoPendiente(idCliente, idClase, importe, idAdmin) {
    const [result] = await pool.query(
      'INSERT INTO pagos_clientes (id_cliente, id_clase, importe, pagado, registrado_por) VALUES (?, ?, ?, FALSE, ?)',
      [idCliente, idClase, importe, idAdmin]
    );
    return result.insertId;
  },

  // Estadísticas de pagos
  async getEstadisticas() {
    // Total pagado
    const [totalPagado] = await pool.query(
      'SELECT COALESCE(SUM(importe), 0) as total FROM pagos_clientes WHERE pagado = TRUE'
    );

    // Total por clase
    const [porClase] = await pool.query(`
      SELECT cl.id_clase, cl.nombre,
        COALESCE(SUM(CASE WHEN pc.pagado = TRUE THEN pc.importe ELSE 0 END), 0) as total_pagado,
        COUNT(CASE WHEN pc.pagado = TRUE THEN 1 END) as num_pagados,
        COUNT(CASE WHEN pc.pagado = FALSE THEN 1 END) as num_pendientes
      FROM clases cl
      LEFT JOIN pagos_clientes pc ON cl.id_clase = pc.id_clase
      GROUP BY cl.id_clase
    `);

    // Pagos pendientes
    const [pendientes] = await pool.query(
      'SELECT COUNT(*) as total FROM pagos_clientes WHERE pagado = FALSE'
    );

    return {
      totalPagado: totalPagado[0].total,
      totalPendientes: pendientes[0].total,
      porClase
    };
  }
};

module.exports = PagoModel;
