'use strict'
const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const auth = require('../middlewares/authentificate');
const { validarCampos } = require('../middlewares/validar-campos');

// Controllers
const { anadirProductoCarrito, obtenerProductosEnCarrito, eliminarProductoDeCarrito } = require('../controllers/carrito.controller');

// End-Points
router.post('/registra-producto-carrito/', [auth], anadirProductoCarrito);
router.get('/obtener-carrito-cliente/', [auth], obtenerProductosEnCarrito);
router.delete('/eliminar-producto-carrito/:id', [auth], eliminarProductoDeCarrito);


module.exports = router;