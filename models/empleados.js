// Importa la conexión a la base de datos
const db = require('../config/db');

// Clase que maneja todas las operaciones con la tabla 'empleados'
class empleados {
  // Obtiene TODOS los empleados
  static async getAll() { 
    const query = `
      SELECT e.*, s.nombre AS sucursal 
      FROM empleados e 
      LEFT JOIN sucursales s ON e.sucursal_id = s.id
    `;
    const [rows] = await db.execute(query); 
    return rows; 
  }

  // Obtiene UN empleado por ID
  static async getById(id) { 
    const [rows] = await db.execute('SELECT * FROM empleados WHERE id = ?', [id]); 
    return rows[0]; 
  }

  // CREA un nuevo empleado
  static async create(data) {
    const formattedData = [data.id || null, data.sucursal_id || null, data.nombre || null, data.apellido_paterno || null, data.apellido_materno || null, data.puesto || null, data.telefono || null, data.email || null, data.fecha_ingreso || null, data.salario || null, data.turno || null, data.estatus || null];
    const sql = 'INSERT INTO empleados (id, sucursal_id, nombre, apellido_paterno, apellido_materno, puesto, telefono, email, fecha_ingreso, salario, turno, estatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, formattedData);
    return result;
  }

  // EDITA un empleado existente
  static async update(id, data) {
    const formattedData = [data.sucursal_id || null, data.nombre || null, data.apellido_paterno || null, data.apellido_materno || null, data.puesto || null, data.telefono || null, data.email || null, data.fecha_ingreso || null, data.salario || null, data.turno || null, data.estatus || null, id];
    const sql = 'UPDATE empleados SET sucursal_id=?, nombre=?, apellido_paterno=?, apellido_materno=?, puesto=?, telefono=?, email=?, fecha_ingreso=?, salario=?, turno=?, estatus=? WHERE id=?';
    await db.execute(sql, formattedData);
  }

  // BORRA un empleado
  static async delete(id) { 
    await db.execute('DELETE FROM empleados WHERE id = ?', [id]); 
  }
}

// Exporta la clase para usarla en otros archivos
module.exports = empleados;