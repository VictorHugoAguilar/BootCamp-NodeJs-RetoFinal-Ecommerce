'use strict'
const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const auth = require('../middlewares/authentificate');
const { validarCampos } = require('../middlewares/validar-campos');

// CONTROLLERS
const {
    anadirProductoCarrito,
    obtenerProductosEnCarrito,
    eliminarProductoDeCarrito
} = require('../controllers/carrito.controller');

// ENDPOINTS
// CARRITO
router.post('/registra-producto-carrito/', [
        auth,
        check('producto', 'El producto es obligatorio').not().isEmpty(),
        check('cantidad', 'La cantidad es obligatoria').isNumeric().not().isEmpty(),
        check('variedad', 'La variedad es obligatoria').not().isEmpty(),
        validarCampos
    ],
    anadirProductoCarrito);
router.get('/obtener-carrito-cliente/', [auth], obtenerProductosEnCarrito);
router.delete('/eliminar-producto-carrito/:id', [auth], eliminarProductoDeCarrito);


module.exports = router;