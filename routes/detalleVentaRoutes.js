const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVentaController');

router.get('/', detalleVentaController.getAll);
router.get('/venta/:ventaId', detalleVentaController.getByVentaId);
router.post('/', detalleVentaController.create);
router.delete('/:id', detalleVentaController.delete);

module.exports = router;
