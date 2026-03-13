const { pool } = require('../config/database');

const ClienteModel = {
  // Obtener todos los clientes activos
  async getAll() {
    const [rows] = await pool.query(`
      SELECT c.*, 
        GROUP_CONCAT(cl.nombre SEPARATOR ', ') as clases
      FROM clientes c
      LEFT JOIN clientes_clases cc ON c.id_cliente = cc.id_cliente
      LEFT JOIN clases cl ON cc.id_clase = cl.id_clase
      WHERE c.activo = TRUE
      GROUP BY c.id_cliente
      ORDER BY c.nombre
    `);
    return rows;
  },

  // Obtener por ID
  async getById(id) {
    const [rows] = await pool.query(`
      SELECT c.*, 
        GROUP_CONCAT(cl.id_clase) as clases_ids,
        GROUP_CONCAT(cl.nombre SEPARATOR ', ') as clases
      FROM clientes c
      LEFT JOIN clientes_clases cc ON c.id_cliente = cc.id_cliente
      LEFT JOIN clases cl ON cc.id_clase = cl.id_clase
      WHERE c.id_cliente = ?
      GROUP BY c.id_cliente
    `, [id]);
    return rows[0];
  },

  // Crear cliente
  async create(clienteData, idAdmin) {
    const { nombre, edad, sexo } = clienteData;
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, edad, sexo, creado_por) VALUES (?, ?, ?, ?)',
      [nombre, edad, sexo, idAdmin]
    );
    return result.insertId;
  },

  // Actualizar cliente
  async update(id, clienteData) {
    const { nombre, edad, sexo } = clienteData;
    await pool.query(
      'UPDATE clientes SET nombre = ?, edad = ?, sexo = ? WHERE id_cliente = ?',
      [nombre, edad, sexo, id]
    );
  },

  // Eliminar cliente (borrado físico según requerimientos)
  async delete(id) {
    await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
  },

  // Asignar cliente a clase
  async asignarClase(idCliente, idClase) {
    await pool.query(
      'INSERT IGNORE INTO clientes_clases (id_cliente, id_clase) VALUES (?, ?)',
      [idCliente, idClase]
    );
  },

  // Remover cliente de clase
  async removerClase(idCliente, idClase) {
    await pool.query(
      'DELETE FROM clientes_clases WHERE id_cliente = ? AND id_clase = ?',
      [idCliente, idClase]
    );
  },

  // Actualizar clases de un cliente
  async actualizarClases(idCliente, clasesIds) {
    // Eliminar todas las clases actuales
    await pool.query('DELETE FROM clientes_clases WHERE id_cliente = ?', [idCliente]);
    
    // Insertar nuevas clases
    if (clasesIds && clasesIds.length > 0) {
      const values = clasesIds.map(idClase => [idCliente, idClase]);
      await pool.query(
        'INSERT INTO clientes_clases (id_cliente, id_clase) VALUES ?',
        [values]
      );
    }
  },

  // Estadísticas de clientes
  async getEstadisticas() {
    const [total] = await pool.query(
      'SELECT COUNT(*) as total FROM clientes WHERE activo = TRUE'
    );

    const [porGenero] = await pool.query(`
      SELECT sexo, COUNT(*) as cantidad,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM clientes WHERE activo = TRUE), 2) as porcentaje
      FROM clientes 
      WHERE activo = TRUE
      GROUP BY sexo
    `);

    const [porEdad] = await pool.query(`
      SELECT 
        CASE 
          WHEN edad < 18 THEN 'Menores de 18'
          WHEN edad BETWEEN 18 AND 25 THEN '18-25'
          WHEN edad BETWEEN 26 AND 35 THEN '26-35'
          WHEN edad BETWEEN 36 AND 45 THEN '36-45'
          WHEN edad BETWEEN 46 AND 55 THEN '46-55'
          ELSE 'Mayores de 55'
        END as rango_edad,
        COUNT(*) as cantidad,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM clientes WHERE activo = TRUE), 2) as porcentaje
      FROM clientes
      WHERE activo = TRUE
      GROUP BY rango_edad
      ORDER BY MIN(edad)
    `);

    return {
      total: total[0].total,
      porGenero,
      porEdad
    };
  }
};

module.exports = ClienteModel;
