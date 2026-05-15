const db = require('../config/db');

exports.getResumen = async (req, res) => {
  try {
    // 1. Ventas del día (asumiendo que fecha_venta es TIMESTAMP o DATE)
    const [ventasResult] = await db.execute('SELECT COALESCE(SUM(total), 0) AS ventas_dia FROM ventas WHERE DATE(fecha_venta) = CURDATE()');
    
    // 2. Clientes totales
    const [clientesResult] = await db.execute('SELECT COUNT(id) AS total_clientes FROM clientes');
    
    // 3. Productos con stock bajo
    const [productosResult] = await db.execute('SELECT COUNT(id) AS productos_bajo_stock FROM productos WHERE stock <= stock_minimo');
    
    // 4. Sucursales activas
    const [sucursalesResult] = await db.execute('SELECT COUNT(id) AS sucursales_activas FROM sucursales WHERE activa = 1 OR activa = true');

    res.json({
      ventasDia: ventasResult[0].ventas_dia,
      totalClientes: clientesResult[0].total_clientes,
      productosBajoStock: productosResult[0].productos_bajo_stock,
      sucursalesActivas: sucursalesResult[0].sucursales_activas
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
