const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const AdminModel = {
  // Obtener todos los administradores (sin la contraseña)
  async getAll() {
    const [rows] = await pool.query(
      'SELECT id_admin, nombre, apellidos, rol, edad, sexo, direccion, foto, fecha_creacion FROM administradores ORDER BY nombre'
    );
    return rows;
  },

  // Obtener admin por ID (sin la contraseña)
  async getById(id) {
    const [rows] = await pool.query(
      'SELECT id_admin, nombre, apellidos, rol, edad, sexo, direccion, foto, fecha_creacion FROM administradores WHERE id_admin = ?',
      [id]
    );
    return rows[0];
  },

  // Obtener admin por nombre completo (con la contraseña para login)
  async getByNombreCompleto(nombre, apellidos) {
    const [rows] = await pool.query(
      'SELECT * FROM administradores WHERE nombre = ? AND apellidos = ?',
      [nombre, apellidos]
    );
    return rows[0];
  },

  // Crear administrador
  async create(adminData) {
    const { nombre, apellidos, rol, password } = adminData;
    const [result] = await pool.query(
      'INSERT INTO administradores (nombre, apellidos, rol, password) VALUES (?, ?, ?, ?)',
      [nombre, apellidos, rol, password]
    );
    return result.insertId;
  },

  // Actualizar perfil de administrador
  async update(id, adminData) {
    const { nombre, apellidos, edad, sexo, direccion, foto } = adminData;
    await pool.query(
      'UPDATE administradores SET nombre = ?, apellidos = ?, edad = ?, sexo = ?, direccion = ?, foto = ? WHERE id_admin = ?',
      [nombre, apellidos, edad, sexo, direccion, foto, id]
    );
  },

  // Actualizar contraseña
  async updatePassword(id, password) {
    await pool.query(
      'UPDATE administradores SET password = ? WHERE id_admin = ?',
      [password, id]
    );
  },

  // Eliminar administrador
  async delete(id) {
    await pool.query('DELETE FROM administradores WHERE id_admin = ?', [id]);
  },

  // Verificar si ya existe un dueño
  async existeDueno() {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM administradores WHERE rol = 'dueno'"
    );
    return rows[0].count > 0;
  }
};

module.exports = AdminModel;
