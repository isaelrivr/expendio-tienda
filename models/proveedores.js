// Importa la conexión a la base de datos
const db = require('../config/db');

// Clase que maneja todas las operaciones con la tabla 'proveedores'
class proveedores {
  // Obtiene TODOS los proveedores
  static async getAll() { 
    const [rows] = await db.execute('SELECT * FROM proveedores'); 
    return rows; 
  }

  // Obtiene UN proveedor por ID
  static async getById(id) { 
    const [rows] = await db.execute('SELECT * FROM proveedores WHERE id = ?', [id]); 
    return rows[0]; 
  }

  // CREA un nuevo proveedor
  static async create(data) {
    const formattedData = [data.id || null, data.nombre_comercial || null, data.contacto_nombre || null, data.telefono || null, data.email || null, data.calle || null, data.numero || null, data.colonia || null, data.ciudad || null, data.rfc || null, data.dias_credito || null, data.estatus || null];
    const sql = 'INSERT INTO proveedores (id, nombre_comercial, contacto_nombre, telefono, email, calle, numero, colonia, ciudad, rfc, dias_credito, estatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, formattedData);
    return result;
  }

  // EDITA un proveedor existente
  static async update(id, data) {
    const formattedData = [data.nombre_comercial || null, data.contacto_nombre || null, data.telefono || null, data.email || null, data.calle || null, data.numero || null, data.colonia || null, data.ciudad || null, data.rfc || null, data.dias_credito || null, data.estatus || null, id];
    const sql = 'UPDATE proveedores SET nombre_comercial=?, contacto_nombre=?, telefono=?, email=?, calle=?, numero=?, colonia=?, ciudad=?, rfc=?, dias_credito=?, estatus=? WHERE id=?';
    await db.execute(sql, formattedData);
  }

  // BORRA un proveedor
  static async delete(id) { 
    await db.execute('DELETE FROM proveedores WHERE id = ?', [id]); 
  }
}

// Exporta la clase para usarla en otros archivos
module.exports = proveedores;