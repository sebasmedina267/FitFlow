const { pool } = require('../config/database');

const MaquinaModel = {
  // Obtener todas las máquinas
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM maquinas ORDER BY nombre');
    return rows;
  },

  // Obtener por ID
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM maquinas WHERE id_maquina = ?', [id]);
    return rows[0];
  },

  // Crear máquina
  async create(maquinaData, idAdmin) {
    const { nombre, descripcion, foto } = maquinaData;
    const [result] = await pool.query(
      'INSERT INTO maquinas (nombre, descripcion, foto, creado_por) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || null, foto || null, idAdmin]
    );
    return result.insertId;
  },

  // Actualizar máquina
  async update(id, maquinaData) {
    const { nombre, descripcion, foto } = maquinaData;
    await pool.query(
      'UPDATE maquinas SET nombre = ?, descripcion = ?, foto = ? WHERE id_maquina = ?',
      [nombre, descripcion || null, foto || null, id]
    );
  },

  // Eliminar máquina
  async delete(id) {
    await pool.query('DELETE FROM maquinas WHERE id_maquina = ?', [id]);
  }
};

module.exports = MaquinaModel;
