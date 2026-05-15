// Importa el modelo de sucursales
const Sucursal = require('../models/sucursales');

// Controlador para OBTENER todas las sucursales
exports.getAll = async (req, res) => { 
  try { 
    res.json(await Sucursal.getAll()); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para OBTENER una sucursal por ID
exports.getById = async (req, res) => { 
  try { 
    res.json(await Sucursal.getById(req.params.id)); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para CREAR una nueva sucursal
exports.create = async (req, res) => { 
  try { 
    await Sucursal.create(req.body); 
    res.status(201).json({ message: 'Creado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para EDITAR una sucursal
exports.update = async (req, res) => { 
  try { 
    await Sucursal.update(req.params.id, req.body); 
    res.json({ message: 'Actualizado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para BORRAR una sucursal
exports.delete = async (req, res) => { 
  try { 
    await Sucursal.delete(req.params.id); 
    res.json({ message: 'Eliminado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};