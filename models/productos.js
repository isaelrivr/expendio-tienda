// Importa la conexión a la base de datos
const db = require('../config/db');

// Clase que maneja todas las operaciones con la tabla 'productos'
class productos {
  // Obtiene TODOS los productos
  static async getAll() { 
    const query = `
      SELECT p.*, prov.nombre_comercial AS proveedor 
      FROM productos p 
      LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
    `;
    const [rows] = await db.execute(query); 
    return rows; 
  }

  // Obtiene UN producto por ID
  static async getById(id) { 
    const [rows] = await db.execute('SELECT * FROM productos WHERE id = ?', [id]); 
    return rows[0]; 
  }

  // CREA un nuevo producto
  static async create(data) {
    const formattedData = [data.id || null, data.proveedor_id || null, data.categoria || null, data.codigo_barras || null, data.nombre || null, data.descripcion || null, data.marca || null, data.unidad_medida || null, data.costo || null, data.precio || null, data.stock || null, data.stock_minimo || null, data.fecha_caducidad || null, data.activo || null];
    const sql = 'INSERT INTO productos (id, proveedor_id, categoria, codigo_barras, nombre, descripcion, marca, unidad_medida, costo, precio, stock, stock_minimo, fecha_caducidad, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, formattedData);
    return result;
  }

  // EDITA un producto existente
  static async update(id, data) {
    const formattedData = [data.proveedor_id || null, data.categoria || null, data.codigo_barras || null, data.nombre || null, data.descripcion || null, data.marca || null, data.unidad_medida || null, data.costo || null, data.precio || null, data.stock || null, data.stock_minimo || null, data.fecha_caducidad || null, data.activo || null, id];
    const sql = 'UPDATE productos SET proveedor_id=?, categoria=?, codigo_barras=?, nombre=?, descripcion=?, marca=?, unidad_medida=?, costo=?, precio=?, stock=?, stock_minimo=?, fecha_caducidad=?, activo=? WHERE id=?';
    await db.execute(sql, formattedData);
  }

  // OBTIENE productos por categoría
  static async getPorCategoria(cat) {
    const [rows] = await db.execute('SELECT * FROM productos WHERE categoria = ? AND activo = 1', [cat]);
    return rows;
  }

  // BUSCA productos por nombre o marca
  static async buscar(q) {
    const term = `%${q}%`;
    const [rows] = await db.execute('SELECT * FROM productos WHERE (nombre LIKE ? OR marca LIKE ?) AND activo = 1', [term, term]);
    return rows;
  }

  // BORRA un producto
  static async delete(id) { 
    await db.execute('DELETE FROM productos WHERE id = ?', [id]); 
  }
}

// Exporta la clase para usarla en otros archivos
module.exports = productos;