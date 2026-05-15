// Importa Express para crear las rutas
const express = require('express');
const router = express.Router();

// Importa el controlador que tiene la lógica para cada ruta
const controller = require('../controllers/clientesController');

// RUTAS disponibles para la tabla clientes
// Todas estas rutas comienzan con /api/clientes (definido en server.js)

// GET /api/clientes → obtiene todos los clientes
router.get('/', controller.getAll);

// GET /api/clientes/:id → obtiene un cliente específico (por ID)
// Ejemplo: GET /api/clientes/1 obtiene el cliente con id=1
router.get('/:id', controller.getById);

// POST /api/clientes → crea un nuevo cliente
// Los datos se envían en el cuerpo de la solicitud (req.body)
router.post('/', controller.create);

// PUT /api/clientes/:id → edita un cliente existente
// Ejemplo: PUT /api/clientes/1 edita el cliente con id=1
// Los datos nuevos se envían en el cuerpo de la solicitud (req.body)
router.put('/:id', controller.update);

// DELETE /api/clientes/:id → borra un cliente
// Ejemplo: DELETE /api/clientes/1 borra el cliente con id=1
router.delete('/:id', controller.delete);

// Exporta las rutas para que server.js las use
module.exports = router;