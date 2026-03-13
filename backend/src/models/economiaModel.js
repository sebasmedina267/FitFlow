const { pool } = require('../config/database');

const EconomiaModel = {
  // Obtener ingresos extra
  async getIngresos(filtros = {}) {
    let query = 'SELECT * FROM ingresos_extra WHERE 1=1';
    const params = [];

    if (filtros.fechaInicio) {
      query += ' AND DATE(fecha) >= ?';
      params.push(filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query += ' AND DATE(fecha) <= ?';
      params.push(filtros.fechaFin);
    }

    query += ' ORDER BY fecha DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Crear ingreso extra
  async createIngreso(concepto, cantidad, idAdmin) {
    const [result] = await pool.query(
      'INSERT INTO ingresos_extra (concepto, cantidad, registrado_por) VALUES (?, ?, ?)',
      [concepto, Math.abs(cantidad), idAdmin]
    );
    return result.insertId;
  },

  // Obtener gastos extra
  async getGastos(filtros = {}) {
    let query = 'SELECT * FROM gastos_extra WHERE 1=1';
    const params = [];

    if (filtros.fechaInicio) {
      query += ' AND DATE(fecha) >= ?';
      params.push(filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query += ' AND DATE(fecha) <= ?';
      params.push(filtros.fechaFin);
    }

    query += ' ORDER BY fecha DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Crear gasto extra
  async createGasto(concepto, cantidad, idAdmin) {
    const [result] = await pool.query(
      'INSERT INTO gastos_extra (concepto, cantidad, registrado_por) VALUES (?, ?, ?)',
      [concepto, Math.abs(cantidad), idAdmin]
    );
    return result.insertId;
  },

  // Obtener balance general
  async getBalance(filtros = {}) {
    let whereClause = '';
    const params = [];

    if (filtros.fechaInicio) {
      whereClause = ' AND DATE(fecha) >= ?';
      params.push(filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      whereClause += ' AND DATE(fecha) <= ?';
      params.push(filtros.fechaFin);
    }

    // Ingresos por pagos de clientes
    const [ingresosPagos] = await pool.query(
      `SELECT COALESCE(SUM(importe), 0) as total FROM pagos_clientes WHERE pagado = TRUE ${whereClause.replace(/fecha/g, 'fecha_pago')}`,
      params
    );

    // Ingresos por ventas de productos
    const [ingresosVentas] = await pool.query(
      `SELECT COALESCE(SUM(total), 0) as total FROM ventas_productos WHERE 1=1 ${whereClause}`,
      params
    );

    // Ingresos extra
    const [ingresosExtra] = await pool.query(
      `SELECT COALESCE(SUM(cantidad), 0) as total FROM ingresos_extra WHERE 1=1 ${whereClause}`,
      params
    );

    // Gastos por compras de productos
    const [gastosCompras] = await pool.query(
      `SELECT COALESCE(SUM(total), 0) as total FROM compras_productos WHERE 1=1 ${whereClause}`,
      params
    );

    // Gastos extra
    const [gastosExtra] = await pool.query(
      `SELECT COALESCE(SUM(cantidad), 0) as total FROM gastos_extra WHERE 1=1 ${whereClause}`,
      params
    );

    const totalIngresos = 
      parseFloat(ingresosPagos[0].total) + 
      parseFloat(ingresosVentas[0].total) + 
      parseFloat(ingresosExtra[0].total);

    const totalGastos = 
      parseFloat(gastosCompras[0].total) + 
      parseFloat(gastosExtra[0].total);

    const beneficios = totalIngresos - totalGastos;

    return {
      ingresos: {
        pagosClientes: parseFloat(ingresosPagos[0].total),
        ventasProductos: parseFloat(ingresosVentas[0].total),
        extra: parseFloat(ingresosExtra[0].total),
        total: totalIngresos
      },
      gastos: {
        comprasProductos: parseFloat(gastosCompras[0].total),
        extra: parseFloat(gastosExtra[0].total),
        total: totalGastos
      },
      beneficios
    };
  },

  // Estadísticas por período
  async getEstadisticasPorPeriodo(periodo = 'mes') {
    let groupBy, dateFormat;
    
    switch(periodo) {
      case 'dia':
        groupBy = 'DATE(fecha)';
        dateFormat = '%Y-%m-%d';
        break;
      case 'mes':
        groupBy = 'DATE_FORMAT(fecha, "%Y-%m")';
        dateFormat = '%Y-%m';
        break;
      case 'ano':
        groupBy = 'YEAR(fecha)';
        dateFormat = '%Y';
        break;
      default:
        groupBy = 'DATE_FORMAT(fecha, "%Y-%m")';
        dateFormat = '%Y-%m';
    }

    // Ingresos por período
    const [ingresos] = await pool.query(`
      SELECT DATE_FORMAT(fecha, '${dateFormat}') as periodo, SUM(cantidad) as total
      FROM (
        SELECT fecha_pago as fecha, importe as cantidad FROM pagos_clientes WHERE pagado = TRUE
        UNION ALL
        SELECT fecha, total as cantidad FROM ventas_productos
        UNION ALL
        SELECT fecha, cantidad FROM ingresos_extra
      ) as ingresos
      GROUP BY ${groupBy}
      ORDER BY periodo DESC
      LIMIT 12
    `);

    // Gastos por período
    const [gastos] = await pool.query(`
      SELECT DATE_FORMAT(fecha, '${dateFormat}') as periodo, SUM(cantidad) as total
      FROM (
        SELECT fecha, total as cantidad FROM compras_productos
        UNION ALL
        SELECT fecha, cantidad FROM gastos_extra
      ) as gastos
      GROUP BY ${groupBy}
      ORDER BY periodo DESC
      LIMIT 12
    `);

    return { ingresos, gastos };
  }
};

module.exports = EconomiaModel;
