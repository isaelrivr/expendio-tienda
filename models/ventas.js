// Importa la conexión a la base de datos
const db = require('../config/db');

// Clase que maneja todas las operaciones con la tabla 'ventas'
class ventas {
  // Obtiene TODAS las ventas
  static async getAll() { 
    const query = `
      SELECT v.*, 
             c.nombre AS cliente, 
             s.nombre AS sucursal,
             e.nombre AS empleado
      FROM ventas v 
      LEFT JOIN clientes c ON v.cliente_id = c.id 
      LEFT JOIN sucursales s ON v.sucursal_id = s.id
      LEFT JOIN empleados e ON v.empleado_id = e.id
    `;
    const [rows] = await db.execute(query); 
    return rows; 
  }

  // Obtiene UNA venta por ID
  static async getById(id) { 
    const [rows] = await db.execute('SELECT * FROM ventas WHERE id = ?', [id]); 
    return rows[0]; 
  }

  // CREA una nueva venta
  static async create(data) {
    let nextId = data.id;
    if (!nextId) {
      const [maxRows] = await db.execute('SELECT MAX(id) as maxId FROM ventas');
      nextId = (maxRows[0].maxId || 0) + 1;
    }

    const formattedData = [
      nextId, 
      data.sucursal_id || null, 
      data.empleado_id || null, 
      data.cliente_id || null, 
      data.folio || null, 
      data.fecha_venta || null, 
      data.metodo_pago || null, 
      data.subtotal || 0,
      data.descuento || 0,
      data.impuesto || 0,
      data.total || 0,
      data.estatus || 'En proceso'
    ];
    const sql = 'INSERT INTO ventas (id, sucursal_id, empleado_id, cliente_id, folio, fecha_venta, metodo_pago, subtotal, descuento, impuesto, total, estatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, formattedData);
    return result;
  }

  // EDITA una venta existente
  static async update(id, data) {
    const formattedData = [
      data.sucursal_id || null, 
      data.empleado_id || null, 
      data.cliente_id || null, 
      data.folio || null, 
      data.fecha_venta || null, 
      data.metodo_pago || null, 
      data.subtotal || 0,
      data.descuento || 0,
      data.impuesto || 0,
      data.total || 0,
      data.estatus || 'En proceso',
      id
    ];
    const sql = 'UPDATE ventas SET sucursal_id=?, empleado_id=?, cliente_id=?, folio=?, fecha_venta=?, metodo_pago=?, subtotal=?, descuento=?, impuesto=?, total=?, estatus=? WHERE id=?';
    await db.execute(sql, formattedData);
  }

  // Obtiene historial de ventas por CLIENTE
  static async getByClientId(clienteId) {
    const query = 'SELECT * FROM ventas WHERE cliente_id = ? ORDER BY fecha_venta DESC';
    const [rows] = await db.execute(query, [clienteId]);
    return rows;
  }

  // BORRA una venta
  static async delete(id) { 
    await db.execute('DELETE FROM ventas WHERE id = ?', [id]); 
  }
}

// Exporta la clase para usarla en otros archivos
module.exports = ventas;