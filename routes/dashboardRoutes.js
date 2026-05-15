const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Obtener métricas de resumen
router.get('/resumen', dashboardController.getResumen);

module.exports = router;
