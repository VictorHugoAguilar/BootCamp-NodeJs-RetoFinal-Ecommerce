'use strict'
const express = require('express');
const router = express.Router();

// Controllers
const { listarTodos, listarConFiltro, registrar, login } = require('../controllers/cliente.controller');

router.get('/listar', listarTodos);
router.get('/listar-filtro/:tipo/:filtro?', listarConFiltro);

router.post('/registrar', registrar);
router.post('/login', login);

module.exports = router;