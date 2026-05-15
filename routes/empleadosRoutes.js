// Importa Express para crear las rutas
const express = require('express');
const router = express.Router();

// Importa el controlador que tiene la lógica
const controller = require('../controllers/empleadosController');

// RUTAS disponibles para empleados
router.get('/', controller.getAll);        // GET /api/empleados
router.get('/:id', controller.getById);    // GET /api/empleados/:id
router.post('/', controller.create);       // POST /api/empleados
router.put('/:id', controller.update);     // PUT /api/empleados/:id
router.delete('/:id', controller.delete);  // DELETE /api/empleados/:id

// Exporta las rutas
module.exports = router;