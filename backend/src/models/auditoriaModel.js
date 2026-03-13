const { pool } = require('../config/database');

const AuditoriaModel = {
  // Registrar operación
  async registrar(idAdmin, modulo, accion) {
    const [result] = await pool.query(
      'INSERT INTO auditoria (id_admin, modulo, accion) VALUES (?, ?, ?)',
      [idAdmin, modulo, accion]
    );
    return result.insertId;
  },

  // Obtener todas las operaciones
  async getAll(filtros = {}) {
    let query = `
      SELECT a.*, ad.nombre, ad.apellidos 
      FROM auditoria a 
      JOIN administradores ad ON a.id_admin = ad.id_admin
      WHERE 1=1
    `;
    const params = [];

    if (filtros.idAdmin) {
      query += ' AND a.id_admin = ?';
      params.push(filtros.idAdmin);
    }

    if (filtros.fechaInicio) {
      query += ' AND DATE(a.fecha) >= ?';
      params.push(filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      query += ' AND DATE(a.fecha) <= ?';
      params.push(filtros.fechaFin);
    }

    if (filtros.modulo) {
      query += ' AND a.modulo = ?';
      params.push(filtros.modulo);
    }

    query += ' ORDER BY a.fecha DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Obtener operaciones por administrador
  async getByAdmin(idAdmin, filtros = {}) {
    let query = `
      SELECT * FROM auditoria 
      WHERE id_admin = ?
    `;
    const params = [idAdmin];

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
  }
};

module.exports = AuditoriaModel;
