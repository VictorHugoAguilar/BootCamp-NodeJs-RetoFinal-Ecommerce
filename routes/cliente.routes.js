'use strict'
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authentificate');

// Controllers
const {
    registrar,
    login,
    listarTodos,
    listarConFiltro,
    registrarClienteConAdmin,
    listarClienteConAdmin,
    actualizarClienteConAdmin,
    eliminarClienteConAdmin,
} = require('../controllers/cliente.controller');


/**
 * 
 * Routes
 * /api/clientes
 * 
 */

router.post('/login', login);
router.post('/registrar', registrar);

router.get('/listar', listarTodos);

router.get('/listar-filtro/:tipo/:filtro?', [auth], listarConFiltro);
router.post('/registrar-con-admin', [auth], registrarClienteConAdmin);
router.get('/listar-cliente-con-admin/:id', [auth], listarClienteConAdmin);
router.put('/actualizar-cliente-con-admin/:id', [auth], actualizarClienteConAdmin);
router.delete('/eliminar-cliente-con-admin/:id', [auth], eliminarClienteConAdmin);

module.exports = router;