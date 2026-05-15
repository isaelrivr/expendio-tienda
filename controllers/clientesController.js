// Importa el modelo de clientes para usar sus métodos
const Client = require('../models/clientes');

// Controlador para OBTENER todos los clientes
// req = request (la solicitud del cliente), res = response (la respuesta del servidor)
exports.getAll = async (req, res) => { 
  try { 
    res.json(await Client.getAll()); 
    // Llama al modelo para obtener todos los clientes y envía la respuesta en JSON
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
    // Si hay error, devuelve código 500 (error del servidor)
  } 
};

// Controlador para OBTENER un cliente por ID
exports.getById = async (req, res) => { 
  try { 
    res.json(await Client.getById(req.params.id)); 
    // req.params.id = el ID que viene en la URL (/api/clientes/1 → id=1)
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para CREAR un nuevo cliente
exports.create = async (req, res) => { 
  try { 
    await Client.create(req.body); 
    // req.body = los datos que envió el usuario (nombre, email, etc.)
    res.status(201).json({ message: 'Creado' }); 
    // Devuelve código 201 (creado exitosamente) + mensaje
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para EDITAR un cliente existente
exports.update = async (req, res) => { 
  try { 
    await Client.update(req.params.id, req.body); 
    // req.params.id = el ID del cliente a actualizar
    // req.body = los datos nuevos
    res.json({ message: 'Actualizado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};

// Controlador para BORRAR un cliente
exports.delete = async (req, res) => { 
  try { 
    await Client.delete(req.params.id); 
    // req.params.id = el ID del cliente a borrar
    res.json({ message: 'Eliminado' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};