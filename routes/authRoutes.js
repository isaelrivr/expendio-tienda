const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/perfil/:id', authController.getProfile);

module.exports = router;
