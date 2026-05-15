// Importa Express para crear las rutas
const express = require('express');
const router = express.Router();

// Importa el controlador que tiene la lógica
const controller = require('../controllers/ventasController');

// RUTAS disponibles para ventas
router.get('/cliente/:cliente_id', controller.getByClientId); // GET /api/ventas/cliente/:id
router.get('/', controller.getAll);        // GET /api/ventas
router.get('/:id', controller.getById);    // GET /api/ventas/:id
router.post('/', controller.create);       // POST /api/ventas
router.put('/:id', controller.update);     // PUT /api/ventas/:id
router.delete('/:id', controller.delete);  // DELETE /api/ventas/:id

// Exporta las rutas
module.exports = router;