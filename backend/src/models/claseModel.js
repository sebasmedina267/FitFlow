const { pool } = require('../config/database');

const ClaseModel = {
  // Obtener todas las clases
  async getAll() {
    const [rows] = await pool.query(`
      SELECT c.*, 
        GROUP_CONCAT(DISTINCT h.horario SEPARATOR ', ') as horarios,
        COUNT(DISTINCT cc.id_cliente) as num_clientes
      FROM clases c
      LEFT JOIN horarios_clase h ON c.id_clase = h.id_clase
      LEFT JOIN clientes_clases cc ON c.id_clase = cc.id_clase
      GROUP BY c.id_clase
      ORDER BY c.nombre
    `);
    return rows;
  },

  // Obtener por ID
  async getById(id) {
    const [clase] = await pool.query('SELECT * FROM clases WHERE id_clase = ?', [id]);
    if (!clase[0]) return null;

    const [horarios] = await pool.query(
      'SELECT horario FROM horarios_clase WHERE id_clase = ?', [id]
    );

    const [clientes] = await pool.query(`
      SELECT c.id_cliente, c.nombre, c.edad, c.sexo
      FROM clientes c
      JOIN clientes_clases cc ON c.id_cliente = cc.id_cliente
      WHERE cc.id_clase = ? AND c.activo = TRUE
    `, [id]);

    return {
      ...clase[0],
      horarios: horarios.map(h => h.horario),
      clientes
    };
  },

  // Crear clase
  async create(claseData, idAdmin) {
    const { nombre, descripcion, precio, tipo_pago, horarios } = claseData;
    
    const [result] = await pool.query(
      'INSERT INTO clases (nombre, descripcion, precio, tipo_pago, creado_por) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion || null, precio, tipo_pago, idAdmin]
    );

    const idClase = result.insertId;

    // Insertar horarios si existen
    if (horarios && horarios.length > 0) {
      const values = horarios.map(h => [idClase, h]);
      await pool.query('INSERT INTO horarios_clase (id_clase, horario) VALUES ?', [values]);
    }

    return idClase;
  },

  // Actualizar clase
  async update(id, claseData) {
    const { nombre, descripcion, precio, tipo_pago, horarios } = claseData;
    
    await pool.query(
      'UPDATE clases SET nombre = ?, descripcion = ?, precio = ?, tipo_pago = ? WHERE id_clase = ?',
      [nombre, descripcion || null, precio, tipo_pago, id]
    );

    // Actualizar horarios
    await pool.query('DELETE FROM horarios_clase WHERE id_clase = ?', [id]);
    if (horarios && horarios.length > 0) {
      const values = horarios.map(h => [id, h]);
      await pool.query('INSERT INTO horarios_clase (id_clase, horario) VALUES ?', [values]);
    }
  },

  // Eliminar clase
  async delete(id) {
    await pool.query('DELETE FROM clases WHERE id_clase = ?', [id]);
  },

  // Agregar clientes a clase
  async agregarClientes(idClase, clientesIds) {
    if (clientesIds && clientesIds.length > 0) {
      const values = clientesIds.map(idCliente => [idCliente, idClase]);
      await pool.query(
        'INSERT IGNORE INTO clientes_clases (id_cliente, id_clase) VALUES ?',
        [values]
      );
    }
  },

  // Estadísticas de clases
  async getEstadisticas() {
    // Clases más concurridas
    const [concurrencia] = await pool.query(`
      SELECT c.id_clase, c.nombre, COUNT(cc.id_cliente) as num_clientes,
        ROUND(COUNT(cc.id_cliente) * 100.0 / NULLIF((SELECT COUNT(*) FROM clientes WHERE activo = TRUE), 0), 2) as porcentaje
      FROM clases c
      LEFT JOIN clientes_clases cc ON c.id_clase = cc.id_clase
      LEFT JOIN clientes cl ON cc.id_cliente = cl.id_cliente AND cl.activo = TRUE
      GROUP BY c.id_clase
      ORDER BY num_clientes DESC
    `);

    // Distribución por género en cada clase
    const [porGenero] = await pool.query(`
      SELECT c.id_clase, c.nombre,
        SUM(CASE WHEN cl.sexo = 'hombre' THEN 1 ELSE 0 END) as hombres,
        SUM(CASE WHEN cl.sexo = 'mujer' THEN 1 ELSE 0 END) as mujeres,
        COUNT(cc.id_cliente) as total
      FROM clases c
      LEFT JOIN clientes_clases cc ON c.id_clase = cc.id_clase
      LEFT JOIN clientes cl ON cc.id_cliente = cl.id_cliente AND cl.activo = TRUE
      GROUP BY c.id_clase
    `);

    // Distribución por edad en cada clase
    const [porEdad] = await pool.query(`
      SELECT c.id_clase, c.nombre,
        SUM(CASE WHEN cl.edad < 18 THEN 1 ELSE 0 END) as menores_18,
        SUM(CASE WHEN cl.edad BETWEEN 18 AND 30 THEN 1 ELSE 0 END) as edad_18_30,
        SUM(CASE WHEN cl.edad BETWEEN 31 AND 45 THEN 1 ELSE 0 END) as edad_31_45,
        SUM(CASE WHEN cl.edad > 45 THEN 1 ELSE 0 END) as mayores_45
      FROM clases c
      LEFT JOIN clientes_clases cc ON c.id_clase = cc.id_clase
      LEFT JOIN clientes cl ON cc.id_cliente = cl.id_cliente AND cl.activo = TRUE
      GROUP BY c.id_clase
    `);

    return { concurrencia, porGenero, porEdad };
  }
};

module.exports = ClaseModel;
