'use strict'
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authentificate');

// Controllers
const {
    listarTodos,
    listarConFiltro,
    registrar,
    registrarClienteAdmin,
    login,
} = require('../controllers/cliente.controller');


/**
 * 
 * Routes
 * /api/clientes
 * 
 */

router.get('/listar', listarTodos);
router.get('/listar-filtro/:tipo/:filtro?', [auth], listarConFiltro);

router.post('/registrar', registrar);
router.post('/registrar-con-admin', registrarClienteAdmin);
router.post('/login', login);

module.exports = router;