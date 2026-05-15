const db = require('../config/db');

class DetalleVenta {
  static async getAll() {
    const query = `
      SELECT dv.*, p.nombre AS producto_nombre, p.codigo_barras 
      FROM detalle_venta dv
      LEFT JOIN productos p ON dv.producto_id = p.id
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getByVentaId(ventaId) {
    const query = `
      SELECT dv.*, p.nombre AS producto_nombre, p.codigo_barras 
      FROM detalle_venta dv
      LEFT JOIN productos p ON dv.producto_id = p.id
      WHERE dv.venta_id = ?
    `;
    const [rows] = await db.execute(query, [ventaId]);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM detalle_venta WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const subtotal = (data.cantidad * data.precio_unitario) || 0;
    const descuento = data.descuento || 0;
    const impuesto = data.impuesto || 0; 

    let nextId = data.id;
    if (!nextId) {
      const [maxRows] = await db.execute('SELECT MAX(id) as maxId FROM detalle_venta');
      nextId = (maxRows[0].maxId || 0) + 1;
    }
    
    const formattedData = [
      nextId,
      data.venta_id,
      data.producto_id,
      data.cantidad,
      data.precio_unitario,
      descuento,
      impuesto,
      subtotal,
      data.observaciones || null,
      data.entregado !== undefined ? data.entregado : 0
    ];
    
    const sql = 'INSERT INTO detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, descuento, impuesto, subtotal, observaciones, entregado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, formattedData);
    
    // Aquí idealmente actualizaríamos el total de la venta principal,
    // o se maneja en el controlador.
    
    return result;
  }

  static async delete(id) {
    await db.execute('DELETE FROM detalle_venta WHERE id = ?', [id]);
  }
}

module.exports = DetalleVenta;
