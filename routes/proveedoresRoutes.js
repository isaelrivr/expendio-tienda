// Importa Express para crear las rutas
const express = require('express');
const router = express.Router();

// Importa el controlador que tiene la lógica
const controller = require('../controllers/proveedoresController');

// RUTAS disponibles para proveedores
router.get('/', controller.getAll);        // GET /api/proveedores
router.get('/:id', controller.getById);    // GET /api/proveedores/:id
router.post('/', controller.create);       // POST /api/proveedores
router.put('/:id', controller.update);     // PUT /api/proveedores/:id
router.delete('/:id', controller.delete);  // DELETE /api/proveedores/:id

// Exporta las rutas
module.exports = router;