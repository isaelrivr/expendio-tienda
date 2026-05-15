// Importa Express para crear las rutas
const express = require('express');
const router = express.Router();

// Importa el controlador que tiene la lógica
const controller = require('../controllers/sucursalesController');

// RUTAS disponibles para sucursales
router.get('/', controller.getAll);        // GET /api/sucursales
router.get('/:id', controller.getById);    // GET /api/sucursales/:id
router.post('/', controller.create);       // POST /api/sucursales
router.put('/:id', controller.update);     // PUT /api/sucursales/:id
router.delete('/:id', controller.delete);  // DELETE /api/sucursales/:id

// Exporta las rutas
module.exports = router;