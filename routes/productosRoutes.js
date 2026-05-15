/**
 * routes/productosRoutes.js
 * Solo define rutas. Toda la lógica de negocio vive en el Controller.
 * La configuración de archivos vive en middlewares/upload.js.
 */
const express = require('express');
const router = express.Router();

const controller = require('../controllers/productosController');
const upload = require('../middlewares/upload'); // Middleware dedicado

// GET /api/productos/buscar?q= — Búsqueda por nombre o marca
router.get('/buscar', controller.search);

// GET /api/productos/categoria/:categoria — Filtrar por categoría
router.get('/categoria/:categoria', controller.getByCategory);

// GET /api/productos — Obtener todos los productos
router.get('/', controller.getAll);

// GET /api/productos/:id — Obtener un producto por ID
router.get('/:id', controller.getById);

// POST /api/productos/upload — Subir imagen de producto
router.post('/upload', upload.single('foto'), controller.uploadImagen);

// POST /api/productos — Crear nuevo producto
router.post('/', controller.create);

// PUT /api/productos/:id — Editar producto existente
router.put('/:id', controller.update);

// DELETE /api/productos/:id — Eliminar producto
router.delete('/:id', controller.delete);

module.exports = router;