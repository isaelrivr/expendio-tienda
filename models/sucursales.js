// Importa la conexión a la base de datos
const db = require('../config/db');

// Clase que maneja todas las operaciones con la tabla 'sucursales'
class sucursales {
  // Obtiene TODAS las sucursales
  static async getAll() { 
    const [rows] = await db.execute('SELECT * FROM sucursales'); 
    return rows; 
  }

  // Obtiene UNA sucursal por ID
  static async getById(id) { 
    const [rows] = await db.execute('SELECT * FROM sucursales WHERE id = ?', [id]); 
    return rows[0]; 
  }

  // CREA una nueva sucursal
  static async create(data) {
    const formattedData = [data.id || null, data.nombre || null, data.telefono || null, data.email || null, data.calle || null, data.numero || null, data.colonia || null, data.ciudad || null, data.estado || null, data.codigo_postal || null, data.fecha_apertura || null, data.activa || null];
    const sql = 'INSERT INTO sucursales (id, nombre, telefono, email, calle, numero, colonia, ciudad, estado, codigo_postal, fecha_apertura, activa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, formattedData);
    return result;
  }

  // EDITA una sucursal existente
  static async update(id, data) {
    const formattedData = [data.nombre || null, data.telefono || null, data.email || null, data.calle || null, data.numero || null, data.colonia || null, data.ciudad || null, data.estado || null, data.codigo_postal || null, data.fecha_apertura || null, data.activa || null, id];
    const sql = 'UPDATE sucursales SET nombre=?, telefono=?, email=?, calle=?, numero=?, colonia=?, ciudad=?, estado=?, codigo_postal=?, fecha_apertura=?, activa=? WHERE id=?';
    await db.execute(sql, formattedData);
  }

  // BORRA una sucursal
  static async delete(id) { 
    await db.execute('DELETE FROM sucursales WHERE id = ?', [id]); 
  }
}

// Exporta la clase para usarla en otros archivos
module.exports = sucursales;