const DetalleVenta = require('../models/detalle_venta');
const Venta = require('../models/ventas');

exports.getAll = async (req, res) => {
  try {
    res.json(await DetalleVenta.getAll());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByVentaId = async (req, res) => {
  try {
    const detalles = await DetalleVenta.getByVentaId(req.params.ventaId);
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.venta_id || !req.body.producto_id || !req.body.cantidad || !req.body.precio_unitario) {
      return res.status(400).json({ message: "Faltan campos obligatorios para el detalle." });
    }
    
    // Crear el detalle
    await DetalleVenta.create(req.body);
    
    // Actualizar el total de la venta
    // Primero obtener todos los detalles de esta venta
    const detalles = await DetalleVenta.getByVentaId(req.body.venta_id);
    let totalVenta = 0;
    let totalSubtotal = 0;
    let totalImpuestos = 0;
    let totalDescuentos = 0;
    
    detalles.forEach(d => {
      totalSubtotal += parseFloat(d.subtotal || 0);
      totalDescuentos += parseFloat(d.descuento || 0);
      totalImpuestos += parseFloat(d.impuesto || 0);
    });
    
    totalVenta = totalSubtotal - totalDescuentos + totalImpuestos;
    
    // Obtener la venta actual
    const ventaActual = await Venta.getById(req.body.venta_id);
    if(ventaActual) {
      ventaActual.subtotal = totalSubtotal;
      ventaActual.descuento = totalDescuentos;
      ventaActual.impuesto = totalImpuestos;
      ventaActual.total = totalVenta;
      await Venta.update(req.body.venta_id, ventaActual);
    }
    
    res.status(201).json({ message: 'Detalle agregado y venta actualizada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const detalle = await DetalleVenta.getById(req.params.id);
    if (!detalle) {
      return res.status(404).json({ message: "Detalle no encontrado" });
    }
    const ventaId = detalle.venta_id;

    await DetalleVenta.delete(req.params.id);

    // Recalcular total de la venta
    const detalles = await DetalleVenta.getByVentaId(ventaId);
    let totalVenta = 0;
    let totalSubtotal = 0;
    let totalImpuestos = 0;
    let totalDescuentos = 0;
    
    detalles.forEach(d => {
      totalSubtotal += parseFloat(d.subtotal || 0);
      totalDescuentos += parseFloat(d.descuento || 0);
      totalImpuestos += parseFloat(d.impuesto || 0);
    });
    
    totalVenta = totalSubtotal - totalDescuentos + totalImpuestos;
    
    const ventaActual = await Venta.getById(ventaId);
    if(ventaActual) {
      ventaActual.subtotal = totalSubtotal;
      ventaActual.descuento = totalDescuentos;
      ventaActual.impuesto = totalImpuestos;
      ventaActual.total = totalVenta;
      await Venta.update(ventaId, ventaActual);
    }

    res.json({ message: 'Detalle eliminado y venta actualizada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
