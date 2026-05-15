// Importa el modelo de productos
const Producto = require('../models/productos');

// Controlador para OBTENER todos los productos
exports.getAll = async (req, res) => { 
  try { 
    res.json(await Producto.getAll()); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para OBTENER un producto por ID
exports.getById = async (req, res) => { 
  try { 
    res.json(await Producto.getById(req.params.id)); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para CREAR un nuevo producto
exports.create = async (req, res) => { 
  try { 
    await Producto.create(req.body); 
    res.status(201).json({ message: 'Creado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para EDITAR un producto
exports.update = async (req, res) => { 
  try { 
    await Producto.update(req.params.id, req.body); 
    res.json({ message: 'Actualizado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para BORRAR un producto
exports.delete = async (req, res) => { 
  try { 
    await Producto.delete(req.params.id); 
    res.json({ message: 'Eliminado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// NUEVOS: Filtrar por categoría
exports.getByCategory = async (req, res) => {
  try {
    const productos = await Producto.getPorCategoria(req.params.categoria);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para BUSCAR productos por nombre o marca
exports.search = async (req, res) => {
  try {
    const productos = await Producto.buscar(req.query.q);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para SUBIR imagen de un producto (MVC: lógica de negocio en Controller)
exports.uploadImagen = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo' });
  }
  // Devolvemos la URL relativa para almacenar en la BD
  res.json({ url: `/uploads/productos/${req.file.filename}` });
};