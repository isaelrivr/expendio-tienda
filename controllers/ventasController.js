// Importa el modelo de ventas
const Venta = require('../models/ventas');

// Controlador para OBTENER todas las ventas
exports.getAll = async (req, res) => { 
  try { 
    res.json(await Venta.getAll()); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para OBTENER una venta por ID
exports.getById = async (req, res) => { 
  try { 
    res.json(await Venta.getById(req.params.id)); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para CREAR una nueva venta
exports.create = async (req, res) => { 
  try { 
    const result = await Venta.create(req.body); 
    res.status(201).json({ message: 'Creado', id: result.insertId }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para EDITAR una venta
exports.update = async (req, res) => { 
  try { 
    await Venta.update(req.params.id, req.body); 
    res.json({ message: 'Actualizado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para BORRAR una venta
exports.delete = async (req, res) => { 
  try { 
    await Venta.delete(req.params.id); 
    res.json({ message: 'Eliminado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// NUEVO: Historial por cliente
exports.getByClientId = async (req, res) => {
  try {
    const ventas = await Venta.getByClientId(req.params.cliente_id);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};