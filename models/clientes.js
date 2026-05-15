// Importa la conexión a la base de datos MySQL
const db = require('../config/db');

// Clase que maneja todas las operaciones con la tabla 'clientes' en la BD
class clientes {
  
  // Obtiene TODOS los clientes de la base de datos
  static async getAll() { 
    const [rows] = await db.execute('SELECT * FROM clientes'); 
    // Ejecuta: SELECT * FROM clientes
    return rows; // Devuelve la lista de clientes
  }

  // Obtiene UN cliente por su EMAIL
  static async getByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE email = ?', [email]);
    return rows[0];
  }

  // Obtiene UN cliente por su ID
  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    return rows[0];
  }

  // CREA un nuevo cliente en la base de datos
  static async create(data) {
    let nextId = data.id;
    
    // Si no viene ID (registro desde la tienda), calculamos el siguiente
    if (!nextId) {
      const [maxRows] = await db.execute('SELECT MAX(id) as maxId FROM clientes');
      nextId = (maxRows[0].maxId || 0) + 1;
    }

    const formattedData = [
      nextId, 
      data.nombre || null, 
      data.apellido_paterno || null, 
      data.apellido_materno || null, 
      data.telefono || null, 
      data.email || null, 
      data.calle || null, 
      data.numero || null, 
      data.colonia || null, 
      data.ciudad || null, 
      data.fecha_registro || null, 
      data.puntos || 0,
      data.password || '123456'
    ];
    const sql = 'INSERT INTO clientes (id, nombre, apellido_paterno, apellido_materno, telefono, email, calle, numero, colonia, ciudad, fecha_registro, puntos, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, formattedData);
    return result;
  }

  // EDITA un cliente existente
  static async update(id, data) {
    const formattedData = [
      data.nombre || null, 
      data.apellido_paterno || null, 
      data.apellido_materno || null, 
      data.telefono || null, 
      data.email || null, 
      data.calle || null, 
      data.numero || null, 
      data.colonia || null, 
      data.ciudad || null, 
      data.fecha_registro || null, 
      data.puntos || null, 
      data.password || null,
      id
    ];
    const sql = 'UPDATE clientes SET nombre=?, apellido_paterno=?, apellido_materno=?, telefono=?, email=?, calle=?, numero=?, colonia=?, ciudad=?, fecha_registro=?, puntos=?, password=? WHERE id=?';
    await db.execute(sql, formattedData);
  }

  // BORRA un cliente de la base de datos
  static async delete(id) { 
    await db.execute('DELETE FROM clientes WHERE id = ?', [id]); 
    // Ejecuta: DELETE FROM clientes WHERE id = ?
  }
}

// Exporta la clase para que otros archivos la usen
module.exports = clientes;