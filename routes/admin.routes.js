'use strict'
const express = require('express');
const router = express.Router();

// Controllers
const { obtenerTodos, registrar, login } = require('../controllers/admin.controller');

router.get('/obtener', obtenerTodos);
router.post('/registrar', registrar);
router.post('/login', login);

module.exports = router;