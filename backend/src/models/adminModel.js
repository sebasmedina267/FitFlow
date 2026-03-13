const { pool } = require('../config/database');

const AdminModel = {
  // Obtener todos los administradores
  async getAll() {
    const [rows] = await pool.query(
      'SELECT id_admin, nombre, apellidos, rol, edad, sexo, direccion, foto, fecha_creacion FROM administradores'
    );
    return rows;
  },

  // Obtener por ID
  async getById(id) {
    const [rows] = await pool.query(
      'SELECT id_admin, nombre, apellidos, rol, edad, sexo, direccion, foto, fecha_creacion FROM administradores WHERE id_admin = ?',
      [id]
    );
    return rows[0];
  },

  // Obtener por nombre y apellidos (para login)
  async getByNombreCompleto(nombre, apellidos) {
    const [rows] = await pool.query(
      'SELECT * FROM administradores WHERE nombre = ? AND apellidos = ?',
      [nombre, apellidos]
    );
    return rows[0];
  },

  // Verificar si existe un dueño
  async existeDueno() {
    const [rows] = await pool.query(
      "SELECT id_admin FROM administradores WHERE rol = 'dueno' LIMIT 1"
    );
    return rows.length > 0;
  },

  // Crear administrador
  async create(adminData) {
    const { nombre, apellidos, rol, password, edad, sexo, direccion, foto } = adminData;
    const [result] = await pool.query(
      'INSERT INTO administradores (nombre, apellidos, rol, password, edad, sexo, direccion, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, rol, password, edad || null, sexo || null, direccion || null, foto || null]
    );
    return result.insertId;
  },

  // Actualizar administrador
  async update(id, adminData) {
    const { nombre, apellidos, edad, sexo, direccion, foto } = adminData;
    await pool.query(
      'UPDATE administradores SET nombre = ?, apellidos = ?, edad = ?, sexo = ?, direccion = ?, foto = ? WHERE id_admin = ?',
      [nombre, apellidos, edad || null, sexo || null, direccion || null, foto || null, id]
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

  // Contar empleados
  async countEmpleados() {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM administradores WHERE rol = 'empleado'"
    );
    return rows[0].total;
  }
};

module.exports = AdminModel;
